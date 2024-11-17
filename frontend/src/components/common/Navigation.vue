<template>
  <NLayoutHeader class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-12 gap-4 h-16 items-center">
        <!-- Logo -->
        <div class="col-span-3 lg:col-span-2 flex items-center">
          <router-link
            to="/"
            class="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
          >
            <BookOpenIcon class="h-8 w-8" />
            <NText class="text-xl font-semibold hidden sm:block">Bookly</NText>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="col-span-6 lg:col-span-8 relative">
          <div class="max-w-2xl mx-auto relative">
            <div class="relative">
              <NInputGroup>
                <NInput
                  v-model:value="searchQuery"
                  type="text"
                  placeholder="Search for books..."
                  class="rounded-l-md"
                  @update:value="handleSearch"
                >
                  <template #prefix>
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                  </template>
                </NInput>
              </NInputGroup>

              <!-- Search Results Dropdown -->
              <div
                v-if="showResults && searchResults.length > 0"
                class="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
              >
                <div
                  v-for="book in searchResults"
                  :key="book.id"
                  class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  @click="handleBookSelect(book)"
                >
                  <div class="flex items-start">
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ book.title }}
                      </h4>
                      <p class="text-sm text-gray-500">by {{ book.author }}</p>
                      <p class="text-xs text-gray-400">{{ book.genre }}</p>
                    </div>
                    <div class="ml-2">
                      <span
                        :class="[
                          'px-2 py-1 text-xs rounded-full',
                          book.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        ]"
                      >
                        {{ book.isAvailable ? "Available" : "Not Available" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Results Message -->
              <div
                v-if="showResults && searchQuery && searchResults.length === 0"
                class="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-4 text-center text-gray-500 z-50"
              >
                No books found matching "{{ searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div
          class="col-span-3 lg:col-span-2 flex items-center justify-end pr-4"
        >
          <!-- Profile Dropdown -->
          <n-dropdown
            :options="profileMenuOptions"
            @select="handleProfileMenuSelect"
            trigger="click"
          >
            <div class="cursor-pointer flex items-center">
              <div
                v-if="userStore.user?.avatar"
                class="w-8 h-8 rounded-full overflow-hidden"
              >
                <img
                  :src="userStore.user.avatar"
                  :alt="userStore.user.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium"
              >
                {{ userInitials }}
              </div>
            </div>
          </n-dropdown>
        </div>
      </div>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import BooksService, { Book } from "@/services/BooksService";
import { debounce } from "lodash-es";
import {
  NLayoutHeader,
  NText,
  NInputGroup,
  NInput,
  NDropdown,
  useMessage,
} from "naive-ui";
import { removeToken } from "@/helper";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  BookmarkIcon,
  ArrowLeftStartOnRectangleIcon,
  InboxIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const booksService = new BooksService();

const searchQuery = ref("");
const searchResults = ref<Book[]>([]);
const showResults = ref(false);
const isSearching = ref(false);

// Debounced search function
const debouncedSearch = debounce(async (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  try {
    isSearching.value = true;
    const response: any = await booksService.searchBooks({ title: query });
    searchResults.value = response.data;
    showResults.value = true;
  } catch (error) {
    console.error("Search error:", error);
    message.error("Failed to search books");
  } finally {
    isSearching.value = false;
  }
}, 300);

// Search handler
const handleSearch = (value: string) => {
  searchQuery.value = value;
  debouncedSearch(value);
};

// Book selection handler
const handleBookSelect = (book: Book) => {
  searchQuery.value = "";
  showResults.value = false;
  router.push({ name: "book-details", params: { bookId: book.id } });
};

// Close search results when clicking outside
const closeSearchResults = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest(".search-container")) {
    showResults.value = false;
  }
};

// Add click outside listener
onMounted(() => {
  document.addEventListener("click", closeSearchResults);
});

onUnmounted(() => {
  document.removeEventListener("click", closeSearchResults);
});

const userInitials = computed(() => {
  if (!userStore.user?.name) return "";
  return userStore.user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const profileMenuOptions = [
  {
    label: "Profile",
    key: "profile",
    icon: () => h(UserCircleIcon, { class: "h-5 w-5" }),
  },
  {
    label: "My Books",
    key: "my-books",
    icon: () => h(BookOpenIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Register Book",
    key: "register-book",
    icon: () => h(BookOpenIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Orders History",
    key: "orders",
    icon: () => h(ShoppingBagIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Bookmarks",
    key: "bookmarks",
    icon: () => h(BookmarkIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Requests",
    key: "requests",
    icon: () => h(InboxIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Logout",
    key: "logout",
    icon: () => h(ArrowLeftStartOnRectangleIcon, { class: "h-5 w-5" }),
  },
];

const handleProfileMenuSelect = (key: string) => {
  if (key === "logout") {
    removeToken();
    userStore.clearUser();
    router.push({ name: "login" });
  } else if (
    ["my-books", "register-book", "bookmarks", "requests", "orders"].includes(
      key
    )
  ) {
    router.push({ name: key });
  }
};
</script>

<style scoped>
/* Hide horizontal scrollbar */
::-webkit-scrollbar-horizontal {
  display: none;
}
</style>
