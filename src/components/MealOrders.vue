<script setup>
defineProps({
  mealinfo: Object,
})

function toPrint(orders) {
  return orders.map(order => ({
    title: order.by,
    subtitle: `${order.ordername} - ${order.price}`,
    id: order._id,
  }))
}
</script>

<template>
  <!-- <v-list density="compact" :items="toPrint(mealinfo.orders)"></v-list> -->
  <v-list>
    <v-list-item
      v-for="item in toPrint(mealinfo.orders)"
      :lines="item.subtitle.length > 25 ? 'two' : 'one'"
      :key="item.id"
      :title="item.title"
      :subtitle="item.subtitle"
      style="padding: 4px 16px;"
    >
      <template #append>
        <v-btn density="compact" variant="text" icon="mdi-trash-can-outline" />
      </template>
    </v-list-item>
  </v-list>
</template>
