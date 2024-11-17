<template>
  <n-card
    class="hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-xl book-card"
    :bordered="true"
    size="small"
    :theme-overrides="cardThemeOverrides"
  >
    <!-- Book Image -->
    <template #cover>
      <div
        class="w-full h-96 relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        @click="router.push(`/book/${book.id}`)"
      >
        <template v-if="book.imageUrl">
          <img
            :src="book.imageUrl"
            :alt="book.title"
            class="object-cover w-full h-full rounded-t-lg"
          />
        </template>
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg"
        >
          <n-icon size="48" class="text-gray-400">
            <PhotoIcon />
          </n-icon>
        </div>
        <div v-if="showBookmark" class="absolute top-4 right-4">
          <component
            @click.stop="$emit('toggle-bookmark', book)"
            role="button"
            :is="isBookmarked ? BookmarkIcon : BookmarkSlashIcon"
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center cursor-pointer p-1 hover:scale-110 transition-transform duration-300',
              isBookmarked ? 'text-red-500' : 'text-white',
            ]"
          />
        </div>
      </div>
    </template>

    <!-- Book Details -->
    <template #header>
      <div class="text-lg font-semibold text-gray-800 truncate">
        {{ book.title }}
      </div>
    </template>

    <div class="space-y-2">
      <div class="text-sm text-gray-600">
        <div><strong>Author:</strong> {{ book.author }}</div>
        <div><strong>Genre:</strong> {{ capitalizeFirst(book.genre) }}</div>
        <div>
          <strong>Condition:</strong> {{ capitalizeFirst(book.condition) }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center mt-4">
        <n-tag
          :bordered="false"
          :type="getStatusType(book.status)"
          :theme-overrides="tagThemeOverrides"
        >
          {{ capitalizeFirst(book.status) }}
        </n-tag>
        <slot name="actions"></slot>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { NCard, NIcon, NTag } from "naive-ui";
import { PhotoIcon } from "@heroicons/vue/24/solid";
import { BookmarkIcon } from "@heroicons/vue/24/solid";
import { BookmarkSlashIcon } from "@heroicons/vue/24/outline";
import type { Book } from "@/services/BooksService";

const router = useRouter();

defineProps<{
  book: Book;
  isBookmarked?: boolean;
  showBookmark?: boolean;
}>();

defineEmits<{
  (e: "toggle-bookmark", book: Book): void;
}>();

// Component-specific theme overrides
const cardThemeOverrides = {
  borderRadius: "0.75rem",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  borderColor: "rgb(229, 231, 235)",
  borderWidth: "1px",
};

const tagThemeOverrides = {
  success: {
    color: "rgb(34, 197, 94)",
    textColor: "rgb(21, 128, 61)",
  },
  warning: {
    color: "rgb(234, 179, 8)",
    textColor: "rgb(161, 98, 7)",
  },
  error: {
    color: "rgb(239, 68, 68)",
    textColor: "rgb(185, 28, 28)",
  },
};

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "success";
    case "pending":
      return "warning";
    case "exchanged":
      return "error";
    default:
      return "default";
  }
};
</script>
