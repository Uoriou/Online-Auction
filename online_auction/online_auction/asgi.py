"""
ASGI config for online_auction project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from auction.routing import web_socket_url_patterns # type: ignore


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_auction.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # WebSocket handler will be added here later
    "websocket": AuthMiddlewareStack(
        URLRouter(
            web_socket_url_patterns
        )
    ),
})
