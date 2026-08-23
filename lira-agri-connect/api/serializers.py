


from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Produce, Order

User = get_user_model()


# ================= USER SERIALIZER =================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone', 'location',
            'national_id', 'trade_license', 'is_verified'
        ]


# ================= REGISTER SERIALIZER =================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'role', 'phone', 'location',
            'first_name', 'last_name', 'national_id', 'trade_license'
        ]

    def create(self, validated_data):
        # Only farmers should provide national_id and trade_license
        if validated_data.get('role') == 'farmer':
            if not validated_data.get('national_id') or not validated_data.get('trade_license'):
                raise serializers.ValidationError({
                    "national_id": "National ID is required for farmers",
                    "trade_license": "Trade License is required for farmers"
                })

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'buyer'),
            phone=validated_data.get('phone', ''),
            location=validated_data.get('location', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            national_id=validated_data.get('national_id'),
            trade_license=validated_data.get('trade_license'),
        )
        return user


# ================= PRODUCE SERIALIZER =================
class ProduceSerializer(serializers.ModelSerializer):
    farmer = UserSerializer(read_only=True)

    class Meta:
        model = Produce
        fields = [
            'id', 'farmer', 'name', 'category', 'quantity', 'unit',
            'price', 'description', 'image', 'status',
            'district', 'sub_county', 'village',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# ================= ORDER SERIALIZER =================
class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    produce = ProduceSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

