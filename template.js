function templatePokeHTML(pokemon, i) {
     return `<div class="poke_card" onclick="openOverlay(${i})">
                <h1>#${pokemon.id} ${pokemon.name}</h1>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}">
            </div>
            `
}

function renderOverlay(pokemon){
    return `<div class="overlay_card">
                <h1>#${pokemon.id} ${pokemon.name}</h1>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="">
                <div>
                    <button>main</button>
                    <button>stats</button>
                    <button>evo chain</button>
                </div>
                <div class="main">
                    <span>${pokemon.height}</span>
                </div>
                <div class="stats">
                    <span>hp: ${pokemon.stats[0].stat.name}</span>
                    <span>attack: ${pokemon.stats[1].stat.name}</span>
                    <span>defense: ${pokemon.stats[2].stat.name}</span>
                    <span>special-attack: ${pokemon.stats[3].stat.name}</span>
                    <span>special-deffense: ${pokemon.stats[4].stat.name}</span>
                    <span>speed: ${pokemon.stats[5].stat.name}</span>
                </div>
                <div class="evo_chain">
                    <span></span>
                </div>
            </div>`
}