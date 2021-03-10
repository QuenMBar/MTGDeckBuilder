
let deckTab = document.getElementById("deck-tab")
deckTab.addEventListener('click', displayDeckTab)

let mainTab = document.getElementById("search-tab")
mainTab.addEventListener('click', displayMainTab)

function displayDeckTab(){
    let defaultTab = document.getElementById("main-tab")
    let deckDiv = document.getElementById("deck-div")
    // console.log(defaultTab.style.display)
    if (defaultTab.style.display == ""){
        defaultTab.style.display = "none"
        deckDiv.style.display = "block"
    } else if (defaultTab.style.display == "block"){
        defaultTab.style.display = "none"
        deckDiv.style.display = "block"
    }
}

function displayMainTab(){
    let defaultTab = document.getElementById("main-tab")
    let deckDiv = document.getElementById("deck-div")
    if (deckDiv.style.display == "block"){
        defaultTab.style.display = "block"
        deckDiv.style.display = "none"
        console.log("hi")
    }
}