let main = document.getElementById('main')
let pokemons = []
let page = 1
let offset = 0
let limit = 6
let prevLink = document.getElementById('prev')
let nextLink = document.getElementById('next')

String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.substr(1); }

function fetchApi(url) {
    return fetch(`https://pokeapi.co/api${url}?limit=${limit}&offset=${offset}`)
        .then((res) => res.json())
}

function getSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
}

prevLink.addEventListener('click', (event) => {
    if (offset > 0) {
        page = page - 1
        offset = page * limit
        fetchPokemon()
    }
})
nextLink.addEventListener('click', (event) => {
    offset = page * limit
    page = page + 1
    fetchPokemon()
})

fetchPokemon()

function fetchPokemon() {

    main.innerHTML = ''

    fetchApi(`/v2/pokemon`)
        .then((data) => {
            pokemons = data.results
        })
        .then(() => {

            pokemons.forEach((pokemon, index) => {

                fetchApi(`/v2/pokemon/${pokemon.name}`)
                    .then((detail) => {

                        let card = document.createElement('div')
                        card.className = 'card'

                        let avatar = document.createElement('div')
                        avatar.className = 'avatar'
                        avatar.style.backgroundImage = `url(${getSpriteUrl(detail.id)})`

                        card.appendChild(avatar)

                        let info = document.createElement('div')
                        info.className = 'info'

                        card.appendChild(info)

                        let types = document.createElement('div')
                        types.className = 'types'

                        info.appendChild(types)

                        detail.types.forEach((t) => {
                            let badge = document.createElement('span')
                            badge.classList = `badge badge-${t.type.name}`
                            badge.innerText = t.type.name
                            types.appendChild(badge)
                        })

                        let name = document.createElement('div')
                        name.className = 'name'
                        name.innerText = pokemon.name.capitalize()

                        info.appendChild(name)
                        main.appendChild(card)
                    })

            })

        })
}

