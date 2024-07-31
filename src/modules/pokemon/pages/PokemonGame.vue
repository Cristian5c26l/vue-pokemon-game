<template>
  <section
    v-if="isLoading || randomPokemon.id === null"
    class="w-screen h-screen flex flex-col justify-center items-center"
  >
    <h1 class="text-3xl">Espere por favor</h1>
    <h3 class="animate-pulse">Cargando Pokemons</h3>
  </section>

  <section v-else class="w-screen h-screen flex flex-col justify-center items-center">
    <h1 class="m-5">¿Quién es este Pokémon?</h1>
    <!-- <h3 class="capitalize">{{ gameStatus }}</h3> -->
    <div class="h-20">
      <button
        v-if="gameStatus != GameStatus.Playing"
        @click="setNextRound()"
        class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition-all"
      >
        Nuevo juego
      </button>
    </div>
    <!--Pokemon Picture-->
    <PokemonPicture
      :pokemon-id="randomPokemon.id"
      :show-pokemon="gameStatus !== GameStatus.Playing"
    />
    <!--Pokemon Options-->
    <PokemonOptions
      :options="options"
      :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon.id"
      @selected-option="onSelectedOption"
    />
  </section>
</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { GameStatus } from '../interfaces';

const {
  gameStatus,
  isLoading,
  pokemonOptions: options,
  randomPokemon,
  checkAnswer,
  setNextRound,
} = usePokemonGame();

const onSelectedOption = (value: number) => {
  checkAnswer(value);
};
</script>

<!-- <style scoped>
button {
  @apply bg-green-500 text-white shadow-md rounded-lg p-3 m-2 cursor-pointer w-40 text-center transition-all hover:bg-gray-100 hover:text-black;
}
</style> -->
