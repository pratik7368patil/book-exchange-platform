<template>
  <div>
    <NMessageProvider>
      <Navigation />
      <router-view></router-view>
    </NMessageProvider>
  </div>
</template>
<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import Navigation from "@/components/common/Navigation.vue";
</script>
