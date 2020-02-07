// SENATE JS
const members = data.results[0].members;

// FUNCTION TO CREATE TABLE IN HTML
function print(members) {
    document.getElementById('senate-data').innerHTML = '';
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
        document.getElementById('senate-data').appendChild(createTr);
    };
};
print(members);

// EVENT LISTENERS OF THE CHECKBOXES
document.getElementById('checkRepublicans').addEventListener("click", filter);
document.getElementById('checkDemocrats').addEventListener("click", filter);
document.getElementById('checkIndependents').addEventListener("click", filter);

// FILTER FUNCTION
function filter() {
    var filteredMembers = [];
    for (i = 0; i < members.length; i++) {    
        if (document.getElementById('checkRepublicans').checked && members[i].party == "R") {
            filteredMembers.push(members[i]);
        } 
        if (document.getElementById('checkDemocrats').checked && members[i].party == "D") {
            filteredMembers.push(members[i]);
        }
        if (document.getElementById('checkIndependents').checked && members[i].party == "I") {
            filteredMembers.push(members[i]);
        } 
    };  
    print(filteredMembers);
};

// FUNCTION TO KNOW HOW MANY STATES THERE ARE IN US
var statesList = [];
function knowStates() {
    let div = [];
    for (b = 0; b < members.length; b++) {
        statesList.push(members[b].state); 
    };
    // FORMULA FROM STARTER JS EXERCICES
    for (let i = 0; i < statesList.length; i++) {
        for (let j = i+1; j < statesList.length; j++) {  //
            if (statesList[j] === statesList[i] && !div.includes(members[i].state)) { 
                div.push(statesList[i]); 
            }
        }
    };
    console.log(div);
};
knowStates();

// SEND EACH STATE INTO AN <OPTION> IN HTML
function statesDropdown() {
    for (i = 0; i < statesList.length; i++) {
        var createOption = document.createElement("OPTION");
        createOption.innerHTML = statesList[i];
        document.getElementById('stateDropdown').appendChild(createOption);
    };
}
statesDropdown();