from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Item
from .serializers import ItemSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
#Register a user, save to Django User
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


#Auction listing management (CRUD operations)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_items(request):
   
    items = Item.objects.all()
    serialized_item = ItemSerializer(items, many=True).data
    return JsonResponse(serialized_item, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_items(request):
    
    data = request.data
    print("Received data:", data)
    print(data["name"]) # valid
    serializer = ItemSerializer(data=data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, safe=False)
    else:
        print("Error:", serializer.errors)
        return JsonResponse(serializer.errors, safe=False)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_item(request, id):
    item = Item.objects.get(id=id)
    serialized_item = ItemSerializer(item).data
    return JsonResponse(serialized_item, safe=False)
#Updating a bid price
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def bid_item(request, id):
    item = Item.objects.get(id=id)
    data = request.data
    print("Received data:", data) 
    serialized_item = ItemSerializer(instance=item, data=data, partial=True)
    #update only the current price
    if serialized_item.is_valid():
        serialized_item.save()
        return JsonResponse(serialized_item.data, safe=False)
    else:
        print("Error:", serialized_item.errors)
        return JsonResponse(serialized_item.errors, safe=False)
    
#Updating an item status
@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def update_item_status(request,id):
    item = Item.objects.get(id=id)
    data = request.data
    print("Received data:", data) 
    serialized_item = ItemSerializer(instance=item, data=data, partial=True)
    #update only the current price
    if serialized_item.is_valid():
        serialized_item.save()
        return JsonResponse(serialized_item.data, safe=False)
    else:
        print("Error:", serialized_item.errors)
        return JsonResponse(serialized_item.errors, safe=False)
    

    


# TODO: Add Delete
    
   