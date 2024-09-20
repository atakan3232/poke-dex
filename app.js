document.addEventListener('DOMContentLoaded', () => {
    const pokemonListElement = document.getElementById('pokemon-list');
    const searchBar = document.getElementById('search-bar');
    const modal = document.getElementById('pokemon-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.close');
    const modalPokemonName = document.getElementById('modal-pokemon-name');
    const modalPokemonImage = document.getElementById('modal-pokemon-image');
    const modalPokemonId = document.getElementById('modal-pokemon-id');
    const modalPokemonType = document.getElementById('modal-pokemon-type');
    const modalPokemonAbilities = document.getElementById('modal-pokemon-abilities');

    let allPokemonData = [];

    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    async function fetchAllPokemonData() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=156');
            const data = await response.json();
            const pokemonResults = data.results;

            
            const allDetailsPromises = pokemonResults.map(pokemon => fetch(pokemon.url).then(res => res.json()));

           
            allPokemonData = await Promise.all(allDetailsPromises);

            
            allPokemonData.forEach(pokemon => {
                const card = createPokemonCard(pokemon);
                pokemonListElement.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    function createPokemonCard(pokemonDetailData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.addEventListener('click', () => showModal(pokemonDetailData));

        const pokemonName = document.createElement('h4');
        pokemonName.classList.add('poke-name');
        pokemonName.textContent = pokemonDetailData.name;

        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemonDetailData.sprites.front_default;
        pokemonImage.alt = pokemonDetailData.name;

        const pokemonId = document.createElement('p');
        pokemonId.classList.add('poke-id');
        pokemonId.textContent = `#${pokemonDetailData.id.toString().padStart(3, '0')}`;

        const pokemonType = document.createElement('p');
        pokemonType.classList.add('poke-type');
        pokemonType.textContent = `Type: ${pokemonDetailData.types.map(type => type.type.name).join(', ')}`;

        card.appendChild(pokemonImage);
        card.appendChild(pokemonName);
        card.appendChild(pokemonId);
        card.appendChild(pokemonType);

        return card;
    }

    function showModal(pokemonDetailData) {
        modalPokemonName.textContent = pokemonDetailData.name;
        modalPokemonImage.src = pokemonDetailData.sprites.front_default;
        modalPokemonId.textContent = `ID: #${pokemonDetailData.id.toString().padStart(3, '0')}`;
        modalPokemonType.textContent = `Type: ${pokemonDetailData.types.map(type => type.type.name).join(', ')}`;
        modalPokemonAbilities.textContent = `Abilities: ${pokemonDetailData.abilities.map(ability => ability.ability.name).join(', ')}`;
        modal.style.display = 'block';
    }

    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        pokemonListElement.innerHTML = '';

        const filteredPokemon = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
        filteredPokemon.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            pokemonListElement.appendChild(card);
        });
    });

   
    fetchAllPokemonData();
});
