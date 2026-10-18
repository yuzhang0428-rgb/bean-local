# Bean Local

This app allows the user to view and manipulate a list of coffee beans.

Each coffee record contains a bean name and a community rating from 1 to 5.

The user can search, sort, add, update and delete coffee records.

The application also displays current Melbourne weather information using the Open-Meteo API and displays community coffee ratings using Chart.js.

Coffee data is stored in a text file so that changes can remain after the page is refreshed.


# BeanList - Class

The BeanList class stores and manages the coffee records used in the Coffee Finder.

## Attributes

beanList - an array of coffee bean objects

rootId - the ID of the HTML element where the coffee list is displayed


## Methods

beanRow - generates one row of the coffee list

genBeanList - generates and displays all rows in the coffee list

genBeanSearchList - generates and displays coffee records from a filtered search result

removeElements - removes the generated coffee rows from the display

getRow - returns a single coffee record using its array index

refresh - refreshes the displayed coffee list

add - adds a new coffee record to the list

update - updates an existing coffee record in the list

delete - deletes a coffee record from the list

sortA2Z - sorts the coffee list by bean name from A to Z and refreshes the display

sortZ2A - sorts the coffee list by bean name from Z to A and refreshes the display

search - searches the coffee list using a partial, case-insensitive bean name and displays the matching results


# App.js

This file contains the implementation of the Bean Local Coffee Finder.

It creates the BeanList object and contains the event listeners used for the Coffee Finder user interface.

It controls the Search, Sort A-Z, Sort Z-A, Add, Update and Delete functions.

The file also contains validation for coffee bean names and community ratings.

The coffee bean name must contain at least two valid characters.

The community rating must be a whole number between 1 and 5.

The file also contains JavaScript that creates and controls parts of the user interface, including CRUD form tabs, status messages and the current year in the footer.


## Coffee Data

loadCoffeeData - loads coffee records from the server into the BeanList

saveCoffeeData - sends the current BeanList data to the server so that changes can be saved to the coffee text file

Coffee records added, updated or deleted by the user are saved so that the changes remain after the page is refreshed.


## Open-Meteo API

loadMelbourneWeather - retrieves current Melbourne weather information from the Open-Meteo API

The current temperature and apparent temperature are displayed on the Coffee Finder page.

The application also displays a simple coffee recommendation based on the current temperature.


## Chart.js

updateRatingChart - creates or refreshes the Community Coffee Ratings chart

Chart.js is used to display the current coffee names and their community ratings in a bar chart.

The chart is updated when the coffee data changes.


# Config.js

This file stores common configuration values used by the application.

It contains the Open-Meteo API URL, Melbourne location settings and local API endpoints.

No passwords or secret API keys are stored in this client-side configuration file.


# Contact.js

This file controls the Contact page functionality.

It validates the user's input before feedback is submitted.

Valid feedback data is sent to the Node.js server and stored in the feedback text file.

The application displays validation, success and error messages to the user.


# Site.js

This file contains shared JavaScript functionality used across the Bean Local website.


# Server.js

This file contains the Node.js server used by the Bean Local application.

The server serves the website files and handles the local API endpoints.

It reads coffee data from data/coffees.txt using fs.readFile().

It writes updated coffee data to data/coffees.txt using fs.writeFile().

This allows Add, Update and Delete changes made in the Coffee Finder to remain after the page is refreshed.

The server also processes Contact form feedback and stores valid feedback data in data/feedback.txt.


# Data Files

## coffees.txt

Stores the coffee records used by the Coffee Finder.

The file is read when the Coffee Finder loads and updated after coffee records are added, updated or deleted.


## feedback.txt

Stores valid feedback submitted through the Contact form.

## Testing

The Coffee Finder supports search, sorting, adding,
updating and deleting coffee records.

Coffee data is stored in coffees.txt and remains
available after the page is refreshed.