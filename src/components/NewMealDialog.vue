<script>
export default {
  data() {
    return {
      dialog: false,
      restaurant: '',
      url: '',
    }
  },
  methods: {
    async createMeal() {
      const store = globalStore()
      if (!store.user._id || !store.user.name) {
        alert('Who are you!')
        return
      }
      const data = {
        restaurant: this.restaurant,
        url: this.url,
        host: store.user.name,
      }
      // console.log(data)
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/meals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const result = await response.json()
        result.date = new Date(result.date)
        globalStore().mealinfos.unshift(result)
        globalStore().meals_priceRefs[result._id] = ref(result.totalFinal)
        // globalStore().mealinfos[result['_id']] = result
        // globalStore().mealinfos = Object.fromEntries(
        //   Object.entries(globalStore().mealinfos).sort((a, b) => b.date - a.date)
        // );
        // console.log("Success:", globalStore().mealinfos);
      }
      catch (error) {
        // console.error("Error:", error);
      }
      this.dialog = false
    },
  },

}
</script>

<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="95%"
    >
      <template #activator="{ props }">
        <v-btn
          color="pink-darken-1"
          v-bind="props"
        >
          🥣 开饭
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          🥣 开饭
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="restaurant"
            label="餐馆"
          />
          <v-text-field
            v-model="url"
            label="饭团url"
            type="url"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="black-darken-1"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-rice"
            type="submit"
            :disabled="restaurant === '' || url === ''"
            @click="createMeal"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
