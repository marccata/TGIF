// HOUSE JS

// TESTING CONNECTION WITH JS DATABASE
// document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);

const members = data.results[0].members;
const senatorData = ['first_name', 'party', 'state', 'seniority', 'votes_with_party_pct'];
const senatorLastName = ['last_name'];
const senatorMiddleName = ['middle_name'];
const senatorUrl = ['url'];


function orderData(members) {

    // create a loop to store the members in table rows
    for (i = 0; i < members.length; i++) {
        
        var createTr = document.createElement("tr");

        // loop to order each senatorData inside a td
        for (j = 0; j < senatorData.length; j++) {
            
            var createTd = document.createElement("td");

            // put first name and last name together
            if (senatorData[j] == senatorData[0] && members[i][senatorMiddleName[0]]) {
                var senatorFullName = members[i][senatorData[j]] + ' ' + members[i][senatorMiddleName[0]] + ' ' + members[i][senatorLastName[0]];
                createTd.innerHTML = senatorFullName.link(members[i][senatorUrl[0]]);
            } else if (senatorData[j] == senatorData[0]) {
                var senatorFullName = members[i][senatorData[j]] + ' ' + members[i][senatorLastName[0]];
                createTd.innerHTML = senatorFullName.link(members[i][senatorUrl[0]]);
            } else if (senatorData[j] == senatorData[4]){
                createTd.innerHTML = members[i][senatorData[j]] + '%';
            } else {
                createTd.innerHTML = members[i][senatorData[j]];
            };
            createTr.appendChild (createTd);

        };

        document.getElementById('house-data').appendChild(createTr);

    };


};

orderData(members);