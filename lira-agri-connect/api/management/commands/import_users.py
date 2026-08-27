import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Import existing users from users.json without creating duplicates"

    def handle(self, *args, **options):
        User = get_user_model()

        fixture_path = Path("users.json")

        if not fixture_path.exists():
            self.stdout.write(
                self.style.ERROR("users.json was not found.")
            )
            return

        with open(fixture_path, "r", encoding="utf-8") as file:
            users = json.load(file)

        imported = 0
        skipped = 0

        for item in users:
            if item.get("model") != "api.customuser":
                continue

            fields = item["fields"]
            username = fields["username"]

            if User.objects.filter(username=username).exists():
                skipped += 1
                self.stdout.write(
                    f"Skipped existing user: {username}"
                )
                continue

            user = User(
                username=username,
                first_name=fields.get("first_name", ""),
                last_name=fields.get("last_name", ""),
                email=fields.get("email", ""),
                is_staff=fields.get("is_staff", False),
                is_active=fields.get("is_active", True),
                is_superuser=fields.get("is_superuser", False),
                role=fields.get("role"),
                phone=fields.get("phone", ""),
                location=fields.get("location", ""),
                national_id=fields.get("national_id"),
                trade_license=fields.get("trade_license"),
                is_verified=fields.get("is_verified", False),
            )

            # Preserve the existing Django password hash.
            user.password = fields["password"]

            user.save()

            imported += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Imported user: {username}"
                )
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Imported: {imported}, Skipped: {skipped}"
            )
        )