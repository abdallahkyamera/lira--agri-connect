
from django.urls import path
from .views import (
    register_view, 
    login_view, 
    produce_list_create, 
    produce_detail,
    produce_my_list,
    PredictPriceView,
)

urlpatterns = [
    # Authentication
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    
    # Produce CRUD
    path('produces/', produce_list_create, name='produce-list-create'),     
    path('produces/my/', produce_my_list, name='produce-my-list'),           # New: Farmer's produces
    path('produces/<int:pk>/', produce_detail, name='produce-detail'),    


    #price prediction
    path(
    "predict-price/",
    PredictPriceView.as_view(),
    name="predict-price"
),

]


