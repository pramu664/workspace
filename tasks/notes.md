# notes on task managment app

# NOTES


## Stying

Go in to the app's directory and create a directory called 'static' and in that folder create a file called styles.css.

Go in to the index.html and  say to django to we are about to load static files to this file by adding {% load static %} top of the static file.

```htmldjango
	{% load static %}
```

Add a link tag and add the following.

ex -:
```html
	<link rel="stylesheet" href="{% static 'newyear/styles.css' %}"

```
When linking  styles we can say to django to find the stylesheet by saying "it's going to be a static file and it's name is APPNAME/STYLES.CSS."

We are doing this because when our workspace getting larger it's kind a pain to write the url path every time when we are changing them so it's better to give  the name of the static file. in this case newyear/styles.css meaning **newyear's styles or hello's styles or taskmanagement apps styles or notion's styles or gmail's styles** so on and so forth.

## Making a Task management app

Go in to the terminal and create a new app.
`python manage.py startapp tasks`

Go in to the settings.py and install the app.

Go in to the top urls.py file and combine the tasks app urls.

Go in to the tasks directory create a file called urls.py and go to that and  add the following python code.

```python
from django.urls import path

from . import views

urlpatterns = [
	path ("", views.index, name="index"),
]

```
Go in to the views.py file and write the index function.

```python
tasks = ["foo", "bar", "baz"]

def index (request):
	return render (request, "tasks/index.html", {
		"tasks": tasks,
	})

```
The "tasks" is the variable django template have acess and the tasks is the python variable that holding the list of string values.

Go in to the tasks directory and create a folder called "templates" inside that folder create another folder called "tasks" inside that folder create a file called index.html. 

Go in to the index.html and write the basic html code.
```html
	<body>
		<ul>
			{% for task in task %}	
				<li>{{ task }}</li>
			{% endfor %}
		</ul>
	</body>
```
hear we loop over all the tasks and plug them inside list items and all the list items are inside the unorderd list. The idea is those list items are dynamic.

### forms

let's create a form in a new page that we can add tasks.

Go in to the views.py file and write the follwing.

```python

def add (request):
	return render (request, "tasks/add.html")

```
Go in to the urls.py file and add a url that associate with this function.

```python
	...
	path ("add", views.add, "name=add"),
	...
```
Go ahead to the tasks's templates and write add.html file.

```html
<h1>Add Task</h1>
<form>
	<input type="text" name="task" />
	<input type="submit" />
</form>
```
### template inheritance

This is just a django template called "layout.html" that other files can inherit from.

Go ahead and create a new file called "layout.html" in templates/tasks directory.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<title>tasks</title>
</head>
	<body>
		{% block body %}
		{% endblock %}
	</body>

```
What I am saying in hear is that the content of the block can change and rest of the html stays same.

The body is a name we give to we can add any name we like.

Go to the other html pages and do the following.

```
{% extends "tasks/layout.html" %}

	{% block body %}
			// code
	{% endblock %}

```

### linking pages

Go to the index.html and write the following.

```html

	<a href="{% url 'add' %}">Add a new task</a>

	// Namespace collisions can happen!
	<a href="{% url 'index' %}">View tasks</a> 

```
Don't write literal url path insted  use the url route name that we give in the urls.py file.
In hear namespace collisions can happen because we got index in every other apps url names. so add the apps name.

### Fixing namespace collision

Go to the urls.py file in current app and give an app name.
```python
app_name = "tasks"

```
Go to the add.html and do the following.

```html
<a href="{% url 'tasks:index' %}">View Tasks </a>
<a href="{% url 'tasks:add' %}">View Tasks </a>

```

### Continues..

Go to the add.html and add a action to the form.

```html

<form action="{% url 'tasks:add' %}" method="post">

</form>

```
action tag is the way it to take the form and submiting somewhere.
In hear we sending back to the add url we know that we can handle this url routes requests using add function. 

Try to submit and you will get Frobidden (403) CSRF verification failed. Bad guys can write requests to our webserver. 
So make sure to design your form don't allowing such things. we can do that by adding {% csrf token %} with the form so when we send the data we also send this token so django will allow you to do the action.

so what happen hear is that when every time user or I  goes to our add.html to write a task django will generate unique token. So when you submit the form the token also go with the form data for validation if the token valid then django will allow you to submit data via whatever url that action pointing to.

So a bad guy(adversary) can't fake a request because then don't know what is the token is and that's it.


### Django middleware

The csrf is not turned on by default by django. This request response middle part is handle by django middleware. 

Go to the settings.py file and look at the MIDDLEWARE and you see some bunch of middleware's that working under the hood when you are requesting or respoincing you will see that csrf middlewhare also.

Go to the add.html and add the following,
```djangohtml
	<form action="{% url 'tasks:add.html' %}">
		{% csrf_token %}
		// code
	</form>
