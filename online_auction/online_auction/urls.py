"""
URL configuration for online_auction project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings 
from django.conf.urls.static import static 
from auction import views # getting the views from the auction app
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auction/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auction/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auction-auth/', include('rest_framework.urls')),
    path('auction/register/', views.CreateUserView.as_view(), name='register'),
    path('auction/', include('auction.urls')),
    #CreateUserView link ?? I m using CreateUserView(generics.CreateAPIView): in views.py
]

if settings.DEBUG:  # new
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
