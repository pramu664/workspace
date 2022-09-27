#SQL
Today I am going to learn about SQL, Models and Migrations. I know that this takes full day to complete. but I am up to the challenge as a bonus I will write some programs to fill up the program's checklist.

First, I need to learn about SQL. I know that is database language. MySQL, PostgreSQL and SQLite are called "Database Management Systems" they are programs not database languages.

MySQL and PostgreSQL programs running on separate servers. They are heavy database management systems. The reason that MySQL and PostgreSQL running on separate servers is that the App itself is separated from the sever for example if the app is going down the database is safe and the database is gone down app is safe and also debugging can be easier.

SQLite app is not running on server. So, it makes easier to work with SQLite rather than others. 

SQLite supports fairly small data types,
    TEXT,
    Numeric,
    INTEGER,
    REAL,
    BLOB

MYSQL Types,
    CHAR (size)
    VARCHAR (size)
    SMALLINT
    INT
    BIGINT
    FLOAT
    DOUBLE
    ....

CREATE TABLE

CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration INTEGER NOT NULL
);

CREATE TABLE is the command.
"flights" is the name of the table
id, origin, destination and duration are the columns.
datatypes such INTEGER, TEXT are saying what type of data can hold each column.
Others are such PRIMARY KEY and NOT NULL are additional constraints.

PRIMARY KEY means that is the primary way I can uniquely identify a flight. In other words, I can look up the id to get one single flight.
NOT NULL means this row can't be empty. No matter what origin, destination and duration can't be empty. In other words, every flight needs to have origin, destination and duration.

Finally, the "AUTOINCREMENT" is telling SQLite to automatically increment when I add a new flight to the table. I don't need to provide id to SQL and SQL automatically do this for me. SQL automatically update the id when I add a new row to the table.

Other Constraints,
CHECK
DEFAULT
NOT NULL
PRIMARY KEY
UNIQUE
...

One reason is that using constrains is that when you add data to the data base it's needs to valid in some way. For example, "CHECK" can be used to if you got a movies table, and you want to add a movie rating in particular range for example 1 to 5 you can add the CHECK constrains to the column of range doing some sort of validation.

INSERT

INSERT INTO flights
    (origin, destination, duration)
    VALUES ("New York", "London", 415);

SELECT

SELECT * FROM flights

SELECT FROM flights means I want to select data from flights table.  "*" select all the possible columns and rows. 

SELECT origin, destination FROM flights;

select data from flights table, all of the rows in origin column and destination column

Now reducing the rows,
SELECT * FROM flights WHERE  id = 3;

select data from the table, get me all the rows that id is 3.

SELECT * FROM flights WHERE origin = "New York"

select data from the table, get the rows that origin is New York.

The idea of learning day is to collect and practice some interesting English words, verbs and sentences that related to the class I am taking that day. For example, today I am taking a class that created by Brian about SQL, Models and Migrations so I need to stay focus so I can collect interesting words, verbs and sentences that related to SQL, Models and Migrations without failing or mentally breaking down.

association table -> passengers
one to many relations
many to many relations

SQL Injections
Bypass the password

Race conditions
Parrel threads
conflicts
unexpected results
Lock on the database
transaction
database
release the lock

Django Models
Representing data
Airline
django-admin startproject airline
python manage.py startapp flights

create some models
python class
django is figure out
create that table
manupulating that table
selecting, inserting, deleting
models.py
every model is python class
class Flight (models.Model)
models.CharField
models.CharField
models.IntegerField
Two steps process
migrations - the instructions about how to manipulate (Create, Insert, Select, Update and Delete) the data base.
migrate - take those instructions and actually apply them to database.
manage.py script
we create a migration inside 001_intial.py and inside that migration we create a model called Flight

How can I begin to manipulate this database?
I could use direct SQL commands by opening up the db.sqlite3 file and running SQL commands.
Django provides Abstraction layer
Django shell I can run python commands
write python commands that can executed on this web application

shell
from flights.models import Flight

Inserting
f = Flight (origin="New York", destination="Paris", duration=415)
f.save()

Querying
Flight.object.all()
# -> <QuerySet [<Flight: Flight Object (1)>]
double underscore str function.
# -><QuerySet [<Flight 1: New York to London>]
flight = flights.first()
flight
# -> <Flight: 1: New York to London>

Access properties
flight.id
flight.origin
flight destination

flight.delete()

This is not the model I want,
another table for Airport
relationship with Airport and Flights

origin = models.ForeignKey(Airport)
Foreign key that represent another table
additional arguments
This along would be enough
origin = models.ForeignKey (Airport, on_delete=models.CASCADE)
What should happen if I delete something?
Delete JFK from my ariport and what should happen to the flight?
because that flight is refering that Airport
So the CASCADE means if I every delete an ariport in airport table now the corrosponding flights also going to delete in the flights table.
There are other constatins also got like models.PROTECT that don't even given me to delete an ariport if that got a flight.

origin = models.ForeignKey (Airport, on_delete=models.CASCADE, related_name="departures")
accessing a relationship in reverse order
I can get the flight.orign and get the Airport
If I got a Airpot how can I get the flights that moving from ?

How to I get all the flights that have the origin?
django automatically set up the relationship so I can ask JFK.departures and got all the fligths departuring from JFK airports. 

JFK departures? The flights that got origin JFK. Take those flights and set up a related name called "departures" such that I can get the flights that departing from JFK.
JFK Arrivals? The flights that got destination JFK.  Take those flights and set up a related name called "arriavas" such that I can get the flights that arriving to the JFK.

I made the changes in my python code and hasn't made any changes in my database so to make that change again that is a two step process.

lhr.arrivals.all()
# -> <QuerySet [<Flight: 1: New York (JFK) to London (LHR)>]>

Now we can begin to design a web application.



   























