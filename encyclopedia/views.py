from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django import forms

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def entry (request, title):

    # Get the entry
    entry = util.get_entry (title)

    if not entry:
        # display error page
        return render (request, "encyclopedia/error.html")

    # display the entry page
    return render (request, "encyclopedia/entry.html", {
        "entry": entry,
    })


def search (request):
    
    # Get the query and remove whitespace and convert to lowercase
    query = request.GET["q"].strip().lower()

    # If the query is empty
    if not query:
        # display the error page
        return render (request, "encyclopedia/error.html")

    # Get all entries
    entries = util.list_entries()

    # create a empty set
    cleaned_entries = set ()

    # convert all the entries to lowercase and add to the set
    for entry in entries:
        cleaned_entries.add (entry.lower())

    # Keep track entries that have the query as a substring
    entry_set = set()

    # If the query in entries
    if query in cleaned_entries:
        # redirect user to the entry page
        return HttpResponseRedirect (reverse("encyclopedia:title", args=[query]))
    else:
        for entry in cleaned_entries:
            # if query is substring of entries
            if query in entry:
                # collect those entries
                entry_set.add (entry)        
        
        if (entry_set):
            # display the entry set
            return render (request, "encyclopedia/search_results.html", {
                "entry_set": entry_set,
            })
        else:
            return render (request, "encyclopedia/error.html")
    


