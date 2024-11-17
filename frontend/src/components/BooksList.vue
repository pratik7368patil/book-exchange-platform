<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Available Books</h1>
      <n-button type="primary" @click="$router.push('/register-book')">
        Add New Book
      </n-button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading && !books.length"
      class="flex justify-center items-center py-12"
    >
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
      v-if="books.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        :show-bookmark="userStore.user?.id !== book.owner"
        :is-bookmarked="bookmarkStore.isBookmarked(book.id)"
        @toggle-bookmark="toggleBookmark"
        @exchange="handleExchangeRequest"
      >
        <template #actions>
          <n-button
            v-if="book.owner !== userStore.user?.id"
            size="small"
            type="primary"
            @click="handleExchangeRequest(book)"
            :disabled="!book.isAvailable"
            ghost
          >
            Request Exchange
          </n-button>
        </template>
      </BookCard>
    </div>

    <!-- Load More -->
    <div v-if="hasMoreBooks" class="mt-8 text-center">
      <n-button :loading="loading" @click="loadMoreBooks" type="primary" ghost>
        Load More Books
      </n-button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !books.length" class="text-center py-12">
      <n-empty description="No books available">
        <template #extra>
          <n-button type="primary" @click="$router.push('/register-book')">
            Add Your First Book
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- Exchange Request Modal -->
    <n-modal
      v-model:show="showExchangeModal"
      preset="card"
      title="Exchange Request"
      :mask-closable="false"
      class="max-w-md"
    >
      <template #header>
        <div class="text-lg font-semibold">Exchange Request</div>
      </template>

      <div class="space-y-4">
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="text-sm text-gray-500">Selected Book:</div>
          <div class="font-medium">{{ selectedReceiverBook?.title }}</div>
          <div class="text-sm text-gray-500">
            by {{ selectedReceiverBook?.author }}
          </div>
        </div>

        <n-form-item label="Select Your Book to Exchange">
          <n-select
            v-model:value="selectedUserBook"
            :options="
              userBooks.map((book) => ({
                label: book.title,
                value: book.id,
                disabled: !book.isAvailable,
              }))
            "
            placeholder="Select a book"
            :loading="exchangeLoading"
          />
        </n-form-item>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button
            @click="showExchangeModal = false"
            :disabled="exchangeLoading"
          >
            Cancel
          </n-button>
          <n-button
            type="primary"
            @click="sendExchangeRequest"
            :loading="exchangeLoading"
            :disabled="!selectedUserBook"
          >
            Send Request
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  useMessage,
  NModal,
  NButton,
  NSelect,
  NFormItem,
  NSpin,
  NAlert,
  NEmpty,
} from "naive-ui";
import { useUserStore } from "@/stores/user";
import { useRequestsStore } from "@/stores/requests";
import services from "@/services";
import type { Book } from "@/services/BooksService";
import BookCard from "./common/BookCard.vue";
import { useBookmarkStore } from "@/stores/bookmarks";

const userStore = useUserStore();
const requestsStore = useRequestsStore();
const bookmarkStore = useBookmarkStore();
const message = useMessage();

const books = ref<Book[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 10;
const hasMoreBooks = ref(false);
const bookmarkLoading = ref<{ [key: string]: boolean }>({});

// Exchange request modal refs
const showExchangeModal = ref(false);
const selectedReceiverBook = ref<Book | null>(null);
const userBooks = ref<Book[]>([]);
const selectedUserBook = ref<string>("");
const exchangeLoading = ref(false);

// Fetch books with pagination
const fetchBooks = async (page: number) => {
  try {
    loading.value = true;
    error.value = null;

    const response = await services.BooksService()?.getAllBooks({
      page,
      limit: itemsPerPage,
    });

    if (response?.data) {
      if (page === 1) {
        books.value = response.data.data;
      } else {
        books.value = [...books.value, ...response.data.data];
      }

      totalPages.value = Math.ceil(
        response.data.pagination.totalItems / itemsPerPage
      );
      hasMoreBooks.value = page < totalPages.value;
    }
  } catch (err) {
    error.value = "Failed to fetch books. Please try again.";
    console.error("Error fetching books:", err);
  } finally {
    loading.value = false;
  }
};

// Load more books
const loadMoreBooks = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchBooks(currentPage.value);
  }
};

// Toggle bookmark status
const toggleBookmark = async (book: Book) => {
  if (!book.id || bookmarkLoading.value[book.id]) return;

  try {
    await bookmarkStore.toggleBookmark(book.id);
    bookmarkLoading.value[book.id] = true;
  } catch (err) {
    message.error("Failed to update bookmark. Please try again.");
    console.error("Error updating bookmark:", err);
  } finally {
    bookmarkLoading.value[book.id] = false;
  }
};

// Fetch user's books for exchange
const fetchUserBooks = async () => {
  try {
    const response: any = await services
      .BooksService()
      ?.getUserBooks(userStore.user?.id || "");
    if (response?.data) {
      userBooks.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching user books:", error);
    message.error("Failed to fetch your books");
  }
};

// Handle exchange request
const handleExchangeRequest = async (book: Book) => {
  if (!userStore.user) {
    message.error("Please login to make an exchange request");
    return;
  }
  selectedReceiverBook.value = book;
  await fetchUserBooks();
  showExchangeModal.value = true;
};

// Send exchange request
const sendExchangeRequest = async () => {
  if (
    !selectedUserBook.value ||
    !selectedReceiverBook.value ||
    !userStore.user?.id
  ) {
    message.error("Please select a book to exchange");
    return;
  }

  try {
    exchangeLoading.value = true;
    const requestData: any = {
      senderBookId: selectedUserBook.value,
      receiverBookId: selectedReceiverBook.value.id,
      senderId: userStore.user.id,
      receiverId: selectedReceiverBook.value.owner,
    };

    await services.RequestsService()?.createRequest(requestData);
    await requestsStore.fetchUserRequests(userStore.user.id);
    message.success("Exchange request sent successfully!");
    showExchangeModal.value = false;
    selectedUserBook.value = "";
    selectedReceiverBook.value = null;
  } catch (error) {
    console.error("Error sending exchange request:", error);
    message.error("Failed to send exchange request");
  } finally {
    exchangeLoading.value = false;
  }
};

// Initial load
onMounted(async () => {
  await Promise.all([fetchBooks(1)]);
});
</script>
