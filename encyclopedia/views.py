from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from . import util

import random
import re


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

    # CONVERT MARKDOWN TO HTML

    # TODO: Headings
    html_entry = re.sub ("#(.+)", r"<h1>\1</h1>", entry)

    # TODO: links external link detection
    html_entry = re.sub ("\[(.+)\]\((.+)\)", r"<a href='\2'>\1</a>", html_entry)

    # TODO  boldfase text: contain bugs
    html_entry = re.sub ("\*\*(.+)\*\*", r"<b>\1</b>", html_entry)

    # TODO italasize text: contain bugs
    html_entry = re.sub ("\*(.+)", r"<i>\1</i>", html_entry)

    # paragraphs
    html_entry = re.sub ("(\n)", r"<br />", html_entry)

    # TODO: Unorderd list
    # html_entry = re.sub ("", "<li>\1</li>", html_entry)
    
    
    # display the entry page
    return render (request, "encyclopedia/entry.html", {
        "title": title,
        "entry": html_entry,
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
    



def new_page (request):
    if request.method == 'POST':
        
        # Get the title and content and remove the whitespace
        title = request.POST["title"].strip()
        content = request.POST["content"].strip()
        
        # Check to see title or content provided
        if (not title) or (not content):
            message = "Missing title/content"
            return render (request, "encyclopedia/new_page.html", {
                "message": message,
            })

        # make the title to lowercase
        cleaned_title = title.lower()

        # Get all the entries
        entries = util.list_entries()

        # make all the entries to lower case and add to the set
        cleaned_entries = set ()
        for entry in entries:
            cleaned_entries.add(entry.lower())
        
        # Check to see entry is already in the set
        if cleaned_title in cleaned_entries:
            return render (request, "encyclopedia/error.html")
        
        # save the entry to disk
        util.save_entry (cleaned_title, content)

        # Go to new entry page
        return HttpResponseRedirect (reverse ("encyclopedia:new_page"))

    return render(request, "encyclopedia/new_page.html")



def random_page (request):
    # Get all entries
    entries = util.list_entries ()

    # Get random entry 
    num = random.randint (0, len(entries) - 1)
    random_entry = entries[num]

    # Redirect to that entry page
    return HttpResponseRedirect (reverse ("encyclopedia:title", args=[random_entry]))




def edit (request, title):

    if request.method == 'POST':

        # Get the edited entry
        edited_entry =  request.POST["content"]
        
        # Remove new lines
        cleaned_entry = edited_entry.replace ("\r", "")

        # save edited entry to disk
        util.save_entry (title, cleaned_entry)

        # redirect to the edited entry
        return HttpResponseRedirect (reverse ("encyclopedia:title", args=[title]))


    # Get the entry 
    entry = util.get_entry (title)

    # render html page with entry
    return render (request, "encyclopedia/edit_page.html", {
        "entry": entry,
        "title": title,
    })

