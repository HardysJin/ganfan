<script>

</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="globalStore().bill_table"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>🧾 账单</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="globalStore().bill_table = null"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-table v-if="globalStore().bill_table" density="compact">
          <thead>
            <tr>
              <th class="text-left" />
              <th class="text-left">
                Total$
              </th>
              <th
                v-for="meal_id in globalStore().checked_meals"
                :key="meal_id"
                class="text-left"
                style="min-width:70px"
              >
                {{ globalStore().mealinfos.find(info => info._id === meal_id).restaurant }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>服务费</td>
              <td />
              <td
                v-for="meal_id in globalStore().checked_meals"
                :key="meal_id"
                class="text-left"
              >
                {{ globalStore().bill_table[meal_id].service }}
              </td>
            </tr>

            <tr
              v-for="(total, user) in globalStore().bill_table.total"
              :key="user"
            >
              <td>{{ user }}</td>
              <td>{{ total }}</td>
              <td
                v-for="meal_id in globalStore().checked_meals"
                :key="meal_id"
                class="text-left"
              >
                {{ globalStore().bill_table[meal_id][user] }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!-- <style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform .2s ease-in-out;
}
</style> -->
