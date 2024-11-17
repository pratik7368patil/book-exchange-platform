<template>
  <div class="max-w-2xl mx-auto p-4">
    <div class="mb-8 space-y-2">
      <n-button
        text
        type="primary"
        @click="router.push('/')"
        class="flex items-center gap-1 -ml-2 text-gray-600 hover:text-primary"
      >
        <template #icon>
          <n-icon :component="ArrowLeftIcon" class="h-4 w-4" />
        </template>
        Back to Books
      </n-button>
      <h1 class="text-2xl font-bold text-gray-900">Register a New Book</h1>
      <p class="text-sm text-gray-600">
        Fill in the details of the book you'd like to share or exchange.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <BookForm
        :is-loading="isLoading"
        submit-button-text="Register Book"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { NButton, NIcon } from "naive-ui";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { BooksServiceInstance } from "@/services";
import { useUserStore } from "@/stores/user";
import BookForm from "./common/BookForm.vue";

const router = useRouter();
const message = useMessage();
const userStore = useUserStore();
const isLoading = ref(false);

const handleSubmit = async (data: any) => {
  if (!userStore.user) {
    message.error("You must be logged in to register a book");
    router.push("/login");
    return;
  }

  try {
    isLoading.value = true;
    await BooksServiceInstance?.registerBook(data);
    message.success("Book registered successfully");
    router.push("/");
  } catch (error) {
    console.error("Error registering book:", error);
    message.error("Failed to register book");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.upload-trigger {
  display: flex;
  justify-content: center;
  width: 100%;
}

.upload-trigger :deep(.n-upload-trigger) {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
