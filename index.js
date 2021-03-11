let whiteMana = "./assets/White.png";
let blueMana = "./assets/Blue.png";
let blackMana = "./assets/Black.png";
let redMana = "./assets/Red.png";
let greenMana = "./assets/Green.png";
let colorlessMana = "./assets/Colorless.png";
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

    document.getElementById("create-deck").addEventListener('click', newDeckList)
    document.getElementById("decklist").addEventListener("change", displayDeck)
    
    getDeck();
    createDeckOptions();

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
    cardName.className = "img-tooltip";

    let cardImg = document.createElement("img");
    cardImg.src = card.imageUrl;
    cardImg.alt = card.name;
    cardImg.className = "card-preview";
    cardName.appendChild(cardImg);

    let manaCost = document.createElement("td");
    manaCost.innerHTML = formatManaCost(card.manaCost);

    let cardType = document.createElement("td");
    cardType.textContent = card.types;

    let cardPower = document.createElement("td");
    cardPower.textContent = card.power;

    let cardToughness = document.createElement("td");
    cardToughness.textContent = card.toughness;

    let cardSet = document.createElement("td");
    cardSet.textContent = card.set;

    let cardRarity = document.createElement("td");
    cardRarity.textContent = card.rarity;

    let addCard = document.createElement("button");
    addCard.textContent = "+";
    addCard.id = "add-card";
    addCard.addEventListener("click", addCardToDeck);

    row.append(cardName, manaCost, cardType, cardPower, cardToughness, cardSet, cardRarity, addCard);

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
            case "C":
                result += ` <img class="manaImg" src=${colorlessMana}>`;
                break;
            default:
                result += cleanCost[i] + "";
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
        document.getElementById("deck-tab").style.backgroundColor = "red";
        document.getElementById("search-tab").style.backgroundColor = "gray";

    } else if (defaultTab.style.display == "block") {
        defaultTab.style.display = "none";
        deckDiv.style.display = "block";
        document.getElementById("deck-tab").style.backgroundColor = "red";
        document.getElementById("search-tab").style.backgroundColor = "gray";
    }
}


function displayMainTab() {
    let defaultTab = document.getElementById("main-tab");
    let deckDiv = document.getElementById("deck-div");
    if (deckDiv.style.display == "block") {
        defaultTab.style.display = "block";
        deckDiv.style.display = "none";
        document.getElementById("deck-tab").style.backgroundColor = "gray";
        document.getElementById("search-tab").style.backgroundColor = "red";
    }
}


function enableSingleCollapsible(collapse) {
    collapse.addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

function displayCard(cardObj, deckContainer) {
    let cardButton = document.createElement("button");
    cardButton.type = "button";
    cardButton.className = "collapsible";
    cardButton.innerHTML = `${cardObj.name}    Mana: ${cardObj.manaCost}`;

    let cardDiv = document.createElement("div");
    cardDiv.className = "content";

    let cardIMG = document.createElement("img");
    cardIMG.src = cardObj.image;
    let cardData = document.createElement("p");
    cardData.innerHTML = `Type: ${cardObj.type} <br>Power: ${cardObj.power} <br>Toughness: ${cardObj.toughness} <br>Set: ${cardObj.set} <br>Rarity: ${cardObj.rarity}`;

    let removeButton = document.createElement("button");
    removeButton.textContent = "REMOVE";
    removeButton.id = cardObj.id;
    removeButton.addEventListener("click", removeCard);

    if (!cardIMG.src.includes("undefined")) {
        cardDiv.append(cardIMG, cardData, removeButton);
    } else {
        cardDiv.append(cardData, removeButton);
    }

    deckContainer.append(cardButton, cardDiv);
    enableSingleCollapsible(cardButton);
}

function displayAllCards(cardsArray) {
    let deckContainer = document.getElementById("cardsDiv");
    deckContainer.innerHTML = ""
    cardsArray.forEach((cardObj) => {
        displayCard(cardObj, deckContainer);
    });
}

function addCardToDeck(e) {
    let deckUrl = "http://localhost:3000/cards";
    let tRow = e.target.parentElement.querySelectorAll("td");
    let img = tRow[0].querySelector("img");
    let select =  document.getElementById("decklist").selectedOptions
    let card = {
        name: tRow[0].textContent,
        manaCost: tRow[1].innerHTML,
        type: tRow[2].textContent,
        power: tRow[3].textContent,
        toughness: tRow[4].textContent,
        set: tRow[5].textContent,
        rarity: tRow[6].textContent,
        image: img.src,
        deckId: parseInt(select[0].value)
    };
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(card),
    };
    fetch(deckUrl, configObj)
        .then((r) => r.json())
        .then((d) => {
            let deckContainer = document.getElementById("deck-div");
            displayCard(d, deckContainer);
        });
}

function getDeck() {
    fetch("http://localhost:3000/cards?deckId=1")
        .then((r) => r.json())
        .then((cards) => {
            displayAllCards(cards);
        });
}

function removeCard(e) {
    let url = `http://localhost:3000/deck/${e.target.id}`;
    let parent = e.target.parentElement;
    let parentBttn = e.target.parentElement.previousElementSibling;
    parent.remove();
    parentBttn.remove();
    fetch(url, { method: "DELETE" });
}

function newDeckList(){
    let deckname = window.prompt("Enter Deck Name", "Deck Name")
    let deckUrl = "http://localhost:3000/deck"
    let deck = {name: deckname}
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(deck),
    }
    fetch(deckUrl, configObj)
    .then(r => r.json())
    .then(deck => buildDeckOption(deck)
)
}

function displayDeck(){
    let select =  document.getElementById("decklist").selectedOptions
    fetch(`http://localhost:3000/cards?deckId=${select[0].value}`)
    .then((r) => r.json())
    .then((cards) => {
        displayAllCards(cards);
    });
}

function buildDeckOption(deck){
    let select = document.getElementById("decklist")
    let opt = document.createElement("option")
    opt.value = deck.id
    opt.textContent = deck.name
    select.appendChild(opt)
}

function createDeckOptions(){
    fetch("http://localhost:3000/deck")
    .then(r => r.json())
    .then(decks => {
        decks.forEach(deck => buildDeckOption(deck))
    })
}