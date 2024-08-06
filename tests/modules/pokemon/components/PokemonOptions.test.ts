import { mount } from '@vue/test-utils';
import PokemonOptions from '@/modules/pokemon/components/PokemonOptions.vue';

const options = [
  // Capitalizar cada name para simular que la clase capitalize de tailwind funciona y así no tener problemas. Recordar que aqui no hay css que se este aplicando pues se está en ambiente de pruebas
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
];

describe('<PokemonOptions />', () => {
  test('should render buttons with correct text', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: false,
        correctAnswer: 1,
      },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons.length).toBe(options.length);

    buttons.forEach((button, index) => {
      //   console.log(button.attributes('class'));
      expect(button.attributes('class')).toBe(
        'capitalize disabled:shadow-none disabled:bg-gray-100',
      );
      expect(button.text()).toBe(options[index].name);
    });
  });

  test('should emit selectedOption event with when a button is clicked', async () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: false,
        correctAnswer: 1,
      },
    });

    const [b1, b2, b3] = wrapper.findAll('button');

    await b1.trigger('click');
    //   expect(wrapper.emitted()).toEqual(
    //     expect.objectContaining({ selectedOption: [[options[0].id]] }),
    //   );
    await b2.trigger('click');
    await b3.trigger('click');

    // console.log(wrapper.emitted());// muestra eventos emitidos. Click es un evento (MouseEvent). selectedOption es el evento emitido por funcion $emit del lado de vue. A la derecha de selectedOption, esta un array que contiene lo que se envia cuando sucede dicho evento selectedOption
    // wrapper.emitted().selectedOption o wrapper.emitted('selectedOption') son posibles de hacer siempre y cuando wrapper.emitted() muestre selectedOption

    expect(wrapper.emitted().selectedOption).toBeTruthy(); // se espera a que evento selectedOption haya sido emitido una vez (por ejemplo un click a un boton interno del componente weapper donde al hacer click en ese boton se emita el selectedOption)

    expect(wrapper.emitted().selectedOption[0]).toEqual([options[0].id]); // Evaluar que el primer (0) evento selectedOption haya sido emitido con el valor de options[0].id (asi esta en PokemonOptions.vue)
    expect(wrapper.emitted().selectedOption[1]).toEqual([options[1].id]); // Evaluar que el segundo (1) evento selectedOption haya sido emitido con el valor de options[1].id (asi esta en PokemonOptions.vue)
    expect(wrapper.emitted().selectedOption[2]).toEqual([options[2].id]);
  });

  test('should disabled buttons when blockSelection prop is true', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: true,
        correctAnswer: 1,
      },
    });

    const buttons = wrapper.findAll('button');

    buttons.forEach((button) => {
      const attributes = Object.keys(button.attributes()); // attributes() devuelve un objeto { [key: string]: string; }, que corresponde al atributo html de button y el valor en string correspondiente a dicho atributo.
      //   console.log(attributes); // muestra [ 'data-v-87ccb939', 'class', 'disabled' ]
      expect(attributes).toContain('disabled');
    });
  });

  test('should apply correct styling to buttons based on correct/incorrect answer', () => {
    const correctAnswer = 2;
    const wrapper = mount(PokemonOptions, {
      props: {
        options,
        blockSelection: true, // colocar blockSelection en true es simular que el usuario ya eligió, seleccionó o dio click sobre un boton contenido en PokemonOptions... Asi funciona la aplicacion originalmente
        correctAnswer,
      },
    });

    const buttons = wrapper.findAll('button');

    buttons.forEach((button, index) => {
      if (options[index].id === correctAnswer) {
        // Recordar que options en PokemonOptions representa un array, donde cada objeto de él producirá un button gracias a v-for... Por esto, se interpreta que options es una representacion de buttons
        expect(button.classes()).toContain('correct');
      } else {
        expect(button.classes()).toContain('incorrect'); // toContain porque button.classes() representa un array
      }
    });
  });
});
