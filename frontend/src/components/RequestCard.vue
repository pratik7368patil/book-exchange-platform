<!-- RequestCard.vue -->
<template>
  <n-card
    class="hover:shadow transition-all duration-300 border border-gray-100"
  >
    <div class="flex flex-col gap-4 sm:gap-6">
      <!-- Header with Status -->
      <div class="flex justify-between items-center">
        <span class="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
          <n-icon size="16"><ClockIcon /></n-icon>
          {{ formattedDate }}
        </span>
        <n-tag
          :type="statusType"
          round
          size="small"
          class="uppercase text-xs font-medium"
        >
          {{ request.status }}
        </n-tag>
      </div>

      <!-- Books Exchange Section -->
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 flex-1">
        <!-- First Book -->
        <div class="flex gap-4 sm:gap-6 flex-1">
          <div
            class="w-20 sm:w-24 h-28 sm:h-32 flex-shrink-0 shadow-sm rounded-lg overflow-hidden relative bg-gradient-to-b from-gray-50 to-gray-100 group"
          >
            <n-image
              v-if="firstBook.imageUrl"
              :src="firstBook.imageUrl"
              :alt="firstBook.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              :preview-disabled="true"
              width="100"
              height="100"
              lazy
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <n-icon size="32" class="text-gray-300">
                <BookOpenIcon />
              </n-icon>
            </div>
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"
            />
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-xs sm:text-sm font-medium text-gray-500">{{
              firstBookLabel
            }}</span>
            <div v-if="showSenderName" class="flex items-center gap-2 mt-1">
              <span class="text-xs sm:text-sm font-medium text-primary">
                From {{ request.sender.name }}
              </span>
            </div>
            <h4
              class="text-sm sm:text-base font-medium text-gray-900 mt-2 truncate"
            >
              {{ firstBook.title }}
            </h4>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              by {{ firstBook.author }}
            </p>
          </div>
        </div>

        <!-- Exchange Arrow -->
        <div class="flex justify-center items-center py-2 sm:py-0">
          <n-icon size="20" class="text-primary rotate-90 sm:rotate-0">
            <ArrowRightIcon />
          </n-icon>
        </div>

        <!-- Second Book -->
        <div class="flex gap-4 sm:gap-6 flex-1">
          <div
            class="w-20 sm:w-24 h-28 sm:h-32 flex-shrink-0 shadow-sm rounded-lg overflow-hidden relative bg-gradient-to-b from-gray-50 to-gray-100 group"
          >
            <n-image
              v-if="secondBook.imageUrl"
              :src="secondBook.imageUrl"
              :alt="secondBook.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              :preview-disabled="true"
              width="100"
              height="100"
              lazy
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <n-icon size="32" class="text-gray-300">
                <BookOpenIcon />
              </n-icon>
            </div>
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"
            />
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-xs sm:text-sm font-medium text-gray-500">{{
              secondBookLabel
            }}</span>
            <h4
              class="text-sm sm:text-base font-medium text-gray-900 mt-2 truncate"
            >
              {{ secondBook.title }}
            </h4>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
              by {{ secondBook.author }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        v-if="showActions && request.status === 'pending'"
        class="flex justify-end gap-3"
      >
        <n-button
          v-if="
            request.status === 'pending' &&
            request.receiver.id === userStore.user?.id
          "
          type="success"
          size="small"
          class="shadow-sm"
          @click="$emit('accept', request)"
        >
          <template #icon>
            <n-icon><CheckCircleIcon /></n-icon>
          </template>
          Accept
        </n-button>
        <n-button
          v-if="
            request.status === 'pending' &&
            request.sender.id === userStore.user?.id
          "
          type="warning"
          size="small"
          class="shadow-sm"
          @click="$emit('cancel', request)"
        >
          <template #icon>
            <n-icon><XCircleIcon /></n-icon>
          </template>
          Cancel
        </n-button>
        <n-button
          v-if="
            request.status === 'pending' &&
            request.receiver.id === userStore.user?.id
          "
          type="error"
          size="small"
          class="shadow-sm"
          @click="$emit('reject', request)"
        >
          <template #icon>
            <n-icon><XCircleIcon /></n-icon>
          </template>
          Decline
        </n-button>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { ExchangeRequest } from "@/services/RequestsService";
import {
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
} from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import { NButton, NCard, NTag, NIcon, NImage } from "naive-ui";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
  request: ExchangeRequest;
  type: "sent" | "received";
  showActions?: boolean;
  showSenderName?: boolean;
}>();

defineEmits<{
  (e: "accept", request: ExchangeRequest): void;
  (e: "reject", request: ExchangeRequest): void;
  (e: "cancel", request: ExchangeRequest): void;
}>();

const userStore = useUserStore();

const firstBook = computed(() =>
  props.type === "sent" ? props.request.receiverBook : props.request.senderBook
);

const secondBook = computed(() =>
  props.type === "sent" ? props.request.senderBook : props.request.receiverBook
);

const firstBookLabel = computed(() =>
  props.type === "sent" ? "Requesting" : "From"
);

const secondBookLabel = computed(() =>
  props.type === "sent" ? "Offering" : "Your Book"
);

const showSenderName = computed(() => props.type === "received");

const formattedDate = computed(() => {
  return dayjs(props.request.createdAt).format("MMM D, YYYY [at] h:mm A");
});

const statusType = computed(() => {
  switch (props.request.status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
});
</script>
