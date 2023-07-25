<script setup>
const props = defineProps({
  mealinfo: Object,
})

const show = ref(false)

function isToday(someDate) {
  const today = new Date()
  return someDate.getDate() === today.getDate()
    && someDate.getMonth() === today.getMonth()
    && someDate.getFullYear() === today.getFullYear()
}
</script>

<template>
  <v-card
    class="mx-auto"
    :elevation="2"
    max-width="95%"
    :color="isToday(mealinfo.date) ? 'light-green-lighten-5' : ''"
  >
    <v-toolbar
      density="compact"
      color="rgba(0, 0, 0, 0)"
    >
      <template #prepend>
        <v-checkbox-btn
          v-model="globalStore().checked_meals"
          :value="mealinfo._id"
        />
      </template>

      <v-toolbar-title class="text-h6" style="margin-inline-start:0">
        {{ mealinfo.restaurant }}
      </v-toolbar-title>

      <template #append>
        <NewOrderDialog :mealinfo="mealinfo" />
      </template>
    </v-toolbar>

    <v-card-actions size="small" @click="show = !show">
      <v-card-subtitle>
        {{ mealinfo.host }} <hr> {{ mealinfo.date.toDateString() }}
      </v-card-subtitle>

      <v-spacer />
      <v-icon style="margin-right: 10px;"> {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }} </v-icon>
    </v-card-actions>
    <v-expand-transition>
      <v-card v-show="show" color="grey-lighten-4">
        <v-divider :thickness="2" />
        <MealOrders :mealinfo="mealinfo" />
      </v-card>
    </v-expand-transition>
  </v-card>
  <br>
</template>
