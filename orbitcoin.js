var people = [];
scoutingPayout = false;
const textInput = document.getElementById('name');
const submitButton = document.getElementById('nameButton');

textInput.addEventListener('keypress', function (event) {
  if (event.key === "Enter") {
    document.getElementById("nameButton").click();
  }
});


class Person {
  constructor(name, money=20, accuracy = 0, matches = 0) {
    this.name = name;
    this.money = money;
    this.bet = 0;
    this.alliance = null;
    this.reviewAmount = null;
    this.reviewAlliance = null;
    this.accuracy = parseFloat(accuracy);
    this.matches = matches;
    this.selected = false;
  }
  bet(betAmount) {
    this.bet = betAmount;
  }
  allIn() {
    if (this.money ==1){
      this.bet = 1;
    }else{
      this.bet = this.money-1;
    }
    
  }
  win() {
    this.money -= -this.bet;
    this.alliance = null;
    if (this.bet != 0) {
      this.accuracy = (this.accuracy * this.matches + 1) / (this.matches + 1)
      this.matches -= -1;
    }
    this.bet = 0;

  }
  lose() {
    this.money -= this.bet;
    this.alliance = null;
    if (this.bet != 0) {
      this.accuracy = (this.accuracy * this.matches) / (this.matches + 1)
      this.matches -= -1;
    }
    this.bet = 0;

  }
  pay(mon) {
    this.money -= - mon;
    this.selected = false;
  }
  changeAlliance(newAlliance) {
    this.alliance = newAlliance;
  }
  toggleSelect() {
    if (this.selected) {
      this.selected = false;
    }
    else {
      this.selected = true;
    }
  }
}

function addPerson() {
  const name = document.getElementById("name").value;
  const newPerson = new Person(name);
  document.getElementById("name").value = "";
  people.push(newPerson);

  loadTableData();
}

function loadTableData() {
  const table = document.getElementById("body")
  table.innerHTML = "";
  for (let i = 0; i < people.length; i++) {
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = people[i].name;
    if (people[i].selected) {
      name.style.backgroundColor = "orange";
    }
    name.onclick = function () {
      if (scoutingPayout) {
        people[i].toggleSelect();
        if (people[i].selected) {
          name.style.backgroundColor = "orange";
        } else {
          name.style.backgroundColor = "white";
        }
      }

    }
    let money = row.insertCell(1);
    money.innerHTML = people[i].money;

    money.onclick = function () {
      openMoneyDialog(i);
    }
    let bet = row.insertCell(2);
    bet.innerHTML = people[i].bet;
    bet.onclick = function () {
      openBetDialog(i);
    }
    let red = row.insertCell(3);
    let blue = row.insertCell(4);
    if (people[i].alliance == "red") {
      red.innerHTML = "red";
    } else if (people[i].alliance == "blue") {
      blue.innerHTML = "blue";
    }
    red.onclick = function () {
      red.innerHTML = "red"; blue.innerHTML = "";
      people[i].changeAlliance("red");
    };
    blue.onclick = function () {
      blue.innerHTML = "blue"; red.innerHTML = "";
      people[i].changeAlliance("blue");
    };
    let underReview = row.insertCell(5);
    underReview.innerHTML = people[i].reviewAmount;
    let reviewAlliance = row.insertCell(6);
    reviewAlliance.innerHTML = people[i].reviewAlliance;
    let accuracy = row.insertCell(7);
    accuracy.innerHTML = people[i].accuracy.toFixed(2) + " out of " + people[i].matches;
  }
}

function openConfirmDialog(colorType){
  const div = document.getElementById("confirmDiv");
  div.style.display = "inline-block";
  const yes = document.getElementById("yes-confirm");
  if (colorType == 'red'){
    yes.onclick = function(){
      addRedBets();
      closeConfirm();
    }
  }else if (colorType == 'blue'){
    yes.onclick = function(){
      addBlueBets();
      closeConfirm();
    }
  }else if (colorType == "redReview"){
    yes.onclick = function(){
      addRedReview();
      closeConfirm();
    }
  }else if (colorType == "blueReview"){
    yes.onclick = function(){
      addBlueReview();
      closeConfirm();
    }
  }else if (colorType == "review"){
    yes.onclick = function(){
      underReview()
      closeConfirm();
    }
  }
}

