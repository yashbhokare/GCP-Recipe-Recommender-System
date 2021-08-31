# GCP-Recipe-Recommender-System
Hunger hurts: Food Recommendation System

Introduction

In our hectic daily lives, we frequently forget to buy groceries. It is not uncommon for us to decide to make a recipe only to discover that we lack all of the necessary ingredients, forcing us to either abandon the plan or pay a higher price for the ingredients. To tackle this issue in general, we present a website that analyzes users' weekly meal plan and assists him in following it in a most efficient way.

Aim: To create a web application for maintaining and analyzing a user's weekly meal schedule, as well as assisting him with it by suggesting the recipe, listing the ingredients needed, and providing their current prices, as well as interactively assisting him in preparing the dish by reading out the recipe to him.

Background

We all have a foodie inside us, and with this nature comes cravings for various dishes. But, due
to our hectic daily schedules, whenever we decide to cook a meal, we find ourselves in a
situation where we lack all of the ingredients needed to prepare the dish, and we end up
canceling the plan. But what if we had a website that would take our weekly schedule and
suggest a recipe with a list of all the ingredients needed? This would relieve us of a lot of work
and allow us to enjoy our favorite dishes.

We have developed a website that allows users to maintain a weekly meal schedule, and the
website will check available recipes for preparing the dish and will list down the necessary
ingredients. It will then fetch the prices of the items on the list across a shopping site and
display them so that the users can add them to the cart.

We are further using a LDA model that will make recipe recommendations based on the user's
preferences. We intend to analyze different recipes' datasets based on various parameters such
as the type of ingredients, the number of steps in the recipe, the number of ingredients, user
reviews and ratings, and provide personalized recommendations. We are doing topic modelling
to provide personalized recommendations.

To make it more interactive, we added a feature in which we developed a personal assistant bot
that would interact with users in real-time and read out the recipes to them. This would assist
the user to follow any recipe, without the need of him actually reading it.

Current Solutions:

Food.com is a pre-existing food-recommendation service. It organizes recipes into categories
such as popular, breakfast & brunch, and so on. Such pre-existing food/recipe recommender
systems, meanwhile, make suggestions based on the tastes of consumers as well as their dietary
requirements. They do not, however, offer a weekly meal plan based on the user's food
preferences. Further, they do not provide the current price of each ingredient.


Major Components:

1. Front-end App

On the front-end we use an angular app to build the functionality. The design is
inspired from food.com. The journey is divided into 4 steps:

Step 1:
User logs into the application through a Login Page that consists of username and
password. It then redirects the user to the portal. For the first time user, he needs to
enter his details on the User Registration page which consists of a questionnaire
related to preferences on food items. After registration, the user is directed to the
portal.

Step 2:
On the home page we list down a bunch of recipes for users to select from or search
it from the search tab. The user chooses a dish that he wants to eat and adds it to the
calendar to schedule his weekly meal plan. We used Google Calendar to sync the
user's schedule to his Google account, and we also provided an in-app calendar for
viewing the plan.

Step 3:
In the following step, we list the recipe of the dish selected by the user and display its
content, such as the dish description, recipe, and the ingredients needed. The user
can then choose the ingredients he needs and check their current prices on a
shopping portal.

Step 4:
When the user decides to make the dish, we provide a personal assistant who will
interact with him in real time and read out the recipe to him. Voice commands are
used by the personal assistant to interact with the user.

2. Back-end App

NodeJS is used to create the back-end app. It is hosted on a separate Google App
Engine instance. The goal is to make the application components loosely coupled. This
ensures individual scalability.

In this following major components are hosted:

1. Personal Assistant: This component provides a way to interact with the user on a
real time basis. It is developed using Google cloud’s Dialogflow and google’s
speech to text and text to speech API.

When a user needs to make a dish, he uses voice commands to interact with the
personal assistant. This allows for a more interactive interaction with the users.
In the Dialog Flow, we used training phrases such as next step, go to next step,
previous step, and proceed, which the user uses as voice commands to interact
with the bot. When the user says next or uses any other phrase, it is converted
from speech to text using google API and then the next step is fetched from the
database by the node server. This is then converted into speech and delivered to
the user via the Google API. As a result, the user does not have to read the recipe
himself; instead, the bot does so for him. The mp3 files generated during
text-to-speech conversion or when the user uses voice commands are saved in
the cloud storage.

2. Recommendation : It provides personal recommendation to the user. It interacts
with the ML models and the Google SQL database.

3. Login and Registration System: It takes personal information including from the
user and stores it in the database. It allows the user to log into the application by
entering username and password.

