# # api/signals.py
# from django.db.signals import post_save
# from django.dispatch import receiver
# from .models import Produce


# @receiver(post_save, sender=Produce)
# def retrain_on_new_produce(sender, instance, created, **kwargs):
#     if created:
#         count = Produce.objects.count()
#         if count >= 5:
#             print("Retraining model with", count, "records...")
#             try:
#                 from api.ml.train_model import train_model
#                 train_model()
#                 import api.ml.predict as pred_module
#                 import joblib
#                 pred_module.model            = joblib.load("api/ml/price_model.pkl")
#                 pred_module.produce_encoder  = joblib.load("api/ml/produce_encoder.pkl")
#                 pred_module.category_encoder = joblib.load("api/ml/category_encoder.pkl")
#                 pred_module.district_encoder = joblib.load("api/ml/district_encoder.pkl")
#                 pred_module.KNOWN_PRODUCES   = list(pred_module.produce_encoder.classes_)
#                 pred_module.KNOWN_CATEGORIES = list(pred_module.category_encoder.classes_)
#                 pred_module.KNOWN_DISTRICTS  = list(pred_module.district_encoder.classes_)
#                 print("Model retrained and reloaded")
#             except Exception as e:
#                 print("Retraining failed:", e)