

import joblib
import difflib
import pandas as pd

model            = joblib.load("api/ml/price_model.pkl")
produce_encoder  = joblib.load("api/ml/produce_encoder.pkl")
category_encoder = joblib.load("api/ml/category_encoder.pkl")
district_encoder = joblib.load("api/ml/district_encoder.pkl")

KNOWN_PRODUCES   = list(produce_encoder.classes_)   # all lowercase after retrain
KNOWN_CATEGORIES = list(category_encoder.classes_)
KNOWN_DISTRICTS  = list(district_encoder.classes_)


def best_match(value, known_classes):
    """
    Normalize input then fuzzy-match to the nearest known encoder class.
    This handles: 'Beans' → 'beans', 'LIRA' → 'lira', typos, etc.
    """
    normalized = value.strip().lower()

    # 1. Exact match after normalization
    if normalized in known_classes:
        return normalized

    # 2. Fuzzy match (handles typos / partial names)
    matches = difflib.get_close_matches(normalized, known_classes, n=1, cutoff=0.4)
    if matches:
        print(f"  Fuzzy match: '{value}' → '{matches[0]}'")
        return matches[0]

    # 3. Substring match — e.g. 'fresh tom' matches 'fresh tomatoes'
    for cls in known_classes:
        if normalized in cls or cls in normalized:
            print(f"  Substring match: '{value}' → '{cls}'")
            return cls

    # 4. Fall back to first known class rather than crashing
    print(f"  ⚠ No match for '{value}' — falling back to '{known_classes[0]}'")
    return known_classes[0]


def predict_price(produce_name, category, district, quantity):
    try:
        matched_produce  = best_match(produce_name, KNOWN_PRODUCES)
        matched_category = best_match(category,     KNOWN_CATEGORIES)
        matched_district = best_match(district,     KNOWN_DISTRICTS)

        print(f"\n🔍 Predicting:")
        print(f"   produce : {produce_name!r} → {matched_produce!r}")
        print(f"   category: {category!r} → {matched_category!r}")
        print(f"   district: {district!r} → {matched_district!r}")
        print(f"   quantity: {quantity}")

        produce_value  = produce_encoder.transform([matched_produce])[0]
        category_value = category_encoder.transform([matched_category])[0]
        district_value = district_encoder.transform([matched_district])[0]

    except ValueError as e:
        print(f"❌ Encoder error: {e}")
        return None

    features = pd.DataFrame(
        [[produce_value, category_value, district_value, quantity]],
        columns=["name", "category", "district", "quantity"]
    )

    prediction = model.predict(features)
    print(f"   result  : UGX {float(prediction[0]):,.2f}")
    return float(prediction[0])
