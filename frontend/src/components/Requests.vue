<template>
  <div class="px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-medium text-gray-900">Exchange Requests</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your book exchange requests
        </p>
      </div>
      <n-button type="primary" @click="$router.push('/')">
        <template #icon>
          <n-icon><BookOpenIcon /></n-icon>
        </template>
        Browse Books
      </n-button>
    </div>

    <!-- Navigation Links -->
    <div
      v-if="!requestsStore.isLoading && requestsStore.getUserRequests.length"
      class="flex gap-6 mb-8"
    >
      <a
        v-if="receivedRequests.length > 0"
        href="#received-requests"
        class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
      >
        <n-icon><InboxIcon /></n-icon>
        Received Requests ({{ receivedRequests.length }})
      </a>
      <a
        v-if="sentRequests.length > 0"
        href="#sent-requests"
        class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
      >
        <n-icon><PaperAirplaneIcon /></n-icon>
        Sent Requests ({{ sentRequests.length }})
      </a>
    </div>

    <!-- Loading State -->
    <div v-if="requestsStore.isLoading" class="flex justify-center py-12">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <n-alert
      v-if="requestsStore.getError"
      type="error"
      :title="requestsStore.getError"
      class="mb-6"
    />

    <!-- No Requests -->
    <n-empty
      v-if="!requestsStore.isLoading && !requestsStore.getUserRequests.length"
      description="No exchange requests found"
    >
      <template #icon>
        <n-icon size="48"><InboxIcon /></n-icon>
      </template>
      <template #extra>
        <n-button type="primary" @click="$router.push('/')">
          <template #icon>
            <n-icon><BookOpenIcon /></n-icon>
          </template>
          Browse Books
        </n-button>
      </template>
    </n-empty>

    <!-- Requests List -->
    <div v-else class="space-y-8">
      <!-- Sent Requests -->
      <section v-if="sentRequests.length > 0" id="sent-requests">
        <div class="border-b border-gray-200 pb-2 mb-4">
          <h2 class="text-lg font-medium text-gray-900 flex items-center gap-2">
            <n-icon><PaperAirplaneIcon /></n-icon>
            Sent Requests
          </h2>
        </div>

        <div class="grid gap-4">
          <RequestCard
            v-for="request in sentRequests"
            :key="request.id"
            :request="request"
            type="sent"
            :show-actions="true"
            @accept="handleAccept"
            @reject="handleReject"
            @cancel="handleCancel"
          />
        </div>
      </section>

      <!-- Received Requests -->
      <section v-if="receivedRequests.length > 0" id="received-requests">
        <div class="border-b border-gray-200 pb-2 mb-4">
          <h2 class="text-lg font-medium text-gray-900 flex items-center gap-2">
            <n-icon><InboxIcon /></n-icon>
            Received Requests
          </h2>
        </div>

        <div class="grid gap-4">
          <RequestCard
            v-for="request in receivedRequests"
            :key="request.id"
            :request="request"
            type="received"
            :show-actions="true"
            @accept="handleAccept"
            @reject="handleReject"
            @cancel="handleCancel"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import {
  BookOpenIcon,
  InboxIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";
import { NButton, NSpin, NEmpty, NAlert, NIcon } from "naive-ui";
import { useMessage } from "naive-ui";
import { useUserStore } from "@/stores/user";
import { useRequestsStore } from "@/stores/requests";
import type { ExchangeRequest } from "@/services/RequestsService";
import RequestCard from "./RequestCard.vue";

const userStore = useUserStore();
const requestsStore = useRequestsStore();
const message = useMessage();

const sentRequests = computed(() =>
  requestsStore.getUserRequests.filter(
    (request) => request.sender.id === userStore.user?.id
  )
);

const receivedRequests = computed(() =>
  requestsStore.getUserRequests.filter(
    (request) => request.receiver.id === userStore.user?.id
  )
);

// Action handlers
const handleAccept = async (request: ExchangeRequest) => {
  if (!request.id || !userStore.user?.id) return;

  try {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = true;
    await requestsStore.acceptRequest(request.id, userStore.user.id);
    message.success("Request accepted successfully");
  } catch (error) {
    message.error("Failed to accept request");
    console.error("Error accepting request:", error);
  } finally {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = false;
  }
};

const handleReject = async (request: ExchangeRequest) => {
  if (!request.id || !userStore.user?.id) return;

  try {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = true;
    await requestsStore.rejectRequest(request.id, userStore.user.id);
    message.success("Request rejected successfully");
  } catch (error) {
    message.error("Failed to reject request");
    console.error("Error rejecting request:", error);
  } finally {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = false;
  }
};

const handleCancel = async (request: ExchangeRequest) => {
  if (!request.id || !userStore.user?.id) return;

  try {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = true;
    await requestsStore.cancelRequest(request.id, userStore.user.id);
    message.success("Request cancelled successfully");
  } catch (error) {
    message.error("Failed to cancel request");
    console.error("Error cancelling request:", error);
  } finally {
    const loadingStates = ref<{ [key: string]: boolean }>({});
    loadingStates.value[request.id] = false;
  }
};

// Initial load
onMounted(async () => {
  if (userStore.user?.id) {
    await requestsStore.fetchUserRequests(userStore.user.id);
  } else {
    message.error("Please login to view requests");
  }
});
</script>
