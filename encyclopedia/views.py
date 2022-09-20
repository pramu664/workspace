from django.http import HttpResponse
from django.shortcuts import render

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
