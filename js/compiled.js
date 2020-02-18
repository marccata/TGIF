//**************************************************************** INITIAL AND COMMON ACTIONS FOR ALL SITE ****************************************************************

// KNOW THE HTML PAGE NAME
var path = window.location.pathname;
var page = path.split("/").pop();

// CHANGE DATA ROOT DEPENDING OF THE HTML PAGE THE CALL IS COMING FROM
if (page == "senate.html" || page == "senate-attendance.html" || page == "senate-loyalty.html") {url = "https://api.propublica.org/congress/v1/113/senate/members.json"; var pageType = 'senate';};
if (page == "house.html" || page == "house-attendance.html" || page == "house-loyalty.html") {url = "https://api.propublica.org/congress/v1/113/house/members.json"; var pageType = 'house';};
if (page == "index.html") {var pageType = 'home';};

// COMMON OBJECTS FOR ALL PAGES EXCEPT HOME
if (pageType !== 'home') {
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
}

// IF MEMBERS EXISTS ON LOCALSTORAGE && CALL DOESN'T COME FROM HOME PAGE TAKE THEM , OTHERWISE MAKE FETCH
if (pageType == 'senate' && localStorage.getItem('senateLocal') && pageType !== 'home') {
    var membersLocal = localStorage.getItem('senateLocal');
    var members = JSON.parse(membersLocal);
    init();
} else if (pageType == 'house' && localStorage.getItem('houseLocal') && pageType !== 'home') {
    var membersLocal = localStorage.getItem('houseLocal');
    var members = JSON.parse(membersLocal);
    init();
// IF CALL DOESN'T COME FROM HOME PAGE (AND DATA DOESN'T EXIST IN LOCAL), FETCH DATA
} else if (pageType !== 'home') {
    // GET DATA AND SET THE MEMEBERS ARRAY
    var members;
    fetch(url, {
        method: "GET",
        headers: {
        "X-API-Key": "ZRqqZyse9eb9miTFvaBJFfBegzzOTxz3OpxknxxO"
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        const newData = data.results[0].members; // TODO WHY CAN'T I DIRECTLY SET MEMBERS INSTEAD OF GOING BY NEWDATA?
        members = newData;
        init();
        if (pageType == 'senate') {localStorage.setItem("senateLocal", JSON.stringify(members));};
        if (pageType == 'house') {localStorage.setItem("houseLocal", JSON.stringify(members));};
    }).catch(function(){
        console.log('Error on loading data source');
    });
//ELSE (WE GET ONLY HERE IF WE ARE IN HOME PAGE) LOAD HOME PAGE ACTIONS
} else {
    openCloseBtn();
}

// FUNCTION OF FUNCTIONS DEPENDING ON HTML PAGE
function init(){
    // SENATE & HOUSE ACTIONS
    if (page == "senate.html" || page == "house.html") {
        readFilters();
        print(members);
        knowStates(members);
        document.getElementById('table-loader').classList.add("d-none-imp");
    }
    // ATTENDANCE ACTIONS
    if (page == "senate-attendance.html" || page == "house-attendance.html") {
        attendance();
        attendanceTable();
        hideLoaders();
        sortArrayMostEngaged();
        sortArrayLeastEngaged();
    }
    // LOYALTY ACTIONS
    if (page == "senate-loyalty.html" || page == "house-loyalty.html") {
        attendance();
        attendanceTable();
        hideLoaders();
        sortArrayMostEngagedLoy();
        sortArrayLeastEngagedLoy();
    }
};

// COMMON ACTIONS FOR ALL PAGES
getTopBtn();

//**************************************************************** HOME PAGE ****************************************************************

// CHANGE READ MORE BUTTON INNER TEXT ON CLICK
function openCloseBtn() {
    var textButton = document.getElementById('readMoreBtn');
    document.getElementById('readMoreBtn').addEventListener("click", action);
    function action() {
        if (textButton.innerHTML == 'Read Less') {
            textButton.innerHTML = 'Read More';
        } else {
            console.log('this works');
            textButton.innerHTML = 'Read Less';
        }
    }
};


//**************************************************************** SENATE & HOUSE PAGES ****************************************************************

// FUNCTION TO PRINT TABLE IN HTML
function print(members) {
    var tbody = document.getElementById('tbody-data');
    tbody.innerHTML = '';
    for (i = 0; i < members.length; i++) {    
        var createTr = document.createElement("tr");
        var nameTd = document.createElement("td");
        var partyTd = document.createElement("td");
        var stateTd = document.createElement("td");
        var senirityTd = document.createElement("td");
        var votesWithPartyTd = document.createElement("td");
        var senatorFullName = members[i].first_name + ' ' + members[i].last_name;
        // IF SENATOR HAS MIDDLE NAME, ADD IT
        if (members[i].middle_name) {senatorFullName = members[i].first_name + ' ' + members[i].middle_name + ' ' + members[i].last_name;};
        nameTd.innerHTML = ("<a target='_blank' href=" + members[i].url + ">" + senatorFullName + linkArrow + "</a>");
        partyTd.innerHTML = members[i].party;
        stateTd.innerHTML = members[i].state;
        senirityTd.innerHTML = members[i].seniority;
        votesWithPartyTd.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(nameTd, partyTd, stateTd, senirityTd, votesWithPartyTd);
        tbody.appendChild(createTr);
    };
};

// EVENT LISTENERS OF THE CHECKBOXES
function readFilters() {
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
        document.getElementById('tbody-data').innerHTML = '<div style="height:30px"></div><tr><td class="empty-table" colspan="5" id="empty-table">No results for this filter</td></tr>';
    }    
};

