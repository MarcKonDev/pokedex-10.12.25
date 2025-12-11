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
    
    for (let i = 0; i < data.results.length; i++) {                     // durch die results durchiterieren    
        allPokemon.push(data.results[i]);                               // alle results mit dem Index an globales allPokemon Array übergeben
    }
}

async function getPokeDetails(index) {                                  // die Details der Pokemons abrufen
    if (!loadedPokemon[index]) {                                        // falls das Pokemon mit bestimmtem Index noch nicht in loadedPokemon ist, dann..
        const response = await fetch(allPokemon[index].url);            // Url der eizelnen Pokemon abrufen 
        const pokemonDetails = await response.json();                   // in ein json umwandeln
        loadedPokemon[index] = pokemonDetails;
    }
    console.log(loadedPokemon);
    
    return loadedPokemon[index]
}

async function renderPokemonList() {                                    
    for (let i = 0; i < allPokemon.length; i++) {                       // geht durch allPokemon array (liste aller Pokemon mit name und url) durch
        const pokemon = await getPokeDetails(i);                        // ruft getPokeDetails auf und speichert in pokemon
        renderPokeHTML(pokemon, i); 
    }
}

function renderPokeHTML(pokemon, i) {
    let html = document.getElementById('pokemon');
    html.innerHTML += templatePokeHTML(pokemon, i);
}

async function openOverlay(i) {
    currentOverlayIndex = i;
    const pokemon = loadedPokemon[i];
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d_none');
    document.body.classList.add('no-scroll');
    const evoChain = await getEvolutionChain(i);
    overlay.innerHTML = templateOverlay(pokemon, evoChain)
}

function showPrevPokemon() {
    if (currentOverlayIndex > 0) {
        openOverlay(currentOverlayIndex - 1);
    }
}

function showNextPokemon() {
    if (currentOverlayIndex < loadedPokemon.length - 1) {
        openOverlay(currentOverlayIndex + 1);
    }
}

function closeOverlay(event) {
    // Prüfen: wurde wirklich NUR der dunkle Hintergrund angeklickt?
    if (event.target.id === "overlay") {
        document.getElementById("overlay").classList.add("d_none");
        document.body.classList.remove('no-scroll');
    }
}


function openSection(section) {
    document.getElementById('main').classList.add('d_none');
    document.getElementById('stats').classList.add('d_none');
    document.getElementById('evo').classList.add('d_none');

    document.getElementById(`${section}`).classList.remove('d_none');
}

function getAbilitiesText(pokemon) {
    let abilitiesText = "";

    for (let i = 0; i < pokemon.abilities.length; i++) {
        abilitiesText += pokemon.abilities[i].ability.name;

        if (i < pokemon.abilities.length - 1) {
            abilitiesText += ", ";
        }
    }
    return abilitiesText;
}

function getPokemonImage(pokemonName) {
    for (let i = 0; i < loadedPokemon.length; i++) {
        if (loadedPokemon[i].name === pokemonName) {
            return loadedPokemon[i].sprites.front_default; 
        }
    }
    return ""; 
}

async function getEvolutionChain(pokemonIndex) {
    const pokemon = await getPokeDetails(pokemonIndex);
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();
    const evoChainResponse = await fetch(speciesData.evolution_chain.url);
    const evoChainData = await evoChainResponse.json();

    const evoChain = [];
    await addEvolution(evoChainData.chain, evoChain);
    return evoChain;
}

async function addEvolution(node, evoChain) {
    const image = getPokemonImage(node.species.name);

    evoChain.push({
        name: node.species.name,
        image: image
    });

    if (node.evolves_to.length > 0) {
        await addEvolution(node.evolves_to[0], evoChain);
    }
}

function evoChainHTML(evoChain) {
    let html = "";
    for (let i = 0; i < evoChain.length; i++) {
        html += templateEvoPokemon(evoChain[i]);  

        if (i < evoChain.length - 1) {
            html += templateEvoArrow();
        }
    }
    return html;
}
