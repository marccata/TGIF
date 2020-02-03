// OPEN/CLOSE TEXT BOX FROM HOME

var button = document.getElementById('rmbutton');

button.onclick = function () {

    var box = document.getElementById('readmorebox');
    var btntext = document.getElementById("rmbutton");

    if (box.style.display === 'none') {
        box.style.display = 'block';
        btntext.innerHTML = "Hide";
    } else {
        box.style.display = 'none';
        btntext.innerHTML = "Read more";
    };

};