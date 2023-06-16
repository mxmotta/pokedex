const main = document.getElementById('main')
const loading = document.getElementById('loading')
const prevLink = document.getElementById('prev')
const nextLink = document.getElementById('next')
const searchEl = document.getElementById('search')
const search_buttonEl = document.getElementById('search_button')
const resultsEl = document.getElementById('results')
const per_pageEl = document.getElementById('per_page')
const pokemon_info_dialog = document.getElementById('pokemon_info')
const pokemon_info_datailEl = document.getElementById('pokemon_info_datail')


const darkmode = document.getElementById('darkmode')
darkmode.addEventListener('click', (event) => {
    document.body.className = event.target.value
    event.target.innerText = event.target.value == 'dark' ? 'light' : 'dark'
    event.target.value = event.target.value == 'dark' ? 'light' : 'dark'
})

let pokemons = []
let pokemons_filtered = []
let page = 1
let offset = 0
let limit = 3

String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.substr(1); }

function fetchApi(url, infinite = false) {
    return fetch(`https://pokeapi.co/api${url}?limit=${infinite ? 1281 : limit}&offset=${offset}`)
        .then((res) => res.json())
}

function getSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
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

per_pageEl.addEventListener('change', (event) => {
    limit = event.target.value
    fetchPokemon()
})

// searchEl.addEventListener('keydown', (event) => {
//     if (event.code == 'Enter') {
//         searchPokemon(event.target.value)
//     }
// })
// search_buttonEl.addEventListener('click', () => {
//     if (searchEl.value.length > 0) {
//         searchPokemon(searchEl.value)
//     }
// })

searchEl.addEventListener('keyup', (event) => {
    pokemons_filtered = pokemons.filter((pokemon) => pokemon.name.includes(event.target.value))
    resultsEl.innerHTML = ''
    resultsEl.style.display = 'flex'
    pokemons_filtered.forEach((pokemon, index) => {
        if (index < 5) {
            let label = document.createElement('span')
            label.innerText = pokemon.name
            label.setAttribute('data-pokemon', pokemon.name)
            resultsEl.appendChild(label)

            label.addEventListener('click', (event) => {
                searchPokemon(event.target.dataset.pokemon)
                clearSearch()
            })
        }
    })
    if (event.target.value.length == 0) {
        clearSearch()
    }
})

function clearSearch() {
    resultsEl.innerHTML = ''
    resultsEl.style.display = 'none'
    pokemons_filtered = []
}

fetchPokemon()
fetchApi(`/v2/pokemon`, true)
    .then((data) => {
        pokemons = data.results
    })

function fetchPokemon() {
    main.style.display = 'none'
    loading.style.display = 'flex'
    main.innerHTML = ''
    fetchApi(`/v2/pokemon`)
        .then((data) => {
            renderPokemons(data.results)
        })
}

function searchPokemon(name) {
    main.innerHTML = ''
    fetchApi(`/v2/pokemon/${name}`)
        .then((data) => {
            renderPokemons([data])
        })
        .catch(err => {
            alert('Pokemon não localizado')
        })
}

function renderPokemons(pokemons = []) {
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

                avatar.addEventListener('click', (event) => {
                    pokemon_info_dialog.showModal()

                    pokemon_info_datailEl.innerText = ''

                    let pokemon_name = document.createElement('span')
                    pokemon_name.innerText = pokemon.name.capitalize()
                    pokemon_info_datailEl.append(pokemon_name)
                })
            })
            .then(() => {
                main.style.display = 'grid'
                loading.style.display = 'none'
            })

    })
}

