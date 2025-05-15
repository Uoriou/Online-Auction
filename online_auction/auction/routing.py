from django.urls import path
from .consumers import BidConsumer
from django.urls import re_path


web_socket_url_patterns = [
    path(r'ws/auction/', BidConsumer.as_asgi()),
]   


__all__ = ["websocket_urlpatterns"]
