// Initialize and set global variables
let baseURL = "https://api.magicthegathering.io/v1/cards?page=";
let pageNum = 1;
let extraURL = "";
let currentTableStart = ``;

// Once the website is loaded, add event listeners and populate the deck initially
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search").addEventListener("submit", onFormSubmit);

    document.getElementById("deck-tab").addEventListener("click", displayDeckTab);
    document.getElementById("search-tab").addEventListener("click", displayMainTab);

    document.getElementById("prev").addEventListener("click", (e) => page(false));
    document.getElementById("next").addEventListener("click", (e) => page(true));

    document.getElementById("clear-search").addEventListener("click", () => clearSearch());
    document.getElementById("create-deck").addEventListener("click", newDeckList);
    document.getElementById("decklist").addEventListener("change", displayDeck);
    document.getElementById("RandomDeck").addEventListener("click", createRandomDeck);

    getDeck();
    createDeckOptions();

    getPageData();

    // Saves the table headers so they can be redone later
    currentTableStart = document.getElementById("results").innerHTML;
});

/**
 * Gets the new page of card results
 * @param {boolean} direction True increments the page and false decrements it
 */
function page(direction) {
    if (direction) {
        pageNum++;
        getPageData();
    } else if (pageNum > 1) {
        pageNum--;
        getPageData();
    }
}

/**
 * When the form is submitted, parse the colors selected, then parse the url from the given
 * inputs and save it globally, and then call to get the page data
 * @param {Event} e
 */
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

/**
 * Using the global url, make an API request to the server
 */
function getPageData() {
    fetch(baseURL + pageNum.toString() + extraURL)
        .then((response) => response.json())
        .then((data) => {
            let table = document.getElementById("results");
            table.innerHTML = currentTableStart;
            data.cards.forEach((card) => showCard(card, table));
        });
}

/**
 * Parses the url from the inputs given by the form.  Saves this new url globally to be used by the fetch
 * @param {string} name
 * @param {string[]} color Array of all the colors selected
 * @param {string} orAnd Whether were looking for both or either of the colors.  Defaults to or
 * @param {string} manaCost
 * @param {string} type
 * @param {string} power
 * @param {string} toughness
 * @param {string} set
 * @param {string} rarity
 */
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

/**
 * Creates a row for the card and appends it to the table
 * @param {Object} card A card object gotten from the api call
 * @param {HTMLTableElement} table The table it is being appended to
 */
