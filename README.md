# sport-cordova-android

Project Name: A Sport Themed app built with the Cordova Framework

This link shared via my Google drive can be used to download the .apk file to install the App on an Android device
https://drive.google.com/file/d/0Bw36yrDbMn40UzVWQk5Dd3dsU28/view?usp=sharing


I built a Sport Themed app to display a game schedule and scores from games played.

About Interface
This app is a Single Page App. There are two screens in the app. One shows the timetable (schedule) of all the games from the data. The second shows all the scores for the teams, ranked by the number of games won.
The app has a launcher icon, a splashscreen graphic, icons and text on the navigation tabs, and an icon for each team.
The nav menu has  two tabs - timetable and scores.  I use the iconic icon set for the icons on the nav buttons.

About functionality
When the app launches, it fetches the data from the server via AJAX and save it to localStorage. The next time I launch the app, it checks to see if the data is in localStorage and if the data is there then do NOT load new data.
The app has a refresh button. If the user taps the refresh button then the data in localStorage will be replaced. 
I sort the data by dates to display the timetable of games. 
I also calculate the number of wins, losses, and ties and then sort the data by that information to display the scores.
