// GET DATA AND CALL PAGE FUNCTIONS AFTER DATA IS LOADED
// KNOW THE HTML PAGE NAME
var path = window.location.pathname;
var page = path.split("/").pop();

// CHANGE DATA ROOT DEPENDING OF THE HTML PAGE THE CALL IS COMING FROM
if (page == "senate.html" || page == "senate-attendance.html" || page == "senate-loyalty.html") {url = "https://api.propublica.org/congress/v1/113/senate/members.json";};
if (page == "house.html" || page == "house-attendance.html" || page == "house-loyalty.html") {url = "https://api.propublica.org/congress/v1/113/house/members.json";};
// GET DATA AND SET THE MEMEBERS ARRAY
var members = '';
fetch(url, {
    method: "GET",
    headers: {
    "X-API-Key": "ZRqqZyse9eb9miTFvaBJFfBegzzOTxz3OpxknxxO"
    }
}).then(res => {
    return res.json();
}).then(data => {
    const newData = data.results[0].members;
    members = newData;
    init();
}).catch(function(){
    console.log('Error on loading data source');
});

// FUNCTION OF FUNCTIONS DEPENDING ON HTML PAGE
function init(){
    // SENATE & HOUSE ACTIONS
    if (page == "senate.html" || page == "house.html") {
        print(members);
        knowStates(members);
        document.getElementById('table-loader').classList.add("d-none-imp");
    }
    // ATTENDANCE ACTIONS
    if (page == "senate-attendance.html" || page == "house-attendance.html") {
        attendance();
        attendanceTable();
        document.getElementById('table-loader-1').classList.add("d-none-imp");
        document.getElementById('table-loader-2').classList.add("d-none-imp");
        document.getElementById('table-loader-3').classList.add("d-none-imp");
        document.getElementById('senateAttendanceData').classList.add("show-table");
        sortArrayMostEngaged();
        sortArrayLeastEngaged();
    }
    // LOYALTY ACTIONS
    if (page == "senate-loyalty.html" || page == "house-loyalty.html") {
        attendance();
        attendanceTable();
        document.getElementById('table-loader-1').classList.add("d-none-imp");
        document.getElementById('table-loader-2').classList.add("d-none-imp");
        document.getElementById('table-loader-3').classList.add("d-none-imp");
        document.getElementById('senateAttendanceData').classList.add("show-table");
        sortArrayMostEngagedLoy();
        sortArrayLeastEngagedLoy();
    }
};

// GENERAL OBJECTS
var membersData = {
    numberDemocrats: 0,
    numberRepublicans: 0,
    numberIndependents: 0,
    votePctDemocrats: 0,
    votePctRepublicans: 0,
    votePctIndependents: 0,
    totalMembers: 0,
    totalVotesPct: 0,
};
var linkArrow =  '  <i class="lni-arrow-top-right"></i>';

//**************************************************************** SENATE & HOUSE PAGES ****************************************************************

// FUNCTION TO PRINT TABLE IN HTML
function print(members) {
    var tbody = document.getElementById('tbody-data');
    tbody.innerHTML = '';
    for (i = 0; i < members.length; i++) {    
        var createTr = document.createElement("tr");
        var createTd1 = document.createElement("td");
        var createTd2 = document.createElement("td");
        var createTd3 = document.createElement("td");
        var createTd4 = document.createElement("td");
        var createTd5 = document.createElement("td");
        var senatorFullName = members[i].first_name + ' ' + members[i].last_name;
        if (members[i].middle_name) {senatorFullName = members[i].first_name + ' ' + members[i].middle_name + ' ' + members[i].last_name;};
        createTd1.innerHTML = (senatorFullName + linkArrow).link(members[i].url);
        createTd2.innerHTML = members[i].party;
        createTd3.innerHTML = members[i].state;
        createTd4.innerHTML = members[i].seniority;
        createTd5.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(createTd1, createTd2, createTd3, createTd4, createTd5);
        tbody.appendChild(createTr);
    };
};

// EVENT LISTENERS OF THE CHECKBOXES
if (page == "senate.html" || page == "house.html") {
    document.getElementById('checkRepublicans').addEventListener("click", filter);
    document.getElementById('checkDemocrats').addEventListener("click", filter);
    document.getElementById('checkIndependents').addEventListener("click", filter);
    document.getElementById('stateDropdown').addEventListener("change", filter);
}

