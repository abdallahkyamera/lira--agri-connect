from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings


class Command(BaseCommand):
    help = "Check production authentication"

    def handle(self, *args, **options):
        User = get_user_model()

        print("Database engine:")
        print(settings.DATABASES["default"]["ENGINE"])

        print("\nUsers:")
        for user in User.objects.all():
            print(
                user.id,
                user.username,
                user.is_active,
                user.has_usable_password()
            )