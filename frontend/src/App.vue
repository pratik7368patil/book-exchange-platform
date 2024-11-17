<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NLoadingBarProvider,
} from "naive-ui";
import { useUserStore } from "@/stores/user";
import services from "@/services";
import { getToken, removeToken } from "@/helper";
import { useRouter } from "vue-router";
import { THEME_OVERRIDES } from "@/helper/constants";

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
// Function to handle authentication redirects
const handleAuthRedirect = () => {
  const currentRoute = router.currentRoute.value;
  const publicRoutes = ["login", "register"];

  if (!publicRoutes.includes(currentRoute.name as string)) {
    router.push({ name: "login" });
  }
};

// Function to handle authentication failure
const handleAuthFailure = () => {
  userStore.clearUser();
  removeToken();
  handleAuthRedirect();
};

onMounted(async () => {
  try {
    loading.value = true;
    const token = getToken();
    if (token) {
      const loginService = services.LoginService();
      if (!loginService) throw new Error("Login service not initialized");

      const response: any = await loginService.verifyToken();
      if (response?.data?.user) {
        userStore.setUser(response.data.user);
      } else {
        // No user data in response
        throw new Error("No user data found");
      }
    } else {
      // No token found
      handleAuthRedirect();
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    handleAuthFailure();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <n-config-provider :theme-overrides="THEME_OVERRIDES">
    <n-message-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <router-view v-if="!loading"></router-view>
          <div v-else>Loading...</div>
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
