import { flushPromises } from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import confetti from 'canvas-confetti';

import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { withSetup } from '../../../utils/with-setup';
import { GameStatus } from '@/modules/pokemon/interfaces';
import { pokemonApi } from '@/modules/pokemon/api/pokemonApi';
import { pokemonListFake } from '../../../data/fake-pokemons';

const mockPockemonApi = new MockAdapter(pokemonApi);

mockPockemonApi.onGet('/?limit=151').reply(200, {
  results: pokemonListFake,
});

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('usePokemonGame', () => {
  test('should initialize with the correct default values', async () => {
    const [results, app] = withSetup(usePokemonGame);

    // console.log(results); // results contiene todo lo que retorna el composable usePokemonGame
    // Valores iniciales esperados de las propiedades retornadas por la funcion o composable usePokemonGame
    expect(results.gameStatus.value).toBe(GameStatus.Playing);
    expect(results.isLoading.value).toBe(true);
    expect(results.pokemonOptions.value).toEqual([]);
    // expect(results.randomPokemon.value).not.toBeDefined();
    expect(results.randomPokemon.value).toBe(undefined); // en javascript undefined es un tipo de dato primitivo

    // await new Promise((r) => setTimeout(r, 1000)); // Para asegurar que la peticion http (que axios hace y que es una promesa dicha peticion) contenida en promesa getPokemons alcance a terminar (SOLO PONER ESTO SI NO SE HACE EL MOCK DE pokemonApi)
    await flushPromises(); // Para asegurar que la promesa que esta como argumento en funcion onMounted termine

    // Valores actualizados despues de ejecutarse el callback o funcion de onMounted (que se activa despues de llamarse app.mount() para montar el componente raiz app de vue y cuando dicho componente raiz se termina de montar) de las propiedades retornadas por la funcion o composable usePokemonGame
    expect(results.isLoading.value).toBe(false);
    expect(results.pokemonOptions.value.length).toBe(4);
    expect(results.randomPokemon.value).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  test('should correctly handle setNextRound', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises(); // Para asegurar que la promesa (y sus promesas internas que DEBEN estar mockeadas) que esta como argumento en funcion onMounted termine

    results.gameStatus.value = GameStatus.Won;

    // Estimulo
    results.setNextRound(7);

    expect(results.gameStatus.value).toBe(GameStatus.Playing);
    expect(results.pokemonOptions.value).toHaveLength(7);
  });

  test('should correctly handle setNextRound and return different pokemons', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises(); // Para asegurar que la promesa (y sus promesas internas que DEBEN estar mockeadas) que esta como argumento en funcion onMounted termine

    // Estimulo
    // results.setNextRound(); // 4... No hace falta llamar setNextRound porque dentro de onMounted ya se llama un setNextRound
    // const firstRoundPokemonOptions = [...results.pokemonOptions.value];
    // results.setNextRound(); // 4
    // const secondRoundPokemonOptions = [...results.pokemonOptions.value];

    // expect(
    //   JSON.stringify(firstRoundPokemonOptions) !== JSON.stringify(secondRoundPokemonOptions),
    // ).toBe(true); // se espera que firstRoundPokemonOptions sea diferente de secondRoundPokemonOptions

    const firstOptions = [...results.pokemonOptions.value].map((p) => p.name);

    results.setNextRound(); // 4

    const secondOptions = [...results.pokemonOptions.value];

    secondOptions.forEach((pokemon) => {
      expect(firstOptions).not.toContain(pokemon.name);
    });
  });

  test('should correctly handle a incorrect answer', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();

    const { checkAnswer, gameStatus } = results;

    expect(gameStatus.value).toBe(GameStatus.Playing);

    checkAnswer(1000000000); // pokemon id 1000000000 no existe

    expect(gameStatus.value).toBe(GameStatus.Lost);
  });

  test('should correctly handle a correct answer', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();

    const { checkAnswer, gameStatus, randomPokemon } = results;

    expect(gameStatus.value).toBe(GameStatus.Playing);

    checkAnswer(randomPokemon.value.id); // pokemon id 1000000000 no existe

    expect(confetti).toHaveBeenCalled(); // Se espera que funcion confetti haya sido llamada
    expect(confetti).toHaveBeenCalledWith({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.6 },
    });
    expect(gameStatus.value).toBe(GameStatus.Won);
  });
});
