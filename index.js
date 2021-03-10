document.addEventListener("submit", (e) => {
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
    let url = parseURL(
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
    // console.log(url);
    fetch(url)
        .then((data) => data.json())
        .then((data) => {
            console.log(data);
        });
});

/**
 *
 * @param {string} name
 * @param {array} color
 * @param {string} orAnd
 * @param {string} manaCost
 * @param {string} type
 * @param {string} power
 * @param {string} toughness
 * @param {string} set
 * @param {string} rarity
 * @param {string} page
 */
function parseURL(name, color, orAnd, manaCost, type, power, toughness, set, rarity, page = 1) {
    // console.log(`${name}, ${color}, ${orAnd}, ${manaCost}, ${type}, ${power}, ${toughness}, ${set}, ${rarity}`);
    let baseURL = `https://api.magicthegathering.io/v1/cards?page=${page}`;
    if (name != "") {
        baseURL += `&name=${name}`;
    }
    if (color.length != 0) {
        baseURL += `&colors=${color[0]}`;
        let punctuation = "|";
        if (orAnd === "and") {
            punctuation = ",";
        }

        for (let i = 1; i < color.length; i++) {
            baseURL += `${punctuation}${color[i]}`;
        }
    }
    if (manaCost != "") {
        baseURL += `&cmc=${manaCost}`;
    }
    if (type != "") {
        baseURL += `&type=${type}`;
    }
    if (power != "") {
        baseURL += `&power=${power}`;
    }
    if (toughness != "") {
        baseURL += `&toughness=${toughness}`;
    }
    if (set != "") {
        baseURL += `&set=${set}`;
    }
    if (rarity != "") {
        baseURL += `&rarity=${rarity}`;
    }
    return baseURL;
}
