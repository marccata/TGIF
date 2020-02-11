// GET DATA AND CALL PAGE FUNCTIONS AFTER DATA IS LOADED
    // KNOW THE HTML PAGE NAME
    var path = window.location.pathname;
    var page = path.split("/").pop();
    // CHANGE DATA ROOT DEPENDING OF THE HTML PAGE THE CALL IS COMING FROM
    if (page == "senate.html") {url = "https://api.propublica.org/congress/v1/113/senate/members.json";};
    if (page == "house.html") {url = "https://api.propublica.org/congress/v1/113/house/members.json";};
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
        print(members);
        knowStates(members);
    });



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
        createTd1.innerHTML = senatorFullName.link(members[i].url);
        createTd2.innerHTML = members[i].party;
        createTd3.innerHTML = members[i].state;
        createTd4.innerHTML = members[i].seniority;
        createTd5.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(createTd1, createTd2, createTd3, createTd4, createTd5);
        tbody.appendChild(createTr);
    };
};


// EVENT LISTENERS OF THE CHECKBOXES
document.getElementById('checkRepublicans').addEventListener("click", filter);
document.getElementById('checkDemocrats').addEventListener("click", filter);
document.getElementById('checkIndependents').addEventListener("click", filter);
document.getElementById('stateDropdown').addEventListener("change", filter);


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
    var statesList = [];
    let div = [];
    for (b = 0; b < members.length; b++) {
        statesList.push(members[b].state); 
    };
    // PUT THE REPEATED STATES IN THE DIV/TRASH ARRAY
    for (let i = 0; i < statesList.length; i++) {
        for (let j = i+1; j < statesList.length; j++) {  //
            if (statesList[j] === statesList[i] && !div.includes(members[i].state)) { 
                div.push(statesList[i]); 
            }
        }
    };
    // SEND EACH STATE INTO AN <OPTION> IN HTML TO CREATE DROPDOWN
    for (i = 0; i < statesList.length; i++) {
        var createOption = document.createElement("OPTION");
        createOption.innerHTML = statesList[i];
        document.getElementById('stateDropdown').appendChild(createOption);
    };
};