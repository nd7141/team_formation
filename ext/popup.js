// localStorage.clear(); // remove all values; todo move to initialization

// function initialize_page() {
// 	localStorage.clear()
// 	var preambula = '<button type="button" id="create_row">Create row</button> \
// 					<button type="button" id="remove_row">Delete row</button> \
// 					<button type="button" id="initialize">New Table</button><br> \
// 					Players per team: <input size="4" id="players" value="2"><br> \
// 					<button type="button" id="calculate_teams">Find Teams</button> \
// 					<table id="main_table"> \
// 					  <tr> \
// 					    <td>#</td> \
// 					    <td>Name</td> \
// 					    <td>Pref.1</td> \
// 					    <td>Pref.2</td> \
// 					    <td>Pref.3</td> \
// 					  </tr> \
// 					</table> \
// 					<br> \
// 					<h1 id="results_h1"></h1> \
// 					<table id="results_table"> \
// 					</table>'
// 	var div = document.createElement('div');
// 	div.innerHTML = preambula;
// }
// initialize_page();

// document.getElementById('initialize').onclick = initialize_page;

function create_row() {
  	localStorage["last_session"] = true;
	var table = document.getElementById("main_table");
	var n = table.rows.length;
	var m = table.rows[0].cells.length;
	var row = table.insertRow(n);
	if (!JSON.parse(localStorage['use_storage'])) {
		if (n === 1) {
			localStorage["cells"] = JSON.stringify([{}]);
		}
		else if (n > 1) {
			var cells = JSON.parse(localStorage["cells"]);
			cells.push({});
			localStorage["cells"] = JSON.stringify(cells);
		}
	}
	var cell = row.insertCell(0);
	cell.innerHTML = n;
	for (j=1; j<m; j++) {
		create_cell(n-1, j, row);
	}
	return row
}

function create_cell(i, j, row){
	var cell = row.insertCell(j);
	if (j == 1) {
		cell.innerHTML = "<input size=10>";
	}
	else {
		cell.innerHTML = "<input size=4>";
	}
	cell.addEventListener("change", function () {
		var cells = JSON.parse(localStorage["cells"]);
    	cells[i.toString()][j.toString()] = cell.childNodes[0].value;
    	localStorage["cells"] = JSON.stringify(cells);
	})
}

document.getElementById('create_row').onclick = create_row;

function remove_row() {
    document.getElementById("main_table").deleteRow(-1);
}
document.getElementById('remove_row').onclick = remove_row;

// solution found here
// http://stackoverflow.com/a/18120786/2069858
function remove_element(el) {
	Element.prototype.remove = function() {
	    this.parentElement.removeChild(this);
	}
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	    for(var i = 0, len = this.length; i < len; i++) {
	        if(this[i] && this[i].parentElement) {
	            this[i].parentElement.removeChild(this[i]);
	        }
	    }
	}
	el.remove();
}

function show_results(teams) {
	document.getElementById("results_h1").innerHTML = "Results:"
	var table = document.getElementById("results_table");
	table.innerHTML = "";
	for (i=0; i<teams.length; i++) {
		var n = table.rows.length;
		var row = table.insertRow(n);
		var cell = row.insertCell(0)
		cell.innerHTML = i.toString();
		var team = teams[i];
		for (j=0; j<team.length; j++) {
			var cell = row.insertCell(j+1);
			cell.innerHTML = team[j];
		}
	}
	localStorage["results"] = true;
}

function calculate_teams() {
	var m = parseInt(document.getElementById("players").value);
	var table = document.getElementById("main_table");
	var N = table.rows.length - 1;
	var T = Math.floor(N/m);
	if (N%m != 0)
		T += 1;
	// console.log(N, m, T);
	var teams = new Array(T);
	for (i=0; i<T; i++) {
		teams[i] = [];
	}
	var names = [];
	for (i=1; i<table.rows.length; i++) {
		names.push(table.rows[i].cells[1].childNodes[0].value);
	}
	names = shuffle(names);
	var count = 0;
	var team_number;
	for (i=0; i<names.length; i++) {
		team_number = count%T;
		teams[team_number].push(names[i]);
		count += 1;
	}
	show_results(teams);
	localStorage["teams"] = JSON.stringify(teams);
	return teams;
}
document.getElementById("calculate_teams").onclick = calculate_teams;

// shuffle array 
// found here: http://stackoverflow.com/a/2450976/2069858
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// if (!localStorage["last_session"]) {
// 	initialize_page();
// }
// restore a table
if (localStorage["last_session"]) {
	localStorage["use_storage"] = true;
	try {
		var cells = JSON.parse(localStorage["cells"]);
		var n = cells.length;
		var table = document.getElementById("main_table")
		for (i=0; i<n; i++) {
			var row = create_row();
			var cell = cells[i]
			for (var key in cell) {
				if (cell.hasOwnProperty(key)) {
					var col = parseInt(key);
					var val = cell[key];
					row.cells[col].childNodes[0].value = val;
				}
			}
		}
	} catch	(e) {
		console.log("Catched error");
		console.log(e);
	}
	if (localStorage["results"]) {
		var teams = JSON.parse(localStorage["teams"]);
		show_results(teams);
	}
	localStorage['use_storage'] = false;
}