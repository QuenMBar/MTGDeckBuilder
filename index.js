let whiteMana = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/8e/W.svg/revision/latest/scale-to-width-down/12?cb=20160125094923";
let blueMana = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/9/9f/U.svg/revision/latest/scale-to-width-down/12?cb=20160121092256";
let blackMana = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/2/2f/B.svg/revision/latest/scale-to-width-down/12?cb=20160125093423";
let redMana = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/87/R.svg/revision/latest/scale-to-width-down/12?cb=20160125094913";
let greenMana = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/8/88/G.svg/revision/latest/scale-to-width-down/12?cb=20160125094907";

// TEST SEARCH FUNCTION 
/* fetch("https://api.magicthegathering.io/v1/cards?page=1&colors=blue,green")
    .then(res => res.json())
    .then(cards => cards.cards.forEach(card => showCard(card))); */

function showCard(card) {
    let table = document.getElementById("results");

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

    table.appendChild(row)
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
                result += ` <img src=${whiteMana}>`;
                break;
            case "U":
                result += ` <img src=${blueMana}>`;
                break;
            case "B":
                result += ` <img src=${blackMana}>`;
                break;
            case "R":
                result += ` <img src=${redMana}>`;
                break;
            case "G":
                result += ` <img src=${greenMana}>`;
                break;
            default:
                result += cleanCost[i];
        }
    }
    return result;
}
