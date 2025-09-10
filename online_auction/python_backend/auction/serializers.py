from .models import Item
from rest_framework import serializers
from django.contrib.auth.models import User


class ItemSerializer(serializers.ModelSerializer):
    formatted_created_at = serializers.SerializerMethodField()
    expires_at = serializers.SerializerMethodField() 
    class Meta:
        model = Item
        fields = '__all__'  

    def get_formatted_created_at(self, obj):
        return obj.formatted_created_at()
    
    def get_expires_at(self, obj):
        return obj.expires_at() 
        
class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['username', 'email', 'password']
            extra_kwargs = {
                'password': {'write_only': True}
            }
        def create(self,validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        
   