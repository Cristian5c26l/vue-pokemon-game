import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { GameStatus } from '@/modules/pokemon/interfaces';
import PokemonGame from '@/modules/pokemon/pages/PokemonGame.vue';
import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';

vi.mock('@/modules/pokemon/composables/usePokemonGame', () => ({
  usePokemonGame: vi.fn(),
}));

const pokemonOptions = [
  {
    name: 'bulbasaur',
    id: 1,
  },
  {
    name: 'ivysaur',
    id: 2,
  },
  {
    name: 'venusaur',
    id: 3,
  },
  {
    name: 'charmander',
    id: 4,
  },
];

describe('<PokemonGame />', () => {
  test('should initialize with default values', async () => {
    (usePokemonGame as Mock).mockReturnValue({
      // Reactive variables
      gameStatus: GameStatus.Playing, // gameStatus: gameStatus
      pokemonOptions: [],

      // Computed properties
      isLoading: true,
      randomPokemon: { id: null },

      // Methods
      setNextRound: vi.fn(),
      checkAnswer: vi.fn(),
    });

    const wrapper = mount(PokemonGame);

    // console.log(wrapper.html());

    expect(wrapper.get('h1').text()).toBe('Espere por favor');
    expect(wrapper.get('h1').classes()).toEqual(['text-3xl']);
    expect(wrapper.get('h3').text()).toBe('Cargando Pokemons');
    expect(wrapper.get('h3').classes()).toEqual(['animate-pulse']);
  });

  test('should render <PokemonPicture /> and <PokemonOptions />', () => {
    (usePokemonGame as Mock).mockReturnValue({
      // Reactive variables
      gameStatus: GameStatus.Playing, // gameStatus: gameStatus
      pokemonOptions,

      // Computed properties
      isLoading: false,
      randomPokemon: pokemonOptions.at(0), // randomPokemon: {id: 1, name: 'bulbasaur', }

      // Methods
      setNextRound: vi.fn(),
      checkAnswer: vi.fn(),
    });

    const wrapper = mount(PokemonGame);

    // console.log(wrapper.html());

    const buttons = wrapper.findAll('.capitalize.disabled\\:shadow-none.disabled\\:bg-gray-100');
    const pokemons = pokemonOptions.map((p) => p.name);

    // PokemonPicture
    expect(wrapper.find('img').attributes('src')).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonOptions.at(0)!.id}.svg`,
    );

    // PokemonOptions
    expect(buttons).length(4);

    buttons.forEach((button) => {
      expect(pokemons).toContain(button.text()); // se espera que array de pokemons contenga el texto del button actual
    });
  });

  test('should render button for a new game', () => {
    (usePokemonGame as Mock).mockReturnValue({
      // Reactive variables
      gameStatus: GameStatus.Won, // Si gameStatus vale GameStatus.Won, se renderiza el button de "Nuevo juego"
      pokemonOptions,

      // Computed properties
      isLoading: false,
      randomPokemon: pokemonOptions.at(0), // randomPokemon: {id: 1, name: 'bulbasaur', }

      // Methods
      setNextRound: vi.fn(),
      checkAnswer: vi.fn(),
    });

    const wrapper = mount(PokemonGame);

    // console.log(wrapper.html());

    const button = wrapper.find('[data-test-id="btn-new-game"]');

    expect(button.text()).toBe('Nuevo juego');
  });

  test('should call the setNextRound function when the New game button is clicked', async () => {
    const spySetNextRoundFn = vi.fn();
    (usePokemonGame as Mock).mockReturnValue({
      // Reactive variables
      gameStatus: GameStatus.Won, // Si gameStatus vale GameStatus.Won, se renderiza el button de "Nuevo juego"
      pokemonOptions,

      // Computed properties
      isLoading: false,
      randomPokemon: pokemonOptions.at(0), // randomPokemon: {id: 1, name: 'bulbasaur', }

      // Methods
      setNextRound: spySetNextRoundFn,
      checkAnswer: vi.fn(),
    });

    const wrapper = mount(PokemonGame);

    // console.log(wrapper.html());

    const button = wrapper.find('[data-test-id="btn-new-game"]');

    await button.trigger('click');

    expect(spySetNextRoundFn).toHaveBeenCalled();
    expect(spySetNextRoundFn).toHaveBeenCalledOnce();
    expect(spySetNextRoundFn).toHaveBeenCalledTimes(1);
    expect(spySetNextRoundFn).not.toHaveBeenCalledTimes(2);
    expect(spySetNextRoundFn).toHaveBeenCalledWith(); // se espera que funcion setNextRound haya sido llamada con ningun argumento
  });
});