function closeConfirm(){
  const div = document.getElementById("confirmDiv");
  div.style.display = "none";
}

function addRedBets() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    if (better.alliance == "red") {
      better.win();
    } else if (people[i].alliance == "blue") {
      better.lose();
    }
    better.bet = 0;
  }
  loadTableData();
}

function addBlueBets() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    if (people[i].alliance == "blue") {
      better.win();
    } else if (people[i].alliance == "red") {
      better.lose();
    }
    better.bet = 0;
  }
  loadTableData();
}

function underReview() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    better.reviewAmount = better.bet;
    better.bet = 0;
    better.reviewAlliance = better.alliance;
    better.alliance = null;
  }
  loadTableData();
}

function addRedReview() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    if (better.reviewAlliance == "red") {
      if (better.reviewAmount != 0) {
        people[i].money -= -better.reviewAmount;
        people[i].accuracy = (better.accuracy * better.matches + 1) / (better.matches + 1)
        people[i].matches -= -1;
      }
    } else if (better.reviewAlliance == "blue") {
      if (better.reviewAmount != 0) {
        people[i].money -= better.reviewAmount;
        people[i].accuracy = (better.accuracy * better.matches) / (better.matches + 1)
        people[i].matches -= -1;
      }
    }
    people[i].reviewAlliance = null;
    people[i].reviewAmount = null;
  }
  loadTableData();
}

function addBlueReview() {
  const table = document.getElementById("body");
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    if (better.reviewAlliance == "blue") {
      if (better.reviewAmount != 0) {
        people[i].money -= -better.reviewAmount;
        people[i].accuracy = (better.accuracy * better.matches + 1) / (better.matches + 1)
        people[i].matches -= -1;
      }
    } else if (better.reviewAlliance == "red") {
      if (better.reviewAmount != 0) {
        people[i].money -= better.reviewAmount;
        people[i].accuracy = (better.accuracy * better.matches) / (better.matches + 1)
        people[i].matches -= -1;
      }
    }
    people[i].reviewAlliance = null;
    people[i].reviewAmount = null;
  }
  loadTableData();
}


function openBetDialog(personIndex) {
  const better = people[personIndex]
  const dialog = document.getElementById("bettingModal");
  let maxBet = better.money - 1;
  if (maxBet == 0){
    maxBet = 1;
  }
  dialog.style.display = 'inline-block';
  document.getElementById("betting-name").innerHTML = better.name;
  const allIn = document.getElementById("allIn");
  document.getElementById("betting-amount").value = better.bet;
  allIn.onclick = function () {
    document.getElementById("betting-amount").value = maxBet;
  };
  const submitButton = document.getElementById("betting-confirm");
  submitButton.onclick = function () {
    if (better.money < document.getElementById("betting-amount").value){
      better.bet = maxBet;
    }
    else{
      better.bet = document.getElementById("betting-amount").value;
    } 
    dialog.style.display = 'none';
    loadTableData();
  }

}

function addBet(amount) {
  document.getElementById("betting-amount").value -= -amount;
}

function saveBet() {
  const bet = document.getElementById("betting-amount").value;

}

function scoutMode() {
  if (scoutingPayout == false) {
    document.getElementById("scoutMode").style.backgroundColor = 'orange';
    scoutingPayout = true;
  }
  else {
    document.getElementById("scoutMode").style.backgroundColor = 'white';
    for (let i = 0; i < people.length; i++) {
      people[i].selected = false;
    }
    scoutingPayout = false;
    loadTableData();
  }
}

