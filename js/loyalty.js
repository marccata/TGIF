// GENERAL OBJECTS
const members = data.results[0].members;
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

// FUNCTION CALLS
attendance();
attendanceTable();
sortArrayMostEngaged();
sortArrayLeastEngaged();



//******************************************************* TOP TABLE *******************************************************

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



//******************************************************* MOST ENGAGED TABLE *******************************************************

function sortArrayMostEngaged() {
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
    createRow10Pct(topMembers, 'loyaltyTableTop10');
};




//******************************************************* LEAST ENGAGED TABLE *******************************************************

// TO ORDER ARRAY FROM BIG TO SMALL
function sortArrayLeastEngaged() {
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
    createRow10Pct(bottomMembers, 'loyaltyTableBottom10');
}



//******************************************************* SHARED FORM TO PRINT MOST AND LEAST ENGAGED TABLES *******************************************************

// FORM TO CREATE TOP 10 TABLES
function createRow10Pct(members, id) {
    for (i = 0; i < members.length; i++) {
        var createTr = document.createElement("tr");
        var createTd1 = document.createElement("td");
        var createTd2 = document.createElement("td");
        var createTd3 = document.createElement("td");
        var senatorFullName = members[i].first_name + ' ' + members[i].last_name;
        if (members[i].middle_name) {senatorFullName = members[i].first_name + ' ' + members[i].middle_name + ' ' + members[i].last_name;};
        createTd1.innerHTML = senatorFullName.link(members[i].url);
        var votesWithParty = members[i].total_votes * members[i].votes_with_party_pct / 100;
        createTd2.innerHTML = Math.round(votesWithParty);
        createTd3.innerHTML = members[i].votes_with_party_pct + '%';
        createTr.append(createTd1, createTd2, createTd3);
        document.getElementById(id).appendChild(createTr);
    }
};
