# Personalized-recipe-recommendation-System

In our hectic daily lives, we frequently forget to buy groceries. It is not uncommon for us to
decide to make a recipe only to discover that we lack all of the necessary ingredients, forcing us
to either abandon the plan or pay a higher price for the ingredients. To tackle this issue in
general, we present a website that analyzes users' weekly meal plan and assists him in following
it in a most efficient way.

Aim: To create a web application for maintaining and analyzing a user's weekly meal schedule,
as well as assisting him with it by suggesting the recipe, listing the ingredients needed, and
providing their current prices, as well as interactively assisting him in preparing the dish by
reading out the recipe to him.

# Background

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

# Application Architecture

![image](https://user-images.githubusercontent.com/85038944/126919028-ab7d4e5a-af02-4a5d-9570-c05c4c76d478.png)

