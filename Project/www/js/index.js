"use strict"; //needed for the mobile browser
var data = {};
if (document.deviceready) {
    document.addEventListener("deviceready", onDeviceReady);
}
else {
    document.addEventListener("DOMContentLoaded", onDeviceReady);
}
let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links
//Main Initialization function
function onDeviceReady() {
    let localStorageExist = localStorage.getItem("timetableResults");
    if (!localStorageExist) {
        serverData.getJSON();
    }
    else {
        data = JSON.parse(localStorageExist);
        addProperties();
        //displayData();
    }
    pages = document.querySelectorAll('[data-role = "page"]');
    links = document.querySelectorAll('[data-role = "nav"] a');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    }
     let refrButton = document.getElementById("buttonRefresh");
    //    refrButton.addEventListener("click", onDeviceReady);
    refrButton.addEventListener("click", serverData.getJSON);
}

function navigate(ev) {
    ev.preventDefault();
    let link = ev.currentTarget;
    // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);
    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        }
        else {
            pages[i].classList.remove("active");
        }
    }
}
let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php"
    , httpRequest: "GET"
    , getJSON: function () {
        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();
        // Add a header(s)
        // key value pairs sent to the server
        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        // simply show them in the console
        //        console.dir("headers: " + headers.get("Content-Type"));
        //        console.dir("headers: " + headers.get("Accept"));
        // Now the best way to get this data all together is to use an options object:
        // Create an options object
        let options = {
            method: serverData.httpRequest
            , mode: "cors"
            , headers: headers
        };
        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        //        console.log(request);
        fetch(request).then(function (response) {
            //                console.log(response);
            return response.json();
        }).then(function (_data) {
            //                console.log(data); // now we have JS data, let's display it
            // Call a function that uses the data we recieved 
            localStorage.setItem("timetableResults", JSON.stringify(_data));
            data = _data;
            addProperties();
            //            console.log("Before sorting in previous funciton data.teams:");
            //            console.log(data.teams);
            
        }).catch(function (err) {
            alert("Error: " + err.message);
        });
    }
};

function addProperties() {
    data.teams.forEach(function (value) {
        value["numofWin"] = 0;
        value["numofLos"] = 0;
        value["numofTie"] = 0;
    });
    displayData();
}

function displayData() {
    //    localStorage.clear();
    //    console.log("the whole JS data:")
    //    console.log(data);
    //    localStorage.setItem("timetableResults", JSON.stringify(data));
    //get our stored contacts data and convert it back to 
    //for the chanllege part!
    //  var myScoreData = JSON.parse(localStorage.getItem("scores"));
    //    console.log("From LS: ");
    //    console.log(myScoreData);
    //  
    //    get our schedule unordered list
   
    let ul = document.querySelector(".timetable_list");
    ul.innerHTML = ""; //clear existing list items
    //create list items for each match in the schedule
    data.scores.forEach(function (value) {
        let li = document.createElement("li");
        //        li.className = "score"; //hint
        let h3 = document.createElement("h3");
        h3.textContent = value.date;
        let homeTeam = null;
        let awayTeam = null;
        //add our new schedule HTML to the unordered list
        ul.appendChild(li);
        ul.appendChild(h3);
        value.games.forEach(function (item) {
            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);
            let divOnePair = document.createElement("div");
            divOnePair.classList.add("onePair");
            // home team 
            let home = document.createElement("div");
            home.classList.add("homeTm");
            let imgHome = document.createElement("img");
            imgHome.src = getImgSrc(homeTeam);
            imgHome.classList.add("team-icon");
            let phome = document.createElement("p");
            phome.classList.add("pteam");
            phome.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
            home.appendChild(imgHome);
            home.appendChild(phome);
            // away team           
            let away = document.createElement("div");
            away.classList.add("awayTm");
            let imgAway = document.createElement("img");
            imgAway.src = getImgSrc(awayTeam);
            imgAway.classList.add("team-icon");
            let paway = document.createElement("p");
            paway.classList.add("pteam");
            paway.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";
            away.appendChild(imgAway);
            away.appendChild(paway);
            divOnePair.appendChild(home);
            divOnePair.appendChild(away);
            ul.appendChild(divOnePair);
            /*calculateNumOfWin  starts*/
            if (item.home_score > item.away_score) {
                calculateNumOfWin(data.teams, item.home);
                calculateNumOfLos(data.teams, item.away);
            }
            else if (item.home_score == item.away_score) {
                calculateNumOfTie(data.teams, item.home);
                calculateNumOfTie(data.teams, item.away);
            }
            else {
                calculateNumOfWin(data.teams, item.away);
                calculateNumOfLos(data.teams, item.home);
            }
            /*calculateNumOfWin ends*/
        });
    });
    data.teams = calcStanding();
}

function getImgSrc(teamName) {
    return "img/" + teamName + ".png";
}

function calculateNumOfWin(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            teams[i].numofWin += 1;
        }
    }
}

function calculateNumOfLos(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            teams[i].numofLos += 1;
        }
    }
}

function calculateNumOfTie(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            teams[i].numofTie += 1;
        }
    }
}

function calcStanding() {
    console.log(data.teams.length);
    //    console.log("data.scores:");
    //    console.log(data.scores);
    // sort by num of wins
    var tempTeams = [];
    tempTeams = data.teams.sort(function (a, b) {
        if (a.numofWin > b.numofWin) {
            return -1;
        }
        if (a.numofWin < b.numofWin) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
    console.log("After sorting data.teams:");
    console.log(tempTeams);
    let tbody = document.querySelector("#teamStandings tbody");
    tbody.innerHTML = "";
    /**
    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }
    **/
    for (let i = 0, numOfTm = tempTeams.length; i < numOfTm; i++) {
        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        
        
        
        
        let img = document.createElement("img");
            img.src = getImgSrc(tempTeams[i].name);
            img.classList.add("team-icon-standing");
        let p = document.createElement("p");
        p.classList.add("p-standing");
        p.innerHTML = tempTeams[i].name;
       
       
        tdn.appendChild(img);
        tdn.appendChild(p);


        
        
//        tdn.textContent = tempTeams[i].name;
        let tdw = document.createElement("td");
        tdw.textContent = tempTeams[i].numofWin;
        let tdl = document.createElement("td");
        tdl.textContent = tempTeams[i].numofLos;
        let tdt = document.createElement("td");
        tdt.textContent = tempTeams[i].numofTie;
        let tdp = document.createElement("td");
        tdp.textContent = tempTeams[i].numofWin * 2;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
    }
    return tempTeams;
}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}