ML model and Web Scraper

ML model:

We begin by assuming that users prefer recipes that are close to recipes they have
previously enjoyed. To put it another way, if a consumer enjoys chocolate cake, it's a
safe bet that he or she would enjoy chocolate tart as well (consider them similar).
We use LDA to extract features from recipe ingredients: each recipe is transformed
into a matrix represented by a bag of words model, and then the LDA model
processes and generates a linear combination of possible words that contribute to the
topic. The recommendation model calculates the "similarity" or distance between the
recipes in the database and then "remembers" it (memory).
We use this similarity between the recipes to give personalized recommendations
based on the topics that emerge. We are using a database from Kaggle to perform the
analysis.
We examine the dataset's recipe data and try to uncover popular topics among the
recipe data. Topic modeling assists us in identifying hidden topic blocks in data. The
user will select his meal plan for a week. We based on which food dishes the user
adds to his meal plan, recommend him the similar recipes falling under the similar
topics.

Web Scraper:

We are using web scraping for fetching the current prices of the items from amazon
website. It fetches recipe details from Google Sheets and web scaps the current price
of the items from a shopping portal. It then provides the user the best price of the
ingredients. This is added to the user’s cart and the total price of the food item is
displayed. Google Sheets API was used to collect ingredients details of the recipe.
Libraries like BeautifulSoup and Requests were used to scrap the shopping portals.
The price and product name was then returned to the user into the google sheets
which was updated into the web portal.

Database


We are using Google Cloud MYSQL 8.0 as the database in this application. It stores the
user's personal details including username and password and food preferences.
This database is further used to store the list of dishes and their recipes, with the
other information like, list of ingredients, number of ingredients, number of steps and
the description of the dish. This is the dataset on which the ML model is being
trained.


External APIs


Google Calendar API is used to add the users meal plan to his google account. Google
text to speech and Google speech to text API are used to provide a personalized bot
and it interacts with the user using voice commands. Google Sheet API is used for
fetching and storing ingredients information which is used in web scraping the price
details from Amazon.

Cloud Services used:

1. Google App Engine

GAE is used to separate the deployment of front-end and back-end applications. The
front-end app engine sends HTTP requests to the back-end application, which is
hosted on a different GAE. Our ML model and web scraper are deployed on another
GAE.

2. Google Cloud SQL
The application's MYSQL database is hosted by Google Cloud SQL. For data querying,
the GAE hosting the back-end and the ML model plus the websraper communicates
with Cloud SQL instance.

3. Google Cloud Storage

Front-end applications' static data/files are stored in the cloud. It is also used to store
app-related files for the application that is deployed in the back-end. The speech mp3
files are also stored in cloud storage.

4. Google Dialoflow

The Chatbot developed for providing personal assistance to the user uses Google
Dialogflow, which is a natural language processing (NLP) platform used to build
conversational applications.

Role of Google App Engine:

The front end angular app, back-end node app and the ML model plus the web scraper
are hosted on different GAE instances. We hosted them on different instances to have a
decoupling between the application components. The reasons behind using google app
engine for hosting application are:

1. Deploying applications is very easy, since no deployment configuration is
required as it is a PaaS offering. We just need to specify the runtime to be used.
2. It has many built-in APIs which helps to build robust applications.
3. Highly scalable and autoscaling is managed internally by GAE
4. Systematic application error logging mechanism.
5. Pay as per usage: you have to pay as per the usage of resources as the
application grows.

Autoscaling

Autoscaling refers to an application's ability to scale in/out automatically based on the
application load in order to satisfy all requests in a seamless manner.
The definition of load varies depending on the application. In the context of this
application, load can be specified as the number of requests the website is receiving at
any given time. In addition, the time it takes to satisfy each request can vary depending
on the user input. As a result, the essence of the input parameters may be used to
determine if a request is lightweight or strong.

Using the above two parameters, GAE manages to scale out/in the resources to meet
the new requirements based on the current load whenever the load on the website
increases/decreases. GAE includes this type of auto scaling by default. As a result, the
application developer is relieved of the responsibility of implementing autoscaling for
GAE-deployed applications. One of the most compelling reasons to choose GAE is
because of this.

How does the application solve the problem? How is it different from others?

Our solution provides a weekly meal schedule based on the user's food preferences. It
provides a personalized recommendation system to the user. It checks the ingredients
required for preparing the dish and fetches the prices of the items on the list across a
shopping site. It displays them to the users and adds them to the shopping cart. Further,
the application has a personalised bot which reads out the recipe to the user and assists
them in cooking.
