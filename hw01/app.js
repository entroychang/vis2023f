const classOptions = ['資工系', '資工所', '電資AI', '電資資安', '創新AI'];
const idFirstPartOptions = ["111", "112"];
const idSecondPartOptions = ["590", "598", "C52", "C53", "C71"];
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandomClass() {
  return classOptions[Math.floor(Math.random() * classOptions.length)];
}

function getRandomId() {
  const firstPart = idFirstPartOptions[Math.floor(Math.random() * idFirstPartOptions.length)];
  const secondPart = idSecondPartOptions[Math.floor(Math.random() * idSecondPartOptions.length)];
  const thirdPart = (Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0');
  
  return firstPart + secondPart + thirdPart;
}

function getRandomGithubId() {
    let result = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function getRandomScoreList() {
  const scoreList = [];

  for (let i = 0; i < 10; i++) {
    scoreList.push(Math.floor(Math.random() * 10));
  }

  return scoreList;
}

function generateDummyCsvTable() {
  let divElement = document.getElementById("dummy-csv-table");
  let table = document.createElement("table");

  let header = table.createTHead();
  let headerRow = header.insertRow();

  for (let i = 0; i < headerList.length; i++) {
    headerRow.insertCell().innerHTML = headerList[i];
  }

  for (let index = 1; index <= 120; index++) {
    let row = table.insertRow();
    let className = getRandomClass();
    let studentId = getRandomId();
    let studentName = "我是誰";
    let githubId = getRandomGithubId();
    let scoreList = getRandomScoreList();

    let rowItems = [index, className, studentId, studentName, githubId];

    for (let j = 0; j < rowItems.length; j++) {
      var cell = row.insertCell();
      cell.innerHTML = rowItems[j];
    }
    for (let j = 0; j < scoreList.length; j++) {
      var cell = row.insertCell();
      cell.innerHTML = scoreList[j];
    }
  } 

  divElement.appendChild(table);
}

function generateAppleScoreboardTable() {
  let divElement = document.getElementById("apple-scoreboard-table");
  let table = document.createElement("table");

  let header = table.createTHead();
  let headerRow = header.insertRow();

  for (let i = 0; i < headerList.length; i++) {
    headerRow.insertCell().innerHTML = headerList[i];
  }

  for (let index = 1; index <= 120; index++) {
    let row = table.insertRow();
    let className = getRandomClass();
    let studentId = getRandomId();
    let studentName = "我是誰";
    let githubId = getRandomGithubId();
    let scoreList = getRandomScoreList();

    let rowItems = [index, className, studentId, studentName, githubId];

    for (let j = 0; j < rowItems.length; j++) {
      var cell = row.insertCell();
      cell.innerHTML = rowItems[j];
    }
    for (let j = 0; j < scoreList.length; j++) {
      var cell = row.insertCell();
      cell.innerHTML = `<img src='../apples/${scoreList[j]}.svg' width='40' height='40'>`;
    }
  } 

  divElement.appendChild(table);
}
