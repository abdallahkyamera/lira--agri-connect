from django.contrib import admin
from .models import CustomUser, Produce, Order, PricePrediction

admin.site.register(CustomUser)
admin.site.register(Produce)
admin.site.register(Order)
admin.site.register(PricePrediction)