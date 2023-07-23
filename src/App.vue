<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
</script>

<template>
  <div><img src="/ganfan_profile.png" style="width: 300px; height: 300px;" alt=""></div>
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
