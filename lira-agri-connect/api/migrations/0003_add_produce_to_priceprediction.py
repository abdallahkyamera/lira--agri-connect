from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_customuser_national_id_alter_customuser_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='priceprediction',
            name='produce',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='api.produce',
            ),
        ),
    ]