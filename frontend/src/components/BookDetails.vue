<template>
  <div class="max-w-4xl mx-auto p-6">
    <n-spin :show="loading">
      <div v-if="book" class="space-y-8">
        <!-- Back Button -->
        <div class="flex items-center space-x-2">
          <n-button @click="router.back()" quaternary>
            <template #icon>
              <ArrowLeftIcon class="w-5 h-5" />
            </template>
            Back
          </n-button>
        </div>

        <!-- Book Header -->
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Book Image -->
          <div class="w-full md:w-1/3">
            <div class="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                :src="book.imageUrl || 'https://via.placeholder.com/300x400'"
                :alt="book.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Book Info -->
          <div class="flex-1 space-y-6">
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ book.title }}</h1>
              <p class="text-lg text-gray-600">by {{ book.author }}</p>
            </div>

            <div class="flex items-center space-x-4">
              <n-tag :type="book.isAvailable ? 'success' : 'error'">
                {{ book.isAvailable ? "Available" : "Not Available" }}
              </n-tag>
              <n-button
                type="primary"
                @click="handleExchangeRequest"
                :disabled="
                  book.owner?.id === userStore.user?.id || !book.isAvailable
                "
              >
                {{
                  userStore.user?.id ? "Request Exchange" : "Login to Exchange"
                }}
              </n-button>
              <n-button
                v-if="book.owner?.id !== userStore.user?.id"
                :type="
                  bookmarkStore.isBookmarked(book.id) ? 'error' : 'default'
                "
                @click="toggleBookmark"
                :loading="bookmarkLoading"
              >
                <template #icon>
                  <BookmarkIcon
                    :class="[
                      'w-5 h-5',
                      bookmarkStore.isBookmarked(book.id)
                        ? 'text-yellow-500'
                        : 'text-gray-500',
                    ]"
                  />
                </template>
                {{
                  bookmarkStore.isBookmarked(book.id)
                    ? "Bookmarked"
                    : "Bookmark"
                }}
              </n-button>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold mb-2">Description</h3>
                <p class="text-gray-600">
                  {{ book.description || "Description not available!" }}
                </p>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-2">Details</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-gray-500">Genre</p>
                    <p>{{ book.genre }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500">Condition</p>
                    <p>{{ book.condition }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <n-result
        v-else-if="!loading"
        status="404"
        title="Book Not Found"
        description="The book you're looking for doesn't exist or has been removed."
      >
        <template #footer>
          <n-button @click="router.push('/')" type="info" color="#4f46e5">
            Back to Home
          </n-button>
        </template>
      </n-result>
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
            <div class="font-medium">{{ book?.title }}</div>
            <div class="text-sm text-gray-500">by {{ book?.author }}</div>
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
import { useRoute, useRouter } from "vue-router";
import {
  useMessage,
  NModal,
  NCard,
  NButton,
  NSelect,
  NFormItem,
  NSpin,
  NResult,
  NTag,
} from "naive-ui";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { BookmarkIcon } from "@heroicons/vue/24/solid";
import { useUserStore } from "@/stores/user";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useRequestsStore } from "@/stores/requests";
import services from "@/services";
import type { Book } from "@/services/BooksService";

const route = useRoute();
const router = useRouter();
const message = useMessage();
const userStore = useUserStore();
const bookmarkStore = useBookmarkStore();
const requestsStore = useRequestsStore();

const book = ref<Book | null>(null);
const loading = ref(true);
const bookmarkLoading = ref(false);
const showExchangeModal = ref(false);
const userBooks = ref<Book[]>([]);
const selectedUserBook = ref<string>("");
const exchangeLoading = ref(false);

const fetchBook = async () => {
  try {
    loading.value = true;
    const response: any = await services
      .BooksService()
      ?.getBookById(route.params.bookId as string);
    if (response?.data) {
      book.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    message.error("Failed to fetch book details");
  } finally {
    loading.value = false;
  }
};

const toggleBookmark = async () => {
  if (!book.value?.id || bookmarkLoading.value) return;

  try {
    bookmarkLoading.value = true;
    await bookmarkStore.toggleBookmark(book.value.id);
    message.success(
      bookmarkStore.isBookmarked(book.value.id)
        ? "Book bookmarked"
        : "Bookmark removed"
    );
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    message.error("Failed to update bookmark");
  } finally {
    bookmarkLoading.value = false;
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

const handleExchangeRequest = async () => {
  if (!userStore.user?.id) {
    message.error("Please login to make an exchange request");
    return;
  }
  await fetchUserBooks();
  showExchangeModal.value = true;
};

const sendExchangeRequest = async () => {
  if (!selectedUserBook.value || !book.value || !userStore.user?.id) {
    message.error("Please select a book to exchange");
    return;
  }

  try {
    exchangeLoading.value = true;
    const requestData: any = {
      senderBookId: selectedUserBook.value,
      receiverBookId: book.value.id,
      senderId: userStore.user.id,
      receiverId: book.value.owner,
    };

    await services.RequestsService()?.createRequest(requestData);
    await requestsStore.fetchUserRequests(userStore.user.id);
    message.success("Exchange request sent successfully!");
    showExchangeModal.value = false;
    selectedUserBook.value = "";
  } catch (error) {
    console.error("Error sending exchange request:", error);
    message.error("Failed to send exchange request");
  } finally {
    exchangeLoading.value = false;
  }
};

onMounted(() => {
  fetchBook();
});
</script>
