function templatePokeHTML(pokemon, i) {
    return `
        <div class="poke_card" onclick="openOverlay(${i})"
             style="background: ${getTypeColor(pokemon)};">
            <div class="card_head"><h2>#${pokemon.id} ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2></div>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}">
            
            <div class="type_container">
                ${getTypeIcons(pokemon)}
            </div>
        </div>
    `;
}

function templateOverlay(pokemon, evoChain){
    return `
            <div class="overlay_card">
                <div class="card_head"><h2>#${pokemon.id} ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2></div>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="">
                <div class="type_container">
    ${getTypeIcons(pokemon)}
</div>
                <div class="overlay_buttons">
                    <button onclick="openSection('main')">main</button>
                    <button onclick="openSection('stats')">stats</button>
                    <button onclick="openSection('evo')">evo chain</button>
                </div>
                <div class="main" id="main">
                    <span>Heigt: ${pokemon.height}</span><br>
                    <span>Weight: ${pokemon.weight}</span><br>
                    <span>Base experience: ${pokemon.base_experience}</span><br>
                    <span>Abilities: ${getAbilitiesText(pokemon)}</span>
                </div>
                <div class="stats d_none" id="stats">
                ${createStatBar("HP", pokemon.stats[0].base_stat)}
                ${createStatBar("Attack", pokemon.stats[1].base_stat)}
                ${createStatBar("Defense", pokemon.stats[2].base_stat)}
                ${createStatBar("Sp. Atk", pokemon.stats[3].base_stat)}
                ${createStatBar("Sp. Def", pokemon.stats[4].base_stat)}
                ${createStatBar("Speed", pokemon.stats[5].base_stat)}
            </div>
                <div class="evo_chain d_none" id="evo">
                    ${evoChainHTML(evoChain)}
                </div>
                <div class="overlay_arrow_container">
                    <span class="overlay_arrow left" onclick="showPrevPokemon()">❮</span>
                    <span class="overlay_arrow right" onclick="showNextPokemon()">❯</span>
                </div>
            </div>
            `
}

function templateEvoPokemon(pokemon) {
    return `
        <div class="evo_pokemon">
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <p>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</p>
        </div>
    `;
}

function templateEvoArrow() {
    return `<div class="evo_arrow">→</div>`;
}

function templateSearch(){
    return `
            <div class="no_results">
                <h2>No Pokémon found!</h2>
                <p>Perhaps there is a typo?</p>
            </div>
        `;
}

function loadingError(){
    return `
            <div class="no_results">
                <h2>Error loading!</h2>
                <p>Please try again later.</p>
            </div>
        `;
}

function statBarTemplate(statName, statValue, percentage) {
    return `
        <div class="stat_row">
            <span class="stat_name">${statName}</span>
            <div class="stat_bar_container">
                <div class="stat_bar" style="width:${percentage}%;"></div>
            </div>
        </div>
    `;
}