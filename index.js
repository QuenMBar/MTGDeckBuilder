let whiteMana = "./assets/White.png";
let blueMana = "./assets/Blue.png";
let blackMana = "./assets/Black.png";
let redMana = "./assets/Red.png";
let greenMana = "./assets/Green.png";
let baseURL = "https://api.magicthegathering.io/v1/cards?page=";
let pageNum = 1;
let extraURL = "";
let currentTableStart = ``;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search").addEventListener("submit", onFormSubmit);

    document.getElementById("deck-tab").addEventListener("click", displayDeckTab);

    document.getElementById("search-tab").addEventListener("click", displayMainTab);

    document.getElementById("prev").addEventListener("click", (e) => page(false));
    document.getElementById("next").addEventListener("click", (e) => page(true));

    // Undo this later, but dont need to make so many page requests rn
    // getPageData();

    currentTableStart = document.getElementById("results").innerHTML;
});

function page(direction) {
    if (direction) {
        pageNum++;
        getPageData();
    } else if (pageNum > 1) {
        pageNum--;
        getPageData();
    }
}

function onFormSubmit(e) {
    e.preventDefault();
    let colors = [];
    if (e.target.white.checked == true) {
        colors.push("white");
    }
    if (e.target.blue.checked == true) {
        colors.push("blue");
    }
    if (e.target.black.checked == true) {
        colors.push("black");
    }
    if (e.target.red.checked == true) {
        colors.push("red");
    }
    if (e.target.green.checked == true) {
        colors.push("green");
    }
    parseURL(
        e.target.name.value,
        colors,
        e.target.orAnd.value,
        e.target.combineManaCost.value,
        e.target.type.value,
        e.target.power.value,
        e.target.toughness.value,
        e.target.set.value,
        e.target.rarity.value
    );

    pageNum = 1;

    getPageData();
}

function getPageData() {
    fetch(baseURL + pageNum.toString() + extraURL)
        .then((response) => response.json())
        .then((data) => {
            let table = document.getElementById("results");
            table.innerHTML = currentTableStart;
            data.cards.forEach((card) => showCard(card, table));
        });
}

function parseURL(name, color, orAnd, manaCost, type, power, toughness, set, rarity) {
    // console.log(`${name}, ${color}, ${orAnd}, ${manaCost}, ${type}, ${power}, ${toughness}, ${set}, ${rarity}`);
    extraURL = "";
    if (name != "") {
        extraURL += `&name=${name}`;
    }
    if (color.length != 0) {
        extraURL += `&colors=${color[0]}`;
        let punctuation = "|";
        if (orAnd === "and") {
            punctuation = ",";
        }

        for (let i = 1; i < color.length; i++) {
            extraURL += `${punctuation}${color[i]}`;
        }
    }
    if (manaCost != "") {
        extraURL += `&cmc=${manaCost}`;
    }
    if (type != "") {
        extraURL += `&type=${type}`;
    }
    if (power != "") {
        extraURL += `&power=${power}`;
    }
    if (toughness != "") {
        extraURL += `&toughness=${toughness}`;
    }
    if (set != "") {
        extraURL += `&set=${set}`;
    }
    if (rarity != "") {
        extraURL += `&rarity=${rarity}`;
    }
}

function showCard(card, table) {
    let row = document.createElement("tr");

    let cardName = document.createElement("td");
    cardName.textContent = card.name;

    let manaCost = document.createElement("td");
    manaCost.innerHTML = formatManaCost(card.manaCost);

    let cardType = document.createElement("td");
    cardType.textContent = card.types;

    row.appendChild(cardName);
    row.appendChild(manaCost);
    row.appendChild(cardType);

    table.appendChild(row);
}

function formatManaCost(cost) {
    let result = "";
    let cleanCost = [];
    let parts = cost.split("");
    for (let i = 0; i < parts.length; i++) {
        if (!"{}".includes(parts[i])) {
            cleanCost.push(parts[i]);
        }
    }
    for (let i = 0; i < cleanCost.length; i++) {
        switch (cleanCost[i]) {
            case "W":
                result += ` <img class="manaImg" src=${whiteMana}>`;
                break;
            case "U":
                result += ` <img class="manaImg" src=${blueMana}>`;
                break;
            case "B":
                result += ` <img class="manaImg" src=${blackMana}>`;
                break;
            case "R":
                result += ` <img class="manaImg" src=${redMana}>`;
                break;
            case "G":
                result += ` <img class="manaImg" src=${greenMana}>`;
                break;
            default:
                result += cleanCost[i];
        }
    }
    return result;
}

function displayDeckTab() {
    let defaultTab = document.getElementById("main-tab");
    let deckDiv = document.getElementById("deck-div");
    // console.log(defaultTab.style.display)
    if (defaultTab.style.display == "") {
        defaultTab.style.display = "none";
        deckDiv.style.display = "block";
    } else if (defaultTab.style.display == "block") {
        defaultTab.style.display = "none";
        deckDiv.style.display = "block";
    }
}

function displayMainTab() {
    let defaultTab = document.getElementById("main-tab");
    let deckDiv = document.getElementById("deck-div");
    if (deckDiv.style.display == "block") {
        defaultTab.style.display = "block";
        deckDiv.style.display = "none";
        console.log("hi");
    }
}
