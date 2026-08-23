
import os
import sys
import django
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

# ── Django setup ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Produce


def train_model():
    produces = Produce.objects.all()

    if produces.count() < 5:
        print(f"❌ Only {produces.count()} records — need at least 5 to train.")
        return

    # ── Load data ─────────────────────────────────────────────
    data = pd.DataFrame(
        list(produces.values("name", "category", "district", "quantity", "price"))
    )

    print(f"\n✅ Loaded {len(data)} records")
    print(data.head())

    # ── Normalize text fields ─────────────────────────────────
    # Lowercase + strip so "Beans", "BEANS", "beans" all become "beans"
    data["name"]     = data["name"].str.strip().str.lower()
    data["category"] = data["category"].str.strip().str.lower()
    data["district"] = data["district"].fillna("unknown").str.strip().str.lower()

    # Drop rows with missing price or quantity
    data = data.dropna(subset=["price", "quantity"])
    data["price"]    = data["price"].astype(float)
    data["quantity"] = data["quantity"].astype(float)

    print(f"\n📦 Unique produces : {sorted(data['name'].unique().tolist())}")
    print(f"📂 Unique categories: {sorted(data['category'].unique().tolist())}")
    print(f"📍 Unique districts : {sorted(data['district'].unique().tolist())}")

    # ── Encode ────────────────────────────────────────────────
    produce_encoder  = LabelEncoder()
    category_encoder = LabelEncoder()
    district_encoder = LabelEncoder()

    data["name"]     = produce_encoder.fit_transform(data["name"])
    data["category"] = category_encoder.fit_transform(data["category"])
    data["district"] = district_encoder.fit_transform(data["district"])

    X = data[["name", "category", "district", "quantity"]]
    y = data["price"]

    # ── Train ─────────────────────────────────────────────────
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X, y)

    # ── Save ──────────────────────────────────────────────────
    os.makedirs("api/ml", exist_ok=True)
    joblib.dump(model,            "api/ml/price_model.pkl")
    joblib.dump(produce_encoder,  "api/ml/produce_encoder.pkl")
    joblib.dump(category_encoder, "api/ml/category_encoder.pkl")
    joblib.dump(district_encoder, "api/ml/district_encoder.pkl")

    print(f"\n🎉 Model trained and saved successfully!")
    print(f"   Knows {len(produce_encoder.classes_)} produces: {list(produce_encoder.classes_)}")


if __name__ == "__main__":
    train_model()
