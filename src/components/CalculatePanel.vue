<script setup>
const show_dialog = ref(false)
const show_confirm = ref(false)

function setLabel(meal_id) {
  const meal = globalStore().mealinfos.find(info => info._id === meal_id)
  return `${meal.restaurant} - ${meal.date.toDateString()}`
}
</script>

<template>
  <v-card v-if="globalStore().mealinfos">
    <v-layout>
      <v-bottom-navigation grow :active="globalStore().checked_meals.length > 0">
        <v-btn value="calculate" @click="show_dialog = !show_dialog" color="indigo">
          <v-icon>mdi-calculator-variant</v-icon>
          结账
        </v-btn>
        
        <v-menu
          v-model="show_confirm"
          :close-on-content-click="false"
          location="top"
          transition="slide-y-reverse-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="indigo"
              v-bind="props"
              value="archive"
            >
              <v-icon>mdi-archive</v-icon>
              归档
            </v-btn>
          </template>

          <v-card>
            <v-defaults-provider>
              <v-btn
                block
                class="bg-red"
                @click="show_dialog = false"
                append-icon="mdi-check"
                size="large"
              >
                确认
              </v-btn>
            </v-defaults-provider>
          </v-card>
        </v-menu>
        <!-- <v-btn value="archive" @click="archiveCheckedMeal">
          <v-icon>mdi-archive</v-icon>
          归档
        </v-btn> -->
        <v-btn value="favorites" @click="globalStore().checked_meals = []">
          <v-icon>mdi-close-thick</v-icon>
          取消
        </v-btn>
      </v-bottom-navigation>
    </v-layout>
  </v-card>

  <v-dialog
    v-model="show_dialog"
    width="80%"
  >
    <v-card>
      <v-card-title class="text-h5">
        <v-icon icon="mdi-cash" />
        结账
      </v-card-title>
      <v-card-subtitle>
        输入总价
      </v-card-subtitle>
      <v-card-text>
        <v-list-item v-for="(meal_id, i) in globalStore().checked_meals" :key="i" :value="meal_id">
          <v-text-field
            v-model="globalStore().meals_priceRefs[meal_id]"
            :label="setLabel(meal_id)"
            required
            type="number"
            prefix="$"
          />
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="black-darken-1"
          @click="show_dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-calculator"
          @click="onClickCalculate"
        >
          Calculate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