// FUNCTION TO KNOW HOW MANY STATES THERE ARE IN US (BASED ON MEMBERS EXISTANCE)
function knowStates(members) {
    let printStates = [];
    // SEND ALL THE STATES IN THE ARRAY IF THEY ARE NOT REPEATED
    for (let i = 0; i < members.length; i++) {
        if (!printStates.includes(members[i].state)) { 
            printStates.push(members[i].state); 
        }
    };
    // ORDER STATES SO THEY PRINT IN ALPHABETICAL ORDER
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
    if (membersData.votePctIndependents == 0) {independentTd2.innerHTML = "-----";} // IF THERE ARE NO INDEPENDENTS PRINT '---' IN THE TABLE, '0%' IS NOT RIGHT
    else {independentTd2.innerHTML = membersData['votePctIndependents'] + "%";} 
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
        createTd1.innerHTML = ("<a target='_blank' href=" + members[i].url + ">" + senatorFullName + linkArrow + "</a>");
        createTd2.innerHTML = members[i].missed_votes;
        createTd3.innerHTML = members[i].missed_votes_pct + '%';
        createTr.append(createTd1, createTd2, createTd3);
        document.getElementById(id).appendChild(createTr);
    }
};

// FUNCTION TO HIDE LOADERS FROM THE TABLES - SHARED FOR ATTENDANCE AND LOYALTY PGS
function hideLoaders(){
    document.getElementById('table-loader-1').classList.add("d-none-imp");
    document.getElementById('table-loader-2').classList.add("d-none-imp");
    document.getElementById('table-loader-3').classList.add("d-none-imp");
    // THIS MAKES VISIBLE THE FIRST TABLE, OTHERWISE THE THREE TITLES THAT ALREADY APPEAR IN THE HTML ARE SEEN WHILE LOADERS ARE ON
    document.getElementById('senateAttendanceData').classList.add("show-table");
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
        createTd1.innerHTML = ("<a target='_blank' href=" + members[i].url + ">" + senatorFullName + linkArrow + "</a>");
        var votesWithParty = members[i].total_votes * members[i].votes_with_party_pct / 100;
        createTd2.innerHTML = Math.round(votesWithParty);
        createTd3.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(createTd1, createTd2, createTd3);
        document.getElementById(id).appendChild(createTr);
    }
};

//**************************************************************** BACK TO TOP BUTTON ****************************************************************

//Get the button:
function getTopBtn() {
mybutton = document.getElementById("myBtn");
window.onscroll = function() {scrollFunction()};
}

// When the user scrolls down 20px from the top of the document, show the button
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.visibility = "visible";
        mybutton.style.opacity = "1";
    } else {
        mybutton.style.visibility = "hidden";
        mybutton.style.opacity = "0";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}