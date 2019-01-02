Using Puppeteer, this code will automatically 
-log into duolingo (currently using google login)
-navigate to the Words page
-scrape all the words with their translations, parts of speach, skill and strength
-it will then export the word info to a comma delimited file (csv)

To enter login information, create a text file called .env and place it in the root directory of the project with the following content:
USE_GOOGLE_AUTH=true
AUTH_USERNAME=[your username or email]
AUTH_PASSWORD=[your password]
