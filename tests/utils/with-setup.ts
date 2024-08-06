import { createApp } from 'vue';

export const withSetup = (composable: () => any) => {
  let result: any;

  // Crear contexto de ejecucion basado en una aplicacion de vue, es decir, crear una aplicacion de vue
  const app = createApp({
    setup() {
      result = composable();
      return () => {}; // return puede regresar lo que sea
    },
  });

  // Montar aplicacion en un div
  app.mount(document.createElement('div'));

  return [result, app] as const; // Agregado de as const para que el primer elemento del array retornado sea de tipo any y el segundo sea de tipo App<Element>
}; // app es la aplicacion de vue y result contiene el resultado del composable ejecutado en un contexto de creacion de aplicacion de vue (app es el componente raiz de vue literalmente)
