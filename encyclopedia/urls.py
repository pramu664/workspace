from django.urls import path

from . import views

app_name = 'encyclopedia'
urlpatterns = [
    path("", views.index, name="index"),
    path ("search", views.search, name="search"),
    path ("new_page", views.new_page, name="new_page"),
    path ("random_page", views.random_page, name="random_page"),
    path("<str:title>/edit", views.edit, name="edit"),
    path ("<str:title>", views.entry, name="title"),
]
