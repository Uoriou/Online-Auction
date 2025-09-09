from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    is_active = models.BooleanField(default=True) #true if an item is available, false otherwise
    available_duration = models.DurationField(default=timedelta(minutes=1))
    #bidder = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    #Im using serializer so this is irrelevant 
    def save(self, *args, **kwargs):
        if self.current_price is None:
            self.current_price = self.starting_price
        super().save(*args, **kwargs)
        
#class ItemPriceHistory(models.model):
    #price_history = models.ForeignKey(Item,on_delete=models.CASCADE)

