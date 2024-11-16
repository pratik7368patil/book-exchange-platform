<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "./../../helper";

const router = useRouter();
const isAuthenticated = ref(false);

onBeforeMount(() => {
  const token = getToken();
  if (!token) {
    isAuthenticated.value = false;
    router.push({ name: "login" });
  } else {
    isAuthenticated.value = true;
  }
});
</script>

<template>
  <router-view v-if="isAuthenticated" />
</template>
