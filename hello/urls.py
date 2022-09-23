from django.urls import path

from . import views

urlpatterns = [
    path("", views.index1, name="index"),
    path("css_layout", views.css_layout, name="css_layout"),
    path("<str:name>", views.greet1, name="greet"),
    path("brian", views.brian, name="brian"),
    path("david", views.david, name="david"),
]
