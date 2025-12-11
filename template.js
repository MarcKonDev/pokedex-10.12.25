function templatePokeHTML(pokemon, i) {
     return `<div class="poke_card" onclick="openOverlay(${i})">
                <h1>#${pokemon.id} ${pokemon.name}</h1>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}">
                <p class="poke_types">${getTypesText(pokemon)}</p>
            </div>
            `
}

function templateOverlay(pokemon, evoChain){
    return `
            <div class="overlay_card">
                <div class="overlay_arrow left" onclick="showPrevPokemon()">❮</div>
                <h1>#${pokemon.id} ${pokemon.name}</h1>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="">
                <span>${getTypesText(pokemon)}</span>
                <div class="overlay_buttons">
                    <button onclick="openSection('main')">main</button>
                    <button onclick="openSection('stats')">stats</button>
                    <button onclick="openSection('evo')">evo chain</button>
                </div>
                <div class="main" id="main">
                    <span>heigt: ${pokemon.height}</span><br>
                    <span>weight: ${pokemon.weight}</span><br>
                    <span>base experience: ${pokemon.base_experience}</span><br>
                    <span>abilities: ${getAbilitiesText(pokemon)}</span>
                </div>
                <div class="stats d_none" id="stats">
                    <span>hp: ${pokemon.stats[0].base_stat}</span><br>
                    <span>attack: ${pokemon.stats[1].base_stat}</span><br>
                    <span>defense: ${pokemon.stats[2].base_stat}</span><br>
                    <span>special-attack: ${pokemon.stats[3].base_stat}</span><br>
                    <span>special-deffense: ${pokemon.stats[4].base_stat}</span><br>
                    <span>speed: ${pokemon.stats[5].base_stat}</span>
                </div>
                <div class="evo_chain d_none" id="evo">
                    ${evoChainHTML(evoChain)}
                </div>
                <div class="overlay_arrow right" onclick="showNextPokemon()">❯</div>
            </div>
            `
}

function templateEvoPokemon(pokemon) {
    return `
        <div class="evo_pokemon">
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
        </div>
    `;
}

function templateEvoArrow() {
    return `<div class="evo_arrow">→</div>`;
}
