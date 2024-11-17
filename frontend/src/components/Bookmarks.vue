<template>
  <div class="container mx-auto p-6">
    <n-spin :show="loading">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">My Bookmarks</h1>
        <p class="text-gray-600">Books you've bookmarked for later</p>
      </div>

      <!-- Bookmarks Grid -->
      <div v-if="bookmarkStore.bookmarks.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BookCard
            v-for="bookmark in bookmarkStore.bookmarks"
            :key="bookmark.id"
            :book="bookmark.book"
            :show-bookmark="true"
            :is-bookmarked="true"
            @toggle-bookmark="toggleBookmark"
          >
            <template #actions>
              <n-button
                v-if="bookmark.book.owner !== userStore.user?.id"
                type="primary"
                size="small"
                @click="handleExchangeRequest(bookmark.book)"
                :disabled="!bookmark.book.isAvailable"
              >
                Request Exchange
              </n-button>
            </template>
          </BookCard>
        </div>
      </div>

      <!-- Empty State -->
      <n-empty
        v-else-if="!loading"
        description="You haven't bookmarked any books yet"
      >
        <template #extra>
          <n-button type="primary" @click="router.push('/')">
            Browse Books
          </n-button>
        </template>
      </n-empty>
    </n-spin>

    <!-- Exchange Modal -->
    <n-modal v-model:show="showExchangeModal">
      <n-card style="width: 600px" title="Exchange Request" :bordered="false">
        <template #header>
          <div class="text-lg font-semibold">Exchange Request</div>
        </template>

        <div class="space-y-4">
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-sm text-gray-500">Selected Book:</div>
            <div class="font-medium">{{ selectedBook?.title }}</div>
            <div class="text-sm text-gray-500">
              by {{ selectedBook?.author }}
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
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  NButton,
  NEmpty,
  NSpin,
  NModal,
  NCard,
  NFormItem,
  NSelect,
  useMessage,
} from "naive-ui";
import { useUserStore } from "@/stores/user";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useRequestsStore } from "@/stores/requests";
import BookCard from "./common/BookCard.vue";
import services from "@/services";
import type { Book } from "@/services/BooksService";

const router = useRouter();
const message = useMessage();
const userStore = useUserStore();
const bookmarkStore = useBookmarkStore();
const requestsStore = useRequestsStore();

const loading = ref(false);
const showExchangeModal = ref(false);
const selectedBook = ref<Book | null>(null);
const userBooks = ref<Book[]>([]);
const selectedUserBook = ref<string>("");
const exchangeLoading = ref(false);

const toggleBookmark = async (book: Book) => {
  if (!book.id) return;
  try {
    await bookmarkStore.toggleBookmark(book.id);
    message.success("Bookmark removed");
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    message.error("Failed to update bookmark");
  }
};

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

const handleExchangeRequest = async (book: Book) => {
  if (!userStore.user?.id) {
    message.error("Please login to make an exchange request");
    return;
  }
  selectedBook.value = book;
  await fetchUserBooks();
  showExchangeModal.value = true;
};

const sendExchangeRequest = async () => {
  if (!selectedUserBook.value || !selectedBook.value || !userStore.user?.id) {
    message.error("Please select a book to exchange");
    return;
  }

  try {
    exchangeLoading.value = true;
    const requestData: any = {
      senderBookId: selectedUserBook.value,
      receiverBookId: selectedBook.value.id,
      senderId: userStore.user.id,
      receiverId: selectedBook.value.owner,
    };

    await services.RequestsService()?.createRequest(requestData);
    await requestsStore.fetchUserRequests(userStore.user.id);
    message.success("Exchange request sent successfully!");
    showExchangeModal.value = false;
    selectedUserBook.value = "";
    selectedBook.value = null;
  } catch (error) {
    console.error("Error sending exchange request:", error);
    message.error("Failed to send exchange request");
  } finally {
    exchangeLoading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await bookmarkStore.fetchUserBookmarks();
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    message.error("Failed to fetch bookmarks");
  } finally {
    loading.value = false;
  }
});
</script>