// FILTER FUNCTION
function filter() {
    // KNOW INDEX FILTER OF STATE DROPDOWN
    var dropdown = document.getElementById("stateDropdown");
    var index = dropdown.selectedIndex;
    // NOW FILTER MEMBERS BY STATE AND PUSH INTO NEW ARRAY
    var stateMembers = [];
    for (j = 0; j < members.length; j++) {
        // IF STATE DROPDOWN IS SET AT ALL STATES (INDEX 0)
        if (dropdown.selectedIndex == 0) {
            stateMembers = Array.from(members);
            break;
        }
        if (dropdown[index].innerHTML == members[j].state) {
            stateMembers.push(members[j]);
        }        
    }; 
    // IN CASE THAT THE THREE CHECKBOXES ARE OFF, SHOW ALL THE TABLE MEMBERS
    checkRepublicans = document.getElementById('checkRepublicans');
    checkDemocrats = document.getElementById('checkDemocrats');
    checkIndependents = document.getElementById('checkIndependents');
    var filteredMembers = [];

    for (i = 0; i < stateMembers.length; i++) {
        if (checkRepublicans.checked && stateMembers[i].party == "R") {
            filteredMembers.push(stateMembers[i]);
        } 
        if (checkDemocrats.checked && stateMembers[i].party == "D") {
            filteredMembers.push(stateMembers[i]);
        }
        if (checkIndependents.checked && stateMembers[i].party == "I") {
            filteredMembers.push(stateMembers[i]);
        } 
        // IF THE THREE CHECKBOXES ARE UNCHECKEC, SHOW ALL MEMBERS
        if (!checkRepublicans.checked && !checkDemocrats.checked && !checkIndependents.checked) {
            filteredMembers.push(stateMembers[i]);
        }
    }
    // IF WE HAVE RESULTS PRINT RESULTS IN A TABLE
    if (filteredMembers !== 0) {
        print(filteredMembers);
    }
    // IF WE DON'T HAVE RESULTS SHOW EMPTY MESSAGE
    if (filteredMembers == 0) {
        document.getElementById('tbody-data').innerHTML = 'Your filters do not have a match';
    }    
};

// FUNCTION TO KNOW HOW MANY STATES THERE ARE IN US (BASED ON MEMBERS EXISTANCE)
function knowStates(members) {
    // PUT ALL THE STATES IN THE ARRAY
    var allStates = [];
    let printStates = [];
    for (b = 0; b < members.length; b++) {
        allStates.push(members[b].state); 
    };
    // PUT THE REPEATED STATES IN THE DIV/printStates ARRAY
    for (let i = 0; i < allStates.length; i++) {
        for (let j = i+1; j < allStates.length; j++) {
            if (allStates[j] === allStates[i] && !printStates.includes(allStates[i])) { 
                printStates.push(allStates[i]); 
            } else if (!printStates.includes(allStates[i])) {
                printStates.push(allStates[i]); 
            }
        }
    };
    printStates.sort();
    // SEND EACH STATE INTO AN <OPTION> IN HTML TO CREATE DROPDOWN
    for (i = 0; i < printStates.length; i++) {
        var createOption = document.createElement("OPTION");
        createOption.innerHTML = printStates[i];
        document.getElementById('stateDropdown').appendChild(createOption);
    };
};


//**************************************************************** ATTENDANCE PAGES ****************************************************************


//************** TOP TABLE **************

