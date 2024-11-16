<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center">
    <div class="w-full max-w-md mx-auto px-4">
      <h2
        class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900"
      >
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link
          :to="{ name: 'login' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          sign in to your account
        </router-link>
      </p>

      <div class="mt-6 sm:mt-8">
        <div class="bg-white py-6 sm:py-8 px-4 shadow rounded-lg">
          <form class="space-y-5 sm:space-y-6" @submit.prevent="handleRegister">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div class="mt-1">
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading || !isPasswordMatch"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ isLoading ? "Creating account..." : "Create account" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import services from "@/services";
import { storeToken } from "@/helper";

const router = useRouter();
const userStore = useUserStore();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

const isPasswordMatch = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
  );
});

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    alert("Please fill in all fields");
    return;
  }

  try {
    isLoading.value = true;
    const loginService = services.LoginService();
    if (!loginService) throw new Error("Login service not initialized");

    const response: any = await loginService.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (response.data.token) {
      storeToken(response.data.token);
      userStore.setUser(response.data.user);
      router.push("/");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Registration failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>
