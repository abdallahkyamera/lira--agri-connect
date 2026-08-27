

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    )


    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
    phone = models.CharField(max_length=20, blank=False)
    location = models.CharField(max_length=100, blank=False)

    # New fields for verification
    national_id = models.CharField(max_length=50, unique=True, blank=False,)
    trade_license = models.CharField(max_length=50,  blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Produce(models.Model):
    CATEGORY_CHOICES = (
        ('Vegetables', 'Vegetables'),
        ('Fruits', 'Fruits'),
        ('Grains', 'Grains'),
        ('Tubers', 'Tubers'),
        ('Legumes', 'Legumes'),
        ('Livestock', 'Livestock'),
        ('Dairy', 'Dairy'),
        ('Others', 'Others'),
    )

    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='produces')
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Vegetables')
    
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='kg')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='produces/', blank=True, null=True)
    
    status = models.CharField(max_length=20, default='available', choices=[
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('unavailable', 'Unavailable')
    ])

    # Allow different locations per produce
    district = models.CharField(max_length=100, blank=True)
    sub_county = models.CharField(max_length=100, blank=True)
    village = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"

class Order(models.Model):
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='buyer_orders')
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order by {self.buyer} for {self.produce.name}"
    pass

class PricePrediction(models.Model):
    produce = models.ForeignKey(
        Produce,
        on_delete=models.CASCADE
    )



    produce_name = models.CharField(max_length=100)
    predicted_price = models.DecimalField(max_digits=10, decimal_places=2)
    prediction_date = models.DateField()
    confidence = models.FloatField()

    def __str__(self):
        return f"{self.produce_name} - {self.predicted_price}"
    pass


