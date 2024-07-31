import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  const isLoading = computed(() => pokemons.value.length === 0);
  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length); // https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/

    return pokemonOptions.value[randomIndex];
  });

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

    // console.log(response.data.results);
    // console.log(response.data);

    const pokemonsArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts[urlParts.length - 2] ?? 0; // urlParts(at-2)
      return {
        id: +id, // https://www.geeksforgeeks.org/how-to-convert-string-to-number-in-typescript/
        name: pokemon.name,
      };
    });

    return pokemonsArray.sort(() => Math.random() - 0.5);
  };

  const setNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany); // que pokemons.value contenga todos los elementos a partir de la posicion howMany
  };

  const checkAnswer = (id: number) => {
    const hasWon = randomPokemon.value.id === id;

    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });

      return;
    }

    gameStatus.value = GameStatus.Lost;
  };

  onMounted(async () => {
    // Logica a ejecutar una vez el componente, el usa la funcion usePokemonGame(), se monta

    // await new Promise((r) => setTimeout(r, 1000)); // Retarde de 1000 milisegundos para que se alcance a apreciar el mensaje "Cargando pokemons" en PokemonGame.vue

    pokemons.value = await getPokemons();
    // console.log(pokemons);

    setNextRound();
  });

  return {
    // Reactive variables
    gameStatus, // gameStatus: gameStatus
    pokemonOptions,

    // Computed properties
    isLoading,
    randomPokemon,

    // Methods
    setNextRound,
    checkAnswer,
  };
};
