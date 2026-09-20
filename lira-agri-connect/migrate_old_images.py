from pathlib import Path
from django.conf import settings
from django.core.files import File
from api.models import Produce

print("Starting image migration...\n")

for p in Produce.objects.filter(image__isnull=False).exclude(image=''):
    filename = Path(p.image.name).name
    file_path = Path(settings.MEDIA_ROOT) / "produces" / filename

    if file_path.exists():
        print(f"Uploading ID {p.id}: {filename}")

        try:
            with open(file_path, "rb") as f:
                p.image.save(filename, File(f), save=True)

            print(f"SUCCESS: {p.image.url}\n")

        except Exception as e:
            print(f"ERROR ID {p.id}: {e}\n")

    else:
        print(f"SKIPPED ID {p.id}: {filename} - local file missing\n")

print("Migration finished.")