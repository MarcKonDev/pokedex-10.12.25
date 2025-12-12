let limit = 20;
let offset = 0;
let BASE_URL = "https://pokeapi.co/api/v2/pokemon?";

let allPokemon = [];
let loadedPokemon = [];

let scrollY = 0;

const TYPE_STYLES = {
    fire:     { color: "#F08030", icon: "🔥" },
    water:    { color: "#6890F0", icon: "💧" },
    grass:    { color: "#78C850", icon: "🍃" },
    electric: { color: "#F8D030", icon: "⚡" },
    ice:      { color: "#98D8D8", icon: "❄️" },
    fighting: { color: "#C03028", icon: "🥊" },
    poison:   { color: "#A040A0", icon: "☠️" },
    ground:   { color: "#E0C068", icon: "🌍" },
    flying:   { color: "#A890F0", icon: "🪽" },
    psychic:  { color: "#F85888", icon: "🔮" },
    bug:      { color: "#A8B820", icon: "🐛" },
    rock:     { color: "#B8A038", icon: "🪨" },
    ghost:    { color: "#705898", icon: "👻" },
    dragon:   { color: "#7038F8", icon: "🐉" },
    dark:     { color: "#705848", icon: "🌑" },
    steel:    { color: "#B8B8D0", icon: "⚙️" },
    fairy:    { color: "#EE99AC", icon: "🌸" },
    normal:   { color: "#A8A878", icon: "●" }
};

async function init() {
    showLoading();

    try {
        await getAllPoke();          
        await renderPokemonList();   
    } catch (error) {
        console.error("Error in init():", error);
        document.getElementById("pokemon").innerHTML = loadingError();
    } finally {
        hideLoading();               
    }
}


async function getAllPoke() {
    try {
        const response = await fetch(BASE_URL + `limit=${limit}&offset=${offset}`);
        const data = await response.json();

        for (let i = 0; i < data.results.length; i++) {
            allPokemon.push(data.results[i]);
        }
    } catch (error) {
        console.error("Error in getAllPoke():", error);
        document.getElementById("pokemon").innerHTML = loadingError();
    } 
}

async function getPokeDetails(index) {                                  
    if (!loadedPokemon[index]) {                                        
        const response = await fetch(allPokemon[index].url);             
        const pokemonDetails = await response.json();                   
        loadedPokemon[index] = pokemonDetails;
    }
    return loadedPokemon[index]
}

async function renderPokemonList() {                                    
    for (let i = 0; i < allPokemon.length; i++) {                       
        const pokemon = await getPokeDetails(i);                        
        renderPokeHTML(pokemon, i); 
    }
}

function renderPokeHTML(pokemon, i) {
    let html = document.getElementById('pokemon');
    html.innerHTML += templatePokeHTML(pokemon, i);
}

async function loadMore() {
    showLoading();

    const oldLength = allPokemon.length;
    offset += limit;
    await getAllPoke();

    for (let i = oldLength; i < allPokemon.length; i++) {
        const pokemon = await getPokeDetails(i);
        renderPokeHTML(pokemon, i);
    }

    hideLoading();
}

async function openOverlay(i) {
    currentOverlayIndex = i;
    const pokemon = loadedPokemon[i];
    let overlay = document.getElementById('overlay');

    overlay.classList.remove('d_none');

    lockScroll(); 

    const evoChain = await getEvolutionChain(i);
    overlay.innerHTML = templateOverlay(pokemon, evoChain);

    overlay.addEventListener("click", closeOverlay);
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
    if (event.target.id === "overlay") {
        document.getElementById("overlay").classList.add("d_none");
        unlockScroll();
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

function searchPokemon() {
    let searchText = document.getElementById('search').value.toLowerCase();
    let container = document.getElementById('pokemon');
    if (searchText.length < 3) {
        container.innerHTML = "";
        renderPokemonList(); 
        return;
    }

    let results = [];
    for (let i = 0; i < loadedPokemon.length; i++) {
        let name = loadedPokemon[i].name.toLowerCase();
        if (name.includes(searchText)) {
            results.push({ pokemon: loadedPokemon[i], index: i });
        }
    }

    container.innerHTML = "";
    for (let j = 0; j < results.length; j++) {
        let p = results[j].pokemon;
        let originalIndex = results[j].index;
        renderPokeHTML(p, originalIndex);
    }
}

function searchPokemon() {
    let text = document.getElementById('search').value.toLowerCase();

    if (text.length < 3) {
        document.getElementById('pokemon').innerHTML = "";
        renderPokemonList();
        showLoadMore();             
        return;
    }

    hideLoadMore();                
    renderSearchResults(text);
}

function renderSearchResults(searchText) {
    let container = document.getElementById('pokemon');
    container.innerHTML = "";

    let found = false;
    for (let i = 0; i < loadedPokemon.length; i++) {
        let name = loadedPokemon[i].name.toLowerCase();
        if (name.includes(searchText)) {
            renderPokeHTML(loadedPokemon[i], i);
            found = true;
        }
    }

    if (!found) {
        container.innerHTML = templateSearch();
    }
}

function getTypesText(pokemon) {
    let typesText = "";

    for (let i = 0; i < pokemon.types.length; i++) {
        typesText += pokemon.types[i].type.name;

        if (i < pokemon.types.length - 1) {
            typesText += ", ";
        }
    }

    return typesText;
}

function getTypeIcons(pokemon) {
    let html = "";

    for (let i = 0; i < pokemon.types.length; i++) {
        const type = pokemon.types[i].type.name;
        const style = TYPE_STYLES[type];

        html += `
            <div class="type_badge" style="background:${style.color}">
                ${style.icon}
            </div>
        `;
    }
    return html;
}

function getTypeColor(pokemon) {
    const type = pokemon.types[0].type.name; 
    return TYPE_STYLES[type].color;
}

function hideLoadMore() {
    document.getElementById('load_more_btn').style.display = "none";
}

function showLoadMore() {
    document.getElementById('load_more_btn').style.display = "block";
}

function showLoading() {
    document.getElementById("loading_spinner").classList.remove("d_none");
    document.getElementById("loading_overlay").classList.remove("d_none");
    document.body.classList.add("no-scroll");
}

function hideLoading() {
    document.getElementById("loading_spinner").classList.add("d_none");
    document.getElementById("loading_overlay").classList.add("d_none");
    document.body.classList.remove("no-scroll");
}

function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
}

function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
}