// Master function
function attendance() {
    // Scan all the members
    for (i = 0; i < members.length; i++) {    
        // Depending of party make one set of actions - each set includes meumbers count and vote percentage count        
        switch (members[i].party) {
        case "D":
            membersData.numberDemocrats++;
            membersData.votePctDemocrats = membersData.votePctDemocrats + members[i].votes_with_party_pct;
            break;
        case "R":
            membersData.numberRepublicans++;
            membersData.votePctRepublicans = membersData.votePctRepublicans + members[i].votes_with_party_pct;
            break;
        case "I":
            membersData.numberIndependents++;
            membersData.votePctIndependents = membersData.votePctIndependents + members[i].votes_with_party_pct;
            break;
        };
    };
    // divide vote percentage to have average
    membersData.votePctDemocrats /= membersData.numberDemocrats;
    membersData.votePctRepublicans /= membersData.numberRepublicans;
    if (membersData.votePctIndependents == 0) {membersData.votePctIndependents = 0;} 
    else {membersData.votePctIndependents /= membersData.numberIndependents;};
    // calculate total members
    membersData.totalMembers = membersData.numberDemocrats + membersData.numberIndependents + membersData.numberRepublicans;
    // calculate total votes percentage
    if (membersData.votePctIndependents == 0) {
        membersData.totalVotesPct = membersData.votePctRepublicans + membersData.votePctDemocrats;
        membersData.totalVotesPct /= 2;
    } else {
        membersData.totalVotesPct = membersData.votePctIndependents + membersData.votePctRepublicans + membersData.votePctDemocrats;
        membersData.totalVotesPct /= 3;
    };
    // limit numbers to two decimals
    membersData.votePctDemocrats = membersData.votePctDemocrats.toFixed(1);
    membersData.votePctRepublicans = membersData.votePctRepublicans.toFixed(1);
    membersData.votePctIndependents = membersData.votePctIndependents.toFixed(1);
    membersData.totalVotesPct = membersData.totalVotesPct.toFixed(1);
};

// Send data to first table
function attendanceTable() {
    // Send republicans
    var republicanTr = document.getElementById('attendanceTableRep');
    var republicanTd1 = document.createElement("td");
    republicanTd1.innerHTML = membersData['numberRepublicans'];
    var republicanTd2 = document.createElement("td");
    republicanTd2.innerHTML = membersData['votePctRepublicans'] + "%";
    republicanTr.append(republicanTd1, republicanTd2);
    // Send democrats
    var democratTr = document.getElementById('attendanceTableDem');
    var democratTd1 = document.createElement("td");
    democratTd1.innerHTML = membersData['numberDemocrats'];
    var democratTd2 = document.createElement("td");
    democratTd2.innerHTML = membersData['votePctDemocrats'] + "%";
    democratTr.append(democratTd1, democratTd2);
    // Send independent
    var independentTr = document.getElementById('attendanceTableInd');
    var independentTd1 = document.createElement("td");
    independentTd1.innerHTML = membersData['numberIndependents'];
    var independentTd2 = document.createElement("td");
    independentTd2.innerHTML = membersData['votePctIndependents'] + "%";
    independentTr.append(independentTd1, independentTd2);
    // Suma final
    var sumaTr = document.getElementById('attendanceTableSum');
    var sumaTd1 = document.createElement("td");
    sumaTd1.innerHTML = membersData['numberIndependents'] + membersData['numberRepublicans'] + membersData['numberDemocrats'];
    var sumaTd2 = document.createElement("td");
    sumaTd2.innerHTML = membersData.totalVotesPct + "%";
    sumaTr.append(sumaTd1, sumaTd2);
};

//************** MOST ENGAGED TABLE **************

function sortArrayMostEngaged() {
    // ARRAYS
    var membersMost = Array.from(members);
    var topMembers = [];
    // SORT ARRAY
    membersMost.sort(function(a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
    });
    // CREATE ARRAY WITH TOP 10% MEMBERS AND KEEP FINAL EQUAL MEMBERS
    for (i = 0; i < membersMost.length; i++) {
        if (i < membersMost.length * 0.1) {
            topMembers.push(membersMost[i]);
        } 
        else if (i >= membersMost.length * 0.1 && membersMost[i].missed_votes_pct == membersMost[i-1].missed_votes_pct) {
            topMembers.push(membersMost[i]);
        }
        else {
            break;
        }
    }
    //CALL PRINT FUNCTION
    createRow10Pct(topMembers, 'attendanceTableTop10');
};

//************** LEAST ENGAGED TABLE **************

// TO ORDER ARRAY FROM BIG TO SMALL
function sortArrayLeastEngaged() {
    // ARRAY BOTTOM 10% MEMBERS
    var membersLeast = Array.from(members);
    var bottomMembers = [];
    membersLeast.sort(function(a, b) {
        return b.missed_votes_pct - a.missed_votes_pct;
    });
    // CREATE ARRAY WITH BOTTOM 10% MEMBERS AND KEEP FINAL EQUAL MEMBERS
    for (i = 0; i < membersLeast.length; i++) {
        if (i < membersLeast.length * 0.1) {
            bottomMembers.push(membersLeast[i]);
        } 
        else if (i >= membersLeast.length * 0.1 && membersLeast[i].missed_votes_pct == membersLeast[i-1].missed_votes_pct) {
            bottomMembers.push(membersLeast[i]);
        }
        else {
            break;
        };
    };
    createRow10Pct(bottomMembers, 'attendanceTableLeast10');
}

