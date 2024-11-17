<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back Button -->
    <div class="mb-4">
      <n-button
        text
        type="primary"
        @click="router.push('/')"
        size="small"
        class="flex items-center gap-1 -ml-2 text-gray-600 hover:text-primary"
      >
        <template #icon>
          <n-icon :component="ArrowLeftIcon" class="h-4 w-4" />
        </template>
        Back to Books
      </n-button>
    </div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isCurrentUser ? "My Books" : `${books[0]?.owner}'s Books` }}
      </h1>
      <n-button
        v-if="isCurrentUser"
        type="primary"
        @click="$router.push('/register-book')"
      >
        Add New Book
      </n-button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <n-alert
      v-if="error"
      type="error"
      class="mb-4"
      :show-icon="true"
      :title="error"
    />

    <!-- Books Grid -->
    <div
      v-if="!loading && books.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <BookCard v-for="book in books" :key="book.id" :book="book">
        <template #actions>
          <div class="flex gap-2">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  v-if="isCurrentUser"
                  size="small"
                  type="info"
                  @click="handleEditBook(book)"
                  ghost
                  circle
                >
                  <template #icon>
                    <PencilIcon class="h-4 w-4" />
                  </template>
                </n-button>
              </template>
              Edit Book
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  v-if="isCurrentUser"
                  size="small"
                  type="error"
                  @click="handleDeleteBook(book)"
                  ghost
                  circle
                >
                  <template #icon>
                    <TrashIcon class="h-4 w-4" />
                  </template>
                </n-button>
              </template>
              Delete Book
            </n-tooltip>
          </div>
        </template>
      </BookCard>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && books.length === 0"
      class="text-center py-12 bg-gray-50 rounded-lg"
    >
      <n-empty
        :description="
          isCurrentUser ? 'You haven\'t added any books yet' : 'No books found'
        "
      >
        <template v-if="isCurrentUser" #extra>
          <n-button type="primary" @click="$router.push('/register-book')">
            Add Your First Book
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- Edit Modal -->
    <n-modal
      v-model:show="showEditModal"
      preset="dialog"
      title="Edit Book"
      style="width: 90%; max-width: 600px"
      class="rounded-lg"
    >
      <div class="p-4">
        <BookForm
          :initial-data="editingBook"
          :is-loading="isLoading"
          submit-button-text="Update Book"
          @submit="handleUpdateBook"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

// Naive UI Components
import {
  NButton,
  NEmpty,
  NIcon,
  NTooltip,
  NModal,
  NAlert,
  NSpin,
  useMessage,
  useDialog,
} from "naive-ui";

// Icons
import {
  TrashIcon,
  ArrowLeftIcon,
  PencilIcon,
} from "@heroicons/vue/24/outline";

// Local Components
import BookForm from "./common/BookForm.vue";
import BookCard from "./common/BookCard.vue";

// Services and Types
import { BooksServiceInstance } from "@/services";
import type { Book } from "@/services/BooksService";

const router = useRouter();
const route = useRoute();
const message = useMessage();
const dialog = useDialog();
const userStore = useUserStore();

const showEditModal = ref(false);
const editingBook = ref<Partial<Book> | undefined>(undefined);
const isLoading = ref(false);

// Open edit modal with book data
const handleEditBook = (book: Book) => {
  editingBook.value = { ...book };
  showEditModal.value = true;
};

// Handle book update
const handleUpdateBook = async (data: any) => {
  if (!editingBook.value?.id) return;

  try {
    isLoading.value = true;
    await BooksServiceInstance?.updateBook(editingBook.value.id, data);
    message.success("Book updated successfully");
    showEditModal.value = false;
    await fetchUserBooks();
  } catch (error) {
    console.error("Error updating book:", error);
    message.error("Failed to update book");
  } finally {
    isLoading.value = false;
  }
};

const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Get userId from route params or use current user's id
const userId = computed(
  () => route.params.userId?.toString() || userStore.user?.id
);

// Check if books belong to current user
const isCurrentUser = computed(() => userId.value === userStore.user?.id);

// Fetch user's books
const fetchUserBooks = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response: any = await BooksServiceInstance?.getUserBooks(
      userId.value || ""
    );
    if (response?.data) {
      books.value = response.data;
    }
  } catch (err) {
    error.value = "Failed to fetch books. Please try again later.";
    console.error("Error fetching books:", err);
  } finally {
    loading.value = false;
  }
};

// Delete a book
const handleDeleteBook = async (book: Book) => {
  if (!book.id) {
    message.error("Invalid book ID");
    return;
  }

  dialog.error({
    title: "Delete Book",
    content: `Are you sure you want to delete "${book.title}"?`,
    positiveText: "Delete",
    negativeText: "Cancel",
    style: "border-radius: 0.5rem;",
    onPositiveClick: async () => {
      try {
        await BooksServiceInstance?.deleteBook(book.id || "");
        message.success("Book deleted successfully");
        await fetchUserBooks();
      } catch (err) {
        message.error("Failed to delete book. Please try again later.");
        console.error("Error deleting book:", err);
      }
    },
  });
};

// Fetch books on component mount
onMounted(() => {
  fetchUserBooks();
});
</script>
