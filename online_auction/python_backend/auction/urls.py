from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('api/', include(router.urls)),
    path('items/', views.get_items,name="home"),
    path('item/<int:id>/', views.get_item,name="item"),
    path('add/', views.add_items,name="add"),
    path('bid/<int:id>/', views.bid_item,name="bid"), #Update the current price 
    path('item_status/<int:id>/', views.update_item_status,name="status"), #Update an item status
    path('bid_history/<int:id>/', views.get_bids_history,name="history"), 
   
]