function startDiagnosis() {
  const input = document.getElementById("birthdate").value;

  if (!input) {
    alert("お誕生日を入れてね🐶💕");
    return;
  }

  resetCells();

  const date = new Date(input);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const zodiac = getZodiac(month, day);
  showZodiac(zodiac);

  const digits = getBirthDigits(input);
  showGrid(digits);

  const arrows = getArrows(digits);
  showPitagoras(digits, arrows);

  showBoss(arrows);
  showHint();

  document.getElementById("resultArea").classList.remove("hidden");
  document.getElementById("resultArea").scrollIntoView({ behavior: "smooth" });
}

function resetDiagnosis() {
  document.getElementById("resultArea").classList.add("hidden");
  document.getElementById("birthdate").value = "";
  resetCells();

  const subBox = document.getElementById("subTypes");
  if (subBox) subBox.innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getZodiac(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacData[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacData[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return zodiacData[2];
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return zodiacData[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacData[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacData[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return zodiacData[6];
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return zodiacData[7];
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return zodiacData[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacData[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacData[10];
  return zodiacData[11];
}

function showZodiac(zodiac) {
  document.getElementById("zodiacImage").src = zodiac.image;
  document.getElementById("zodiacImage").alt = zodiac.name;
  document.getElementById("zodiacName").textContent = zodiac.name;
  document.getElementById("zodiacText").textContent = zodiac.text;
}

function getBirthDigits(input) {
  const onlyNumbers = input.replaceAll("-", "");
  return onlyNumbers.split("").filter(n => n !== "0");
}

function showGrid(digits) {
  const counts = {};

  digits.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
  });

  for (let i = 1; i <= 9; i++) {
    const cell = document.getElementById("num" + i);

    if (counts[i]) {
      cell.classList.add("active");
      cell.textContent = counts[i] >= 2 ? `${i}×${counts[i]}` : i;
    }
  }

  const numbersText = Object.keys(counts)
    .sort()
    .map(num => `${num}が${counts[num]}個`)
    .join("・");

  document.getElementById("numberText").textContent =
    numbersText ? `出ている数字：${numbersText}` : "";
}

function resetCells() {
  for (let i = 1; i <= 9; i++) {
    const cell = document.getElementById("num" + i);
    cell.classList.remove("active");
    cell.textContent = i;
  }
}

function getArrows(digits) {
  const unique = [...new Set(digits)];
  const arrows = ["123", "456", "789", "147", "258", "369", "159", "357"];

  return arrows.filter(arrow => {
    return arrow.split("").every(num => unique.includes(num));
  });
}

function showPitagoras(digits, arrows) {
  const mainKey = arrows.length > 0 ? arrows[0] : "none";
  const mainData = pitagorasTypes[mainKey];

  document.getElementById("mainType").textContent = mainData.title;
  document.getElementById("pitagorasText").textContent = mainData.text;

  const subBox = document.getElementById("subTypes");
  subBox.innerHTML = "";

  showNumberMeanings(digits, subBox);

  if (arrows.length > 1) {
    const title = document.createElement("h3");
    title.textContent = "🌈あなたの中にあるサブの力";
    subBox.appendChild(title);

    arrows.slice(1).forEach(key => {
      const data = pitagorasTypes[key];

      const div = document.createElement("div");
      div.className = "sub-type-box";

      div.innerHTML = `
        <strong>${data.title}</strong>
        <p>${data.text}</p>
      `;

      subBox.appendChild(div);
    });
  }
}

function showNumberMeanings(digits, targetBox) {
  const counts = {};

  digits.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
  });

  const title = document.createElement("h3");
  title.textContent = "🔢出ている数字の意味";
  targetBox.appendChild(title);

  Object.keys(counts).sort().forEach(num => {
    const data = numberMeanings[num];
    if (!data) return;

    const div = document.createElement("div");
    div.className = "sub-type-box";

    let strengthText = "";
    if (counts[num] >= 3) {
      strengthText = "この数字が3つ以上あるので、この力が強めに出やすいかもしれません。";
    } else if (counts[num] === 2) {
      strengthText = "この数字が2つあるので、この力が少し出やすいかもしれません。";
    } else {
      strengthText = "この数字の力を持っています。";
    }

    div.innerHTML = `
      <strong>${num}｜${data.word}</strong>
      <p>${data.text}</p>
      <p class="small">${strengthText}</p>
    `;

    targetBox.appendChild(div);
  });

  const maxCount = Math.max(...Object.values(counts));
  const balance = document.createElement("div");
  balance.className = "sub-type-box";

  if (maxCount >= 3) {
    balance.innerHTML = `<p>${numberBalanceMessages.high}</p>`;
  } else if (maxCount === 2) {
    balance.innerHTML = `<p>${numberBalanceMessages.middle}</p>`;
  } else {
    balance.innerHTML = `<p>${numberBalanceMessages.low}</p>`;
  }

  targetBox.appendChild(balance);
}

function showBoss(arrows) {
  const mainKey = arrows.length > 0 ? arrows[0] : "none";
  document.getElementById("bossText").textContent = bossData[mainKey];
}

function showHint() {
  const randomIndex = Math.floor(Math.random() * hints.length);
  document.getElementById("hintText").textContent = hints[randomIndex];
}
