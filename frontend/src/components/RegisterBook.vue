<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2
          class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900"
        >
          Register a New Book
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Add your book to the exchange platform
        </p>

        <div class="mt-6 sm:mt-8">
          <form
            class="space-y-5 sm:space-y-6"
            @submit.prevent="handleRegisterBook"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Book Title
              </label>
              <div class="mt-1">
                <NInput
                  v-model:value="bookData.title"
                  type="text"
                  placeholder="Enter book title"
                  required
                  :theme-overrides="inputThemeOverrides"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Author
              </label>
              <div class="mt-1">
                <NInput
                  v-model:value="bookData.author"
                  type="text"
                  placeholder="Enter author name"
                  required
                  :theme-overrides="inputThemeOverrides"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <div class="mt-1">
                <NSelect
                  v-model:value="bookData.genre"
                  :options="genreOptions"
                  placeholder="Select genre"
                  required
                  :theme-overrides="selectThemeOverrides"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <div class="mt-1">
                <NSelect
                  v-model:value="bookData.condition"
                  :options="conditionOptions"
                  placeholder="Select book condition"
                  required
                  :theme-overrides="selectThemeOverrides"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Availability Status
              </label>
              <div class="mt-1">
                <NSelect
                  v-model:value="bookData.status"
                  :options="statusOptions"
                  placeholder="Select availability status"
                  required
                  :theme-overrides="selectThemeOverrides"
                />
              </div>
            </div>

            <div class="mt-6">
              <NButton
                type="primary"
                block
                attr-type="submit"
                :loading="isLoading"
                :disabled="!isFormValid"
                class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                :theme-overrides="{
                  textColor: 'white',
                  color: '#4F46E5',
                  colorHover: '#4338CA',
                  colorPressed: '#3730A3',
                  colorFocus: '#4F46E5',
                  colorDisabled: '#818CF8',
                  textColorDisabled: 'white',
                  borderFocus: '#4F46E5',
                  rippleColor: 'rgba(79, 70, 229, 0.2)',
                }"
              >
                {{ isLoading ? "Registering..." : "Register Book" }}
              </NButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { NInput, NSelect, NButton } from "naive-ui";
import {
  genreOptions,
  conditionOptions,
  statusOptions,
  inputThemeOverrides,
  selectThemeOverrides,
} from "../helper/constants";

interface BookData {
  title: string;
  author: string;
  genre: string;
  condition: string;
  status: string;
}

const isLoading = ref(false);
const bookData = ref<BookData>({
  title: "",
  author: "",
  genre: "",
  condition: "",
  status: "",
});

const isFormValid = computed(() => {
  return (
    bookData.value.title &&
    bookData.value.author &&
    bookData.value.genre &&
    bookData.value.condition &&
    bookData.value.status
  );
});

async function handleRegisterBook() {
  if (!isFormValid.value) return;
  
  isLoading.value = true;
  try {
    // Your API call logic here
    console.log("Registering book:", bookData.value);
  } catch (error) {
    console.error("Error registering book:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
