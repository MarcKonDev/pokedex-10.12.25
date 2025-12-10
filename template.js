function templatePokeHTML(pokemon) {
     return `<h1>#${pokemon.id} ${pokemon.name}</h1>
            <img src="${pokemon.sprites.other['official-artwork'].front_default}">
            `
}