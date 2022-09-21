from django.urls import path

from . import views

app_name = 'encyclopedia'
urlpatterns = [
    path("", views.index, name="index"),
    path ("search", views.search, name="search"),
    path ("new_page", views.new_page, name="new_page"),
    path ("edit", views.edit_page, name="edit_page"),
    path ("<str:title>", views.entry, name="title"),
]
