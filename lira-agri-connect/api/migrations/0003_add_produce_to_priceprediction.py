from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_customuser_national_id_alter_customuser_role'),
    ]

    operations = [
        migrations.RunSQL(
            sql=migrations.RunSQL.noop,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]