function showCard(card, table) {
    if (card.multiverseid !== undefined) {
        let row = document.createElement("tr");

        let cardName = document.createElement("td");
        cardName.textContent = card.name;
        cardName.data = {
            text: card.text,
            flavor: card.flavor,
        };
        cardName.className = "img-tooltip";

        let cardImg = document.createElement("img");
        cardImg.src = card.imageUrl;
        cardImg.alt = card.name;
        cardImg.className = "card-preview";
        cardName.appendChild(cardImg);

        let manaCost = document.createElement("td");
        if (card.types[0] != "Land") {
            manaCost.innerHTML = formatManaCost(card.manaCost);
        }

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
}

/**
 * Clears the data from the page
 */
function clearSearch() {
    document.getElementById("search").reset();
    document.getElementById("results").innerHTML = currentTableStart;
}

/**
 * Converts the returned mana cost from the api to use the mana images instead of letters
 * @param {string} cost Mana cost gotten from API
 * @returns {HTMLElement} HTML element with a number or a picture
 */
function formatManaCost(cost) {
    let result = "";
    let temp = "";
    let cleanCost = [];
    for (let i = 0; i < cost.length; i++) {
        if (cost[i] == "{") {
            temp = "";
        } else if (cost[i] == "}") {
            cleanCost.push(temp);
        } else {
            if (cost[i] != "/") {
                temp += cost[i];
            }
        }
    }
    for (let i = 0; i < cleanCost.length; i++) {
        result += ` <img class="manaImg" src=./assets/symbols/${cleanCost[i]}.png>`;
    }
    return result;
}

/**
 * Logic for the deck tab.  Should be a callback for when the tab is clicked
 */
function displayDeckTab() {
    let defaultTab = document.getElementById("main-tab");
    let deckDiv = document.getElementById("deck-div");
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

/**
 * Logic for the main tab.  Should be a callback for when the tab is clicked
 */
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

/**
 * Logic for the collapsible html elements.  Should be called on the button part
 * of the element every time one is created
 * @param {HTMLButtonElement} collapse Button for the collapsible HTML element
 */
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

/**
 * Uses a card to create the compatibles that populate the deck tab
 * @param {Object} cardObj Gotten from the local database
 * @param {HTMLDivElement} deckContainer
 */
function displayCard(cardObj, deckContainer) {
    let cardButton = document.createElement("button");
    cardButton.type = "button";
    cardButton.className = "collapsible";

    let cardName = document.createElement("h2");
    cardName.textContent = cardObj.name;
    cardName.className = "cardName";
    let cardMana = document.createElement("h3");
    cardMana.innerHTML = `Mana: ${cardObj.manaCost}`;
    cardMana.className = "cardMana";

    cardButton.append(cardName, cardMana);

    let cardDiv = document.createElement("div");
    cardDiv.className = "content";

    let cardIMG = document.createElement("img");
    cardIMG.src = cardObj.image;
    cardIMG.className = "cardIMG";

    let cardDesc = document.createElement("div");
    if (cardObj.flavor === undefined) {
        cardDesc.innerHTML = `<p class="cardText">${cardObj.text}</p>`;
    } else {
        cardDesc.innerHTML = `<p class="cardText">${cardObj.text}</p> <p>${cardObj.flavor}</p>`;
    }
    cardDesc.className = "cardDesc";

    let cardStats = document.createElement("div");
    cardStats.className = "cardStats";

    let stats = ["Type", "Power", "Toughness", "Set", "Rarity"];
    stats.forEach((typeDesc) => {
        let tempP = document.createElement("p");
        if (cardObj[typeDesc.toLowerCase()] === "") {
            tempP.textContent = `${typeDesc}: N/A`;
        } else {
            tempP.textContent = `${typeDesc}: ${cardObj[typeDesc.toLowerCase()]}`;
        }
        cardStats.append(tempP);
    });
    let statsDiv = document.createElement("div");
    statsDiv.className = "statsDivNoImg";

    let statsHeader = document.createElement("p");
    statsHeader.textContent = "Stats: ";
    statsHeader.className = "statsHeader";

    statsDiv.append(statsHeader, cardStats);

    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove Card";
    removeButton.id = cardObj.id;
    removeButton.className = "removeButton";
    removeButton.addEventListener("click", removeCard);

    if (!cardIMG.src.includes("undefined") || cardIMG.src === "") {
        cardDiv.append(cardIMG);
        statsDiv.className = "statsDiv";
    }
    cardDiv.append(statsDiv, removeButton, cardDesc);

    deckContainer.append(cardButton, cardDiv);
    enableSingleCollapsible(cardButton);
}

/**
 * Uses an array of cards from the database to rewrite the deck tab
 * @param {Object[]} cardsArray
 */
function displayAllCards(cardsArray) {
    let deckContainer = document.getElementById("cardsDiv");
    deckContainer.innerHTML = "";
    cardsArray.forEach((cardObj) => {
        displayCard(cardObj, deckContainer);
    });
}

/**
 * When the add button is pressed, adds the corresponding card to the database,
 * and then adds it to the deck
 * @param {Event} e
 */
function addCardToDeck(e) {
    let deckUrl = "http://localhost:3000/cards";
    let tRow = e.target.parentElement.querySelectorAll("td");
    let img = tRow[0].querySelector("img");
    let select = document.getElementById("decklist").selectedOptions;
    let card = {
        name: tRow[0].textContent,
        manaCost: tRow[1].innerHTML,
        type: tRow[2].textContent,
        power: tRow[3].textContent,
        toughness: tRow[4].textContent,
        set: tRow[5].textContent,
        rarity: tRow[6].textContent,
        image: img.src,
        text: tRow[0].data.text,
        flavor: tRow[0].data.flavor,
        deckId: parseInt(select[0].value),
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
            let deckContainer = document.getElementById("cardsDiv");
            displayCard(d, deckContainer);
        });
}

/**
 * Gets the main deck from the database and displays it
 */
function getDeck() {
    fetch("http://localhost:3000/cards?deckId=1")
        .then((r) => r.json())
        .then((cards) => {
            displayAllCards(cards);
        });
}

/**
 * Removes a card from the Dom and the database
 * @param {Event} e
 */
function removeCard(e) {
    let url = `http://localhost:3000/cards/${e.target.id}`;
    let parent = e.target.parentElement;
    let parentBttn = e.target.parentElement.previousElementSibling;
    parent.remove();
    parentBttn.remove();
    fetch(url, { method: "DELETE" });
}

/**
 * Creates a new deck to add cards to.  Makes a pop up for deck name
 * @return {Promise<number>} Deck ID
 */
function newDeckList() {
    return new Promise((resolve) => {
        let deckname = window.prompt("Enter Deck Name", "Deck Name");
        let deckUrl = "http://localhost:3000/deck";
        let deck = { name: deckname };
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(deck),
        };
        fetch(deckUrl, configObj)
            .then((r) => r.json())
            .then((deck) => {
                buildDeckOption(deck);
                resolve(deck.id);
            });
    });
}

