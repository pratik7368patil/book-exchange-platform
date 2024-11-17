<template>
  <div>
    <NMessageProvider>
      <Navigation />
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <router-view></router-view>
      </div>
    </NMessageProvider>
  </div>
</template>
<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import Navigation from "@/components/common/Navigation.vue";
import { onMounted } from "vue";
import { useRequestsStore } from "../stores/requests";
import { useUserStore } from "../stores/user";
import { useBookmarkStore } from "@/stores/bookmarks";

const userStore = useUserStore();
const requestsStore = useRequestsStore();
const bookmarkStore = useBookmarkStore();

onMounted(async () => {
  if (userStore.user?.id) {
    await requestsStore.fetchUserRequests(userStore.user.id);
  }
  await bookmarkStore.fetchUserBookmarks();
});
</script>
