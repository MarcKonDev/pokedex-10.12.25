let limit = 20;
let offset = 0;
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?";

let allPokemon = [];
let loadedPokemon = [];

async function init() {
    await getAllPoke();
    await renderPokemonList();
}

async function getAllPoke() {
    const response = await fetch(BASE_URL + `limit=${limit}&offset=${offset}`);      // base url abgerufen
    const data = await response.json();                                 // base url in ein json umwandeln
    console.log(data);
    
    for (let i = 0; i < data.results.length; i++) {                     // durch die results durchiterieren    
        allPokemon.push(data.results[i]);                               // alle results mit dem Index an globales allPokemon Array übergeben
    }
}

async function getPokeDetails(index) {                                  // die Details der Pokemons abrufen
    if (!loadedPokemon[index]) {                                        // falls das Pokemon mit bestimmtem Index noch nicht in loadedPokemon ist, dann..
        const response = await fetch(allPokemon[index].url);            // Url der eizelnen Pokemon abrufen 
        const pokemonDetails = await response.json();                   // in ein json umwandeln
        loadedPokemon[index] = pokemonDetails;
        console.log(pokemonDetails);
    }

    return loadedPokemon[index]
}

async function renderPokemonList() {                                    
    for (let i = 0; i < allPokemon.length; i++) {                       // geht durch allPokemon array (liste aller Pokemon mit name und url) durch
        const pokemon = await getPokeDetails(i);                        // ruft getPokeDetails auf und speichert in pokemon
        renderPokeHTML(pokemon); 
    }
}

function renderPokeHTML(pokemon) {
    let html = document.getElementById('pokemon');
    html.innerHTML += templatePokeHTML(pokemon);
}
