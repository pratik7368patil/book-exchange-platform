<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center">
    <div class="w-full max-w-md mx-auto px-4">
      <h2
        class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900"
      >
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link
          :to="{ name: 'register' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          create a new account
        </router-link>
      </p>

      <div class="mt-6 sm:mt-8">
        <div class="bg-white py-6 sm:py-8 px-4 shadow rounded-lg">
          <form class="space-y-5 sm:space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="submit"
                :disabled="isLoading || !email || !password"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ isLoading ? "Signing in..." : "Sign in" }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="mt-6 text-center">
        <NText>Don't have an account? </NText>
        <router-link
          to="/register"
          class="text-indigo-600 hover:text-indigo-500"
        >
          Register here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import services from "@/services";
import { storeToken, getToken } from "@/helper";
import { NText } from "naive-ui";

const router = useRouter();
const userStore = useUserStore();
const email = ref("");
const password = ref("");
const isLoading = ref(false);

onMounted(async () => {
  try {
    const token = getToken();
    if (token) {
      isLoading.value = true;
      const loginService = services.LoginService();
      if (!loginService) throw new Error("Login service not initialized");

      const response: any = await loginService.verifyToken();
      if (response?.data?.user) {
        userStore.setUser(response.data.user);
        router.push("/");
      }
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    // Invalid token, clear it
    userStore.clearUser();
  } finally {
    isLoading.value = false;
  }
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Please fill in all fields");
    return;
  }

  try {
    isLoading.value = true;
    const loginService = services.LoginService();
    if (!loginService) throw new Error("Login service not initialized");

    const response: any = await loginService.login({
      email: email.value,
      password: password.value,
    });

    if (response.data.token) {
      storeToken(response.data.token);
      userStore.setUser(response.data.user);
      router.push("/");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  } finally {
    isLoading.value = false;
  }
};
</script>
