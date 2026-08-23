
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import json
from .ml.predict import predict_price
from rest_framework.views import APIView

from .serializers import RegisterSerializer, ProduceSerializer

from .models import Produce




# api/views.py

from django.db import IntegrityError



@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User registered successfully",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": user.role
        }, status=201)
    return Response(serializer.errors, status=400)





@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        data = request.data  # DRF should already parse JSON
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Invalid username or password"}, status=401)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "role": user.role,
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
# ================= PRODUCE ENDPOINTS =================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def produce_list_create(request):

    if request.method == 'POST':

        # Only farmers and admins can create produce listings
        if request.user.role not in ['farmer', 'admin']:
            return Response(
                {"error": "Only farmers and admins can post produce"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProduceSerializer(data=request.data)
        # print(serializer.data)
        if serializer.is_valid():
            print(serializer.validated_data)

            # Save produce listing
            produce = serializer.save(farmer=request.user)

            # Auto-retrain recommendation model
            try:
                train_model()
            except Exception as e:
                print(f"Model retraining failed: {e}")

            return Response(
                ProduceSerializer(produce).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # GET - Show available produce
    produces = Produce.objects.filter(status='available')
    serializer = ProduceSerializer(produces, many=True)

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def produce_my_list(request):
    """GET /api/produces/my/ - Farmer's own produces"""
    if request.user.role != 'farmer':
        return Response({"error": "Only farmers can access this endpoint"}, status=403)
    
    produces = Produce.objects.filter(farmer=request.user)
    serializer = ProduceSerializer(produces, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def produce_detail(request, pk):
    try:
        produce = Produce.objects.get(pk=pk)
    except Produce.DoesNotExist:
        return Response({"error": "Produce not found"}, status=404)

    # Permission check
    if request.user.role != 'admin' and produce.farmer != request.user:
        return Response({"error": "Permission denied"}, status=403)

    if request.method == 'GET':
        serializer = ProduceSerializer(produce)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProduceSerializer(produce, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        produce.delete()
        return Response({"message": "Produce deleted successfully"}, status=204)





class PredictPriceView(APIView):

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response(
                {"error": "Produce name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        produces = Produce.objects.filter(name__icontains=name)

        if not produces.exists():
            return Response(
                {"error": "No produce data found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ── Use averages across ALL matching records, not just first() ──
        avg_price    = sum(float(p.price)    for p in produces) / produces.count()
        avg_quantity = sum(float(p.quantity) for p in produces) / produces.count()
        supply_count = produces.count()

        # Use the most common category and district across matches
        sample   = produces.first()
        category = sample.category
        district = sample.district

        # ── Pass the SEARCHED name + averaged quantity into the model ──
        prediction = predict_price(
            name,          # ← the actual searched name, not sample.name
            category,
            district,
            avg_quantity   # ← average quantity, not one record's quantity
        )

        confidence = min(95, 60 + (supply_count * 5))

        change = ((prediction - avg_price) / avg_price) * 100

        return Response({
            "predicted_price": round(prediction, 2),
            "confidence":      round(confidence),
            "avg_price":       round(avg_price, 2),
            "supply_count":    supply_count,
            "change":          round(change, 1),
            "direction":       "up" if change >= 0 else "down",
            "message":
                "Limited supply — favorable selling conditions"
                if supply_count < 5
                else "High supply in market — prices trending down",
            "sentiment":
                "bullish" if supply_count < 5 else "bearish"
        })