//************** SHARED FORM TO PRINT MOST AND LEAST ENGAGED TABLES **************

// FORM TO CREATE TOP 10 TABLES
function createRow10Pct(members, id) {
    for (i = 0; i < members.length; i++) {
        var createTr = document.createElement("tr");
        var createTd1 = document.createElement("td");
        var createTd2 = document.createElement("td");
        var createTd3 = document.createElement("td");
        var senatorFullName = members[i].first_name + ' ' + members[i].last_name;
        if (members[i].middle_name) {senatorFullName = members[i].first_name + ' ' + members[i].middle_name + ' ' + members[i].last_name;};
        createTd1.innerHTML = (senatorFullName + linkArrow).link(members[i].url);
        createTd2.innerHTML = members[i].missed_votes;
        createTd3.innerHTML = members[i].missed_votes_pct + '%';
        createTr.append(createTd1, createTd2, createTd3);
        document.getElementById(id).appendChild(createTr);
    }
};

//**************************************************************** LOYALTY PAGES ****************************************************************

//************** TOP TABLE SAME AS IN ATTENDANCE **************

//*************** MOST ENGAGED TABLE **************

function sortArrayMostEngagedLoy() {
    // ARRAYS
    var membersMost = Array.from(members);
    var topMembers = [];
    // SORT ARRAY
    membersMost.sort(function(a, b) {
        return b.votes_with_party_pct - a.votes_with_party_pct;
    });
    // CREATE ARRAY WITH TOP 10% MEMBERS AND KEEP FINAL EQUAL MEMBERS
    for (i = 0; i < membersMost.length; i++) {
        if (i < membersMost.length * 0.1) {
            topMembers.push(membersMost[i]);
        } 
        else if (i >= membersMost.length * 0.1 && membersMost[i].votes_with_party_pct == membersMost[i-1].votes_with_party_pct) {
            topMembers.push(membersMost[i]);
        }
        else {
            break;
        }
    }
    //CALL PRINT FUNCTION
    createRow10PctLoy(topMembers, 'loyaltyTableTop10');
};

//************** LEAST ENGAGED TABLE **************

// TO ORDER ARRAY FROM BIG TO SMALL
function sortArrayLeastEngagedLoy() {
    // ARRAY BOTTOM 10% MEMBERS
    var membersLeast = Array.from(members);
    var bottomMembers = [];
    membersLeast.sort(function(a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    // CREATE ARRAY WITH BOTTOM 10% MEMBERS AND KEEP FINAL EQUAL MEMBERS
    for (i = 0; i < membersLeast.length; i++) {
        if (i < membersLeast.length * 0.1) {
            bottomMembers.push(membersLeast[i]);
        } 
        else if (i >= membersLeast.length * 0.1 && membersLeast[i].votes_with_party_pct == membersLeast[i-1].votes_with_party_pct) {
            bottomMembers.push(membersLeast[i]);
        }
        else {
            break;
        };
    };
    createRow10PctLoy(bottomMembers, 'loyaltyTableBottom10');
}

//************** SHARED FORM TO PRINT MOST AND LEAST ENGAGED TABLES **************

// FORM TO CREATE TOP 10 TABLES
function createRow10PctLoy(members, id) {
    for (i = 0; i < members.length; i++) {
        var createTr = document.createElement("tr");
        var createTd1 = document.createElement("td");
        var createTd2 = document.createElement("td");
        var createTd3 = document.createElement("td");
        var senatorFullName = members[i].first_name + ' ' + members[i].last_name;
        if (members[i].middle_name) {senatorFullName = members[i].first_name + ' ' + members[i].middle_name + ' ' + members[i].last_name;};
        createTd1.innerHTML = (senatorFullName + linkArrow).link(members[i].url);
        var votesWithParty = members[i].total_votes * members[i].votes_with_party_pct / 100;
        createTd2.innerHTML = Math.round(votesWithParty);
        createTd3.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(createTd1, createTd2, createTd3);
        document.getElementById(id).appendChild(createTr);
    }
};


//************** BACK TO TOP BUTTON **************

//Get the button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.visibility = "visible";
  } else {
    mybutton.style.visibility = "hidden";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}