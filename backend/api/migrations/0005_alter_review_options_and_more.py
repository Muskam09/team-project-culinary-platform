from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_shoppinglist_shoppingitem_mealentry'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='review',
            options={'ordering': ['-created_at']},  # пример, оставь как было у тебя
        ),
        migrations.AddConstraint(
            model_name='review',
            constraint=models.CheckConstraint(
                check=models.Q(rating__gte=1, rating__lte=5),
                name='rating_between_1_5',
            ),
        ),
    ]