/**
 * Displays a given deck of cards
 */
function displayDeck() {
    let select = document.getElementById("decklist").selectedOptions;
    fetch(`http://localhost:3000/cards?deckId=${select[0].value}`)
        .then((r) => r.json())
        .then((cards) => {
            displayAllCards(cards);
        });
}

/**
 * Adds the deck name to the drop down
 * @param {Object} deck
 * @param {string} deck.name
 */
function buildDeckOption(deck) {
    let select = document.getElementById("decklist");
    let opt = document.createElement("option");
    opt.value = deck.id;
    opt.textContent = deck.name;
    select.appendChild(opt);
}

/**
 * Loads in the deck names for the drop down
 */
function createDeckOptions() {
    fetch("http://localhost:3000/deck")
        .then((r) => r.json())
        .then((decks) => {
            decks.forEach((deck) => buildDeckOption(deck));
        });
}

/**
 * Creates a random deck of 60 items and saves it to the database.
 * Sleep is called to not overwhelm the server with rapid post requests.
 */
async function createRandomDeck() {
    let response = await fetch("https://api.magicthegathering.io/v1/cards?page=1&random=true");
    let wrappedData = await response.json();
    let data = wrappedData.cards;
    let deckID = await newDeckList();
    let deckUrl = "http://localhost:3000/cards";
    for (let i = 0; i < 60; i++) {
        let manaCostHTML = ``;
        if (data[i].manaCost != "Land" && data[i].manaCost != undefined) {
            manaCostHTML = formatManaCost(data[i].manaCost);
        }
        let newCard = {
            name: data[i].name,
            manaCost: manaCostHTML,
            type: data[i].type,
            power: data[i].power,
            toughness: data[i].toughness,
            set: data[i].set,
            rarity: data[i].rarity,
            image: data[i].imageUrl,
            text: data[i].text,
            flavor: data[i].flavor,
            deckId: deckID,
        };
        console.log(newCard);
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(newCard),
        };
        await fetch(deckUrl, configObj);
        await sleep(3);
    }
}

/**
 * Sleeps for the amount of ms specified
 * @param {number} ms
 * @returns {promise} When the program is finished
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
