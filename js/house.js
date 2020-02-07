// HOUSE JS

const members = data.results[0].members;

function orderMembers() {
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
        document.getElementById('house-data').appendChild(createTr);
    };
};
orderMembers();