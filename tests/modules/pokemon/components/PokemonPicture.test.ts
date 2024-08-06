import PokemonPicture from '@/modules/pokemon/components/PokemonPicture.vue';
import { mount } from '@vue/test-utils';

describe('<PokemonPicture />', () => {
  test('should render the hidden image when showPokemon prop is false', () => {
    const pokemonId = 30;
    const showPokemon = false;

    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId,
        showPokemon,
      },
    });

    // console.log(wrapper.html()); // muestra como luce el componente PokemonPicture montado. Muestra el html que representa o se renderiza al montar el componente PokemonPicture con las props indicadas

    const imageSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

    const img = wrapper.find('img');

    // console.log(img.attributes()); // muestra { src: algo , class: algo, 'data-v': '' }... donde data-v es un atributo que pone automaticamente pone vue al montar el componente para hacer el scoped del style css. Dicho atributo de vue es un hash que es dinamico

    const attributes = img.attributes();

    // expect(img.classes()).not.toEqual(['fade-in', 'h-[200px]']);
    // expect(img.attributes('src')).toBe(imageSource);
    // expect(img.classes()).toEqual(['brightness-0', 'h-[200px]']);
    expect(attributes).toEqual(
      expect.objectContaining({
        src: imageSource,
        class: 'brightness-0 h-[200px]',
      }),
    );
  });

  test('should render the image when showPokemon prop is true', () => {
    const pokemonId = 30;
    const showPokemon = true;

    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId,
        showPokemon,
      },
    });

    // console.log(wrapper.html()); // muestra como luce el componente PokemonPicture montado. Muestra el html que representa o se renderiza al montar el componente PokemonPicture con las props indicadas

    const imageSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

    const img = wrapper.find('img');

    // console.log(img.attributes()); // muestra { src: algo , class: algo, 'data-v': '' }... donde data-v es un atributo que pone automaticamente pone vue al montar el componente para hacer el scoped del style css. Dicho atributo de vue es un hash que es dinamico

    const attributes = img.attributes();

    // expect(img.classes()).not.toEqual(['fade-in', 'h-[200px]']);
    // expect(img.attributes('src')).toBe(imageSource);
    // expect(img.classes()).toEqual(['brightness-0', 'h-[200px]']);
    expect(attributes).toEqual(
      expect.objectContaining({
        alt: 'pokemon image',
        src: imageSource,
        class: 'fade-in h-[200px]',
      }),
    ); // attributes representa Received (+). toEqual representa Expected (-).
  });
});
