var people = [];
var dialogPerson = null;


class Person {
  constructor(name) {
    this.name = name;
    this.money = 20;
    this.bet = 0;
    this.alliance = "";
    this.reviewAmount = null;
    this.reviewAlliance = null;
  }
  bet(betAmount) {
    this.bet = betAmount;
  }
  allIn() {
    this.bet = this.money;
  }
  win() {
    this.money += this.bet;
    this.bet = 0;
  }
  lose() {
    this.money -= this.bet;
    this.bet = 0;
  }
  changeAlliance(newAlliance) {
    this.alliance = newAlliance;
  }
}

function addRedBets() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    people[i].bet = 0;
    if (people[i].alliance == "red") {
      bet = table.rows[i].cells[2].innerHTML;
      people[i].money += parseInt(bet);
      people[i].alliance = "";
    }else if (people[i].alliance == "blue") {
      bet = table.rows[i].cells[2].innerHTML;
      people[i].money -= parseInt(bet);
      people[i].alliance = "";
    }
  }
  loadTableData();
}
function addRedReview() {
  saveBets();
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    if (people[i].reviewAlliance == "red") {
      bet = table.rows[i].cells[5].innerHTML;
      people[i].money += parseInt(bet);
    }else if (people[i].reviewAlliance == "blue") {
      bet = table.rows[i].cells[5].innerHTML;
      people[i].money -= parseInt(bet);
    } 
    people[i].reviewAlliance = null;
    people[i].reviewAmount = null;
  }
  loadTableData();
}
function addBlueBets() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    people[i].bet = 0;
    if (people[i].alliance == "blue") {
      bet = table.rows[i].cells[2].innerHTML;
      people[i].money += parseInt(bet);
      people[i].alliance = "";
    }else if (people[i].alliance == "red") {
      bet = table.rows[i].cells[2].innerHTML;
      people[i].money -= parseInt(bet);
      people[i].alliance = "";
    }
  }
  loadTableData();
}

function addBlueReview() {
  saveBets()
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    if (people[i].reviewAlliance == "blue") {
      bet = table.rows[i].cells[5].innerHTML;
      people[i].money += parseInt(bet);
    }else if (people[i].reviewAlliance == "red") {
      bet = table.rows[i].cells[5].innerHTML;
      people[i].money -= parseInt(bet);
    }
    people[i].reviewAlliance = null;
    people[i].reviewAmount = null;
  }
  loadTableData();
}

function addPerson() {
  saveBets();
  const name = document.getElementById("name").value;
  const newPerson = new Person(name);
  document.getElementById("name").value = "";
  people.push(newPerson);

  loadTableData();
}

function underReview() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    bet = table.rows[i].cells[2].innerHTML;
    people[i].reviewAmount = parseInt(bet);
    people[i].bet = 0;
    if (table.rows[i].cells[3].innerHTML != "") {
      people[i].reviewAlliance = "red";
      people[i].alliance = "";
    } else if (table.rows[i].cells[4].innerHTML != "") {
      people[i].reviewAlliance = "blue";
      people[i].alliance = "";
    }
  }
  loadTableData();
}

function openMoneyDialog(personIndex) {
  dialog = document.getElementById("dialog");
  dialog.open = true;
  dialogPerson = personIndex;
  nameText = document.getElementById("recipent");
  nameText.innerHTML = "Adding money for: " + people[personIndex].name;
  defaultAmount = document.getElementById("amount");
  defaultAmount.value = 5;
}
function closeMoneyDialog() {
  amount = document.getElementById("amount");
  if (amount.value == "."){
    amount.value = 5;
  }else if (amount.value == "-"){
    amount.value = 5;
  }else if(amount.value == "5"){
    amount.value = 10;
  }else{
    saveBets();
    addAmount();
    dialog = document.getElementById("dialog");
    dialog.open = false;
    personIndex = null;
    loadTableData();
  }
  
}

function addAmount() {
  add = document.getElementById("amount").value;
  sum = parseInt(add);
  if (isNaN(sum)){
    sum = 0;
  }
  people[dialogPerson].money += sum;
}

// function readTxtFile() {
//   const fs = require("fs");
//   fs.readFile("record.txt", "utf8", (err, data) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log(data);
//   });

// }
// function readTxt() {
//   let fr = new FileReader();
//   fr.onload = function () {
//     console.log(fr.result);
//     document.getElementById("output").innerHTML = fr.result;
//   }

  //fr.readAsText(this.files[0]);
// }

function saveBets() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    bet = table.rows[i].cells[2].innerHTML;
    people[i].bet = parseInt(bet);
    if (table.rows[i].cells[3].innerHTML != "") {
      people[i].alliance = "red";
    } else if (table.rows[i].cells[4].innerHTML != "") {
      people[i].alliance = "blue";
    }
  }
}

function loadTableData() {
  const table = document.getElementById("body")
  table.innerHTML = "";
  for (let i = 0; i < people.length; i++) {
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = people[i].name;
    let money = row.insertCell(1);
    money.innerHTML = people[i].money;

    money.onclick = function () {
      openMoneyDialog(i);
    }
    let bet = row.insertCell(2);
    bet.innerHTML = people[i].bet;
    bet.contentEditable = true;
    bet.change = function () {
      people[i].bet = parseInt(this.innerHTML);
    }
    let red = row.insertCell(3);
    let blue = row.insertCell(4);
    if (people[i].alliance == "red") {
      red.innerHTML = "red";
    } else if (people[i].alliance == "blue") {
      blue.innerHTML = "blue";
    }
    red.onclick = function () {
      red.innerHTML = "red"; blue.innerHTML = ""; people[i].changeAlliance("red");
    };
    blue.onclick = function () {
      blue.innerHTML = "blue"; red.innerHTML = "";
      people[i].changeAlliance("blue");
    }
    let underReview = row.insertCell(5);
    underReview.innerHTML = people[i].reviewAmount;
    let reviewAlliance = row.insertCell(6);
    reviewAlliance.innerHTML = people[i].reviewAlliance;
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

loadTableData();

//var table = document.getElementById('body');