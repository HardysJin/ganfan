<script setup>
const store = globalStore()
</script>

<template>
  <v-card color="grey-lighten-2" variant="text">
    <v-layout>
      <v-app-bar color="yellow-lighten-3">
        <v-app-bar-title>
          🍜 华为干饭至上
          <span class="text-subtitle-2">
            {{ ['🍼', '🥣', '🍸', '🥢', '🍽️', '🍛', '🍲', '🌮', '🍺', '🦞', '🍤', '🦪', '🥩', '🍙', '🥯', '🌭', '🍔', '🍟', '🥙', '🍩', '🍦', '🌯', '🧀', '🥬', '🍬', '🍆', '🍊', '🥝', '🍈', '🍍', '🍒', '🍓'][Math.trunc(Math.random() * 32)] }}
            {{ store.user.isAdmin ? 'CEO' : '' }} {{ store.user.name === 'Shiyu'? store.user.name + '🥑' : store.user.name }}
          </span>
        </v-app-bar-title>

        <NewMealDialog />
      </v-app-bar>

      <MealCardList />
    </v-layout>
  </v-card>
</template>
