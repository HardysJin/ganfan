<script>

</script>

<template>
  <v-container v-if="globalStore().mealinfos" style="padding:64px 0 0 0">
    <v-list lines="one">
      <v-list-item
        v-for="mealinfo in globalStore().mealinfos.filter(info => info.archive === false)"
        :key="mealinfo._id"
      >
        <MealCard :mealinfo="mealinfo" />
      </v-list-item>
    </v-list>
    <br>
  </v-container>
  <v-container v-else style="padding:0">
    Oh no 😢
  </v-container>
</template>
