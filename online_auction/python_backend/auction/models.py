from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField # For storing a list if you are using Postgres

# Create your models here.

class Item(models.Model):

    def default_expiry():
        return timezone.now() + timedelta(minutes=3)
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    is_active = models.BooleanField(default=True) #true if an item is available, false otherwise
    created_at = models.DateTimeField(auto_now_add=True) # it is not clearly formatted
    expires_at = models.DateTimeField(default=default_expiry)

class BidHistory(models.Model):
    # want the record of price history of an item
    history = models.ForeignKey("Item", related_name="history", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    

       

    """def formatted_available_duration_hour(self):
        total_seconds = int(self.available_duration.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
       
        return f"{hours:02}"
    
    def formatted_available_duration_minutes(self):
        total_seconds = int(self.available_duration.total_seconds())
        hours,remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{minutes:02}"
    
    def formatted_available_duration_seconds(self):
        total_seconds = int(self.available_duration.total_seconds())
        hours,remainder = divmod(total_seconds, 3600)
        minutes,seconds = divmod(remainder, 60)
        return f"{seconds:02}"

    # ! This is causing a trouble
    #def expires_at(self):
        #return self.created_at + self.available_duration
    def formatted_created_at(self):
        return self.created_at.strftime("%Y-%m-%d %H:%M:%S")
    """
    
    #Im using serializer so this is irrelevant 
    #def save(self, *args, **kwargs):
        #if self.current_price is None:
            #self.current_price = self.starting_price
        #super().save(*args, **kwargs)
        

