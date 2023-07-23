<script setup>
const props = defineProps({
  mealinfo: Object,
})
const dialog = ref(false)
const ordername = ref('')
const price = ref('')
const orderBy = ref(globalStore().user.name)
const allusers = ref(null)
fetch(`${import.meta.env.VITE_BASE_URL}/api/users`)
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    allusers.value = data
  })

const toSelect = users => users.map(usr => usr.name)

async function createOrder() {
  try {
    const data = {
      order: {
        ordername: ordername.value,
        by: orderBy.value,
        price: price.value,
      },
    }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/meals/${props.mealinfo._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const meal = await response.json()
    meal.date = new Date(meal.date)
    const idx = globalStore().mealinfos.findIndex(info => info._id === props.mealinfo._id)
    globalStore().mealinfos[idx] = meal
    dialog.value = false
  }
  catch (error) {
    console.error('Error:', error)
  }
}
</script>

<template>
  <v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" prepend-icon="mdi-plus" color="green-lighten-2" rounded="lg" density="comfortable">
          加餐
        </v-btn>
      </template>
      <v-card>
        <v-card-text style="padding: 12px">
          <div style="margin-right: 15px;">
            <iframe id="my-ifram" :src="mealinfo.url" width="100%" height="400px" class="d-flex elevation-3 align-center bg-secondary justify-center" />
          </div>

          <br>
          <v-text-field
            v-model="ordername"
            label="Order"
            density="compact"
            required
          />
          <v-text-field
            v-model="price"
            label="Price"
            required
            type="number"
            density="compact"
            prefix="$"
          />
          <v-combobox
            v-model="orderBy"
            label="By"
            :items="toSelect(allusers)"
            density="compact"
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
            :disabled="ordername === '' || price === '' || orderBy === ''"
            @click="createOrder()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