```

If you want to look at that token go ahead and open the page's source file and look at the token.

### Creating form using django cool way (2nd way using python)

Go to the views.py in current app and import the forms and add the following python code.

```python
	from django import forms
	
	class NewTaskForm (forms.Form):
		task = forms.CharField (label="New Task")

	
	def add (request):
		return render (request, "tasks/add.html", {
			"form": NewTaskForm ()
		})

```
Go to the add.html and do the following,

 ```djangohtml
	<form action="{% url 'tasks:add.html' %}">
		{% csrf_token %}
		{{ form }}
	</form>
 ```
Go and relad the page and see the result.

Go to the views.py again and do the following.

```python

	class NewTaskForm (forms.Form):
		task = forms.CharField (label="New Task")
		priority = forms.IntegerField (label="Priority", min_value=1, max_value=10)

```
Now go to the page and refresh and you will see additional field.if you want add some css to style this up.

Look at when you are giving the priority it gives that client side validation also man.

But in general not only we need to add client side validation and aslo server side validation because this client side validation can disable by user.

### server-slde validation

Go to the views.py file and add the following python code.

```python
def add (request):
	if request.method == 'POST':
		# process the result of that request
		form = NewTaskForm (request.POST)
		if form.is_valid ():
			task = form.cleaned_data["task"]
			tasks.append (task)
		else:
			return render (request, "tasks/add.html", {
			"form": form
			})
```
request.POST contain all of the data that user submitted. 
`form.cleaned_data` got all the cleaned data. You can use bracketing to get the look up the key and get the data you want.

In the else block what I done hear is that when the form is got not valid I just display what is the error to user whatever the error that that person make.

Go to the page and do some testing all the things if they are working.

That validation trick by Brian is cool try out that. to get the idea that why it is important both client and server side validation.


back to crafting,

Go to the views.py file and redirect the user to the list of tasks.

```python
	# Hard coding the url
	return HttpResponseRedirect ("/tasks") or
	# cool way: figure out the url of the my task's app index route  # and use that to redirect the user
	return HttpResponseRedirect (reverse ("task:index")) 
```
```python
from django.http import HttpResponseRedirect
from django.urls import reverse
```
So now I am going to redirect to the index page after I submitted a task.

### sessions

Now differnt users see exact same app. you can look at by going in to incognito mode and launching the app in there. You see the same result. But we don't want that behaviour, the reason that behaviour happens becuse our application share same tasks variable.

so we can use sessions to remember who you are and more importantally they can store information about your particular session at that moment.

particular session, the session that you spend time using the application.

let's use sessions.

go in to the views.py and write the following python code,
```python
	
	def index (request):
		if "tasks" not in request.session:
			request.session ["task"] = []

		return render (request, "tasks/index.html", {
			"tasks": request.session ["tasks"]
		})


```
You can think session is some big dictionary and write code to manupulate that dicionary.

If you refresh you will get `OperationalError, no such table: django_session`. Django stores data inside of table right now the table doesn't exsist. so we need to create that table.

```terminal

python manage.py migrate

```
Go and run the server and refersh the page.

Hear is some additional logic for foo loop in index.html template.
```djangohtml

	{% for task in tasks %}
		<li>{{ task }}</li>
	{% empty %}
		<li>No tasks.</li>
	{% endfor %}

```

That is cool feature of django.
Now go in to the views.py and to the add function and add the following after getting the task.

```
	request.session ["task"] += ["task"]
```

So finally give it a try. and try using incognito mode. so Django know who you are by using cookies. Handstamps that browser's use to give information to the server so sever knows what data to show me.

Django who knows who I am ..
scratch the sufrace what django offer.
Create dynamic web application
Generate programatially custom html
conditionaly display something
strore data about users information
Just the beginiing,
Django get's very powerful when storing data inside databases and manupulating them.