function payoutTime() {
  if (scoutingPayout) {
    const paycheck = document.getElementById("payout-amount").value;
    for (let i = 0; i < people.length; i++) {
      let better = people[i];
      if (better.selected) {
        better.pay(paycheck);
      }
    }
    scoutMode();
    loadTableData();
  }

}

function compareAcc(obj1, obj2){
  if (Number(obj1.accuracy)>= obj2.accuracy){
    return true;
  }
  return false;
}

function compareMoney(obj1, obj2){
  if (obj1.money >= obj2.money){
    return true;
  }
  return false;
}
function compareMatches(obj1, obj2){
  if (obj1.matches >= obj2.matches){
    return true;
  }
  return false;
}

function compareNames(obj1, obj2){
  if (obj1.name<=obj2.name){
    return true;
  }
  return false;
}

function compare(obj1, obj2, type){
  if (type == "money"){
    return compareMoney(obj1, obj2);
  }
  else if (type == "accuracy"){
    return compareAcc(obj1, obj2);
  }
  else if (type == "matches"){
    return compareMatches(obj1, obj2);
  }
  else if (type =="name"){
    return compareNames(obj1, obj2);
  }
}

// credit geeks for geeks cuz I couldn't figure out merge sort lol
function merge(arr, left, mid, right, type) { // type is to see what the code is sorting by
  const n1 = mid - left + 1;
  const n2 = right - mid;

  // Create temp arrays
  const L = new Array(n1);
  const R = new Array(n2);

  // Copy data to temp arrays L[] and R[]
  for (let i = 0; i < n1; i++)
      L[i] = arr[left + i];
  for (let j = 0; j < n2; j++)
      R[j] = arr[mid + 1 + j];

  let i = 0, j = 0;
  let k = left;

  // Merge the temp arrays back into arr[left..right]
  while (i < n1 && j < n2) {
      if (compare(L[i], R[j], type)) {
          arr[k] = L[i];
          i++;
      } else {
          arr[k] = R[j];
          j++;
      }
      k++;
  }

  // Copy the remaining elements of L[], if there are any
  while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
  }

  // Copy the remaining elements of R[], if there are any
  while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
  }
}

function mergeSort(arr, left, right, type) { 
  // type is to see what the code is sorting by ex. accuracy, money, etc.
  if (left >= right)
      return;

  const mid = Math.floor(left + (right - left) / 2);
  mergeSort(arr, left, mid, type);
  mergeSort(arr, mid + 1, right, type);
  merge(arr, left, mid, right, type);
}


function sortPeople(type){
  mergeSort(people, 0, people.length-1, type);
  loadTableData();
}

function pickWinner(){
  let totalMoney = 0;
  for (let i = 0; i<people.length;i++){
    totalMoney += people[i].money;
  }

  let winNum = Math.floor(Math.random() * (totalMoney))+1;
  let currentNum = 0;

  for (let i = 0; i<people.length;i++){
    currentNum +=people[i].money;
    if (currentNum>=winNum){
      return i;
    }
  }
  reutrn -1;

}

const saveData = () => {
  const link = document.createElement("a");
  const content = [["Name", "Total", "Accuracy", "Matches \n"]];
  for (let i = 0; i < people.length; i++) {
    let better = people[i];
    let info = [better.name, better.money, better.accuracy, better.matches + "\n"];
    content.push(info);
  }
  const file = new Blob(content, { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  let name = document.getElementById("fileName").value.concat(".txt");
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
};

  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', function(event) {
      let fr = new FileReader();
      fr.onload = function () {
        let results = fr.result.split("\n");
        for (let i = 1; i<results.length; i++){
          results[i] = results[i].split(",");
        }
        for (let i = 1; i<results.length-1; i++){
          people.push(new Person(results[i][0], parseInt(results[i][1],10), parseFloat(results[i][2]), parseInt(results[i][3], 10)));
        }
        loadTableData();
    }

    fr.readAsText(this.files[0]);
  });

  