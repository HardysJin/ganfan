<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
</script>

<template>
  <Main />

  <FakeLogin />
  <CalculatePanel />
  <BillTable />

  <!-- <RouterView /> -->
  <!-- <README />
  <TheCounter />
  <TheInput />
  <TheFooter /> -->
</template>

<style>
html,body{
    -webkit-overflow-scrolling : touch !important;
    overflow: auto !important;
    height: 100% !important;
}
</style>