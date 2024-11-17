<template>
  <div class="max-w-7xl mx-auto px-2 sm:px-5">
    <n-card title="Orders History" class="bg-white">
      <template #header-extra>
        <n-space align="center">
          <n-button
            @click="loadOrders"
            type="primary"
            secondary
            size="small"
            class="sm:text-base"
          >
            <template #icon>
              <n-icon><ArrowPathIcon /></n-icon>
            </template>
            Refresh
          </n-button>
        </n-space>
      </template>

      <n-spin :show="loading">
        <n-empty
          v-if="!loading && orders.length === 0"
          description="No orders found"
        />

        <n-list v-else class="space-y-4">
          <n-list-item v-for="order in orders" :key="order.id">
            <n-card
              :title="'Order #' + order.id.substring(0, 8)"
              embedded
              class="transition-all duration-300"
            >
              <template #header>
                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-5 py-3 border-b border-gray-200 space-y-2 sm:space-y-0"
                >
                  <span
                    class="font-semibold text-gray-700 text-sm sm:text-base"
                  >
                    Order #{{ order.id.substring(0, 8) }}
                  </span>
                  <n-tag
                    :type="getStatusType(order.status)"
                    round
                    class="font-medium self-start sm:self-auto"
                  >
                    {{ order.status.toUpperCase() }}
                  </n-tag>
                </div>
              </template>

              <div class="p-2 sm:p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="rounded-lg bg-white p-3 sm:p-4 h-full">
                    <h3
                      class="flex items-center gap-2 text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-gray-700"
                    >
                      <n-icon class="text-primary"><QrCodeIcon /></n-icon>
                      Shipping Details
                    </h3>
                    <n-descriptions :column="1" class="text-sm sm:text-base">
                      <n-descriptions-item label="Shipping Method">
                        <n-space align="center" :size="8">
                          <n-tag size="small" round type="info">
                            {{ order.shippingMethod }}
                          </n-tag>
                        </n-space>
                      </n-descriptions-item>
                      <n-descriptions-item
                        v-if="order.trackingNumber"
                        label="Tracking Number"
                      >
                        <n-space align="center" :size="8">
                          <n-icon size="18">
                            <QrCodeIcon />
                          </n-icon>
                          <n-text code class="text-xs sm:text-sm break-all">{{
                            order.trackingNumber
                          }}</n-text>
                        </n-space>
                      </n-descriptions-item>
                      <n-descriptions-item
                        v-if="order.estimatedDeliveryDate"
                        label="Estimated Delivery"
                      >
                        <n-space align="center" :size="8">
                          <n-icon size="18">
                            <CalendarIcon />
                          </n-icon>
                          <n-text type="info">
                            {{ formatDate(order.estimatedDeliveryDate) }}
                          </n-text>
                        </n-space>
                      </n-descriptions-item>
                      <n-descriptions-item label="Created">
                        <n-space align="center" :size="8">
                          <n-icon size="18">
                            <ClockIcon />
                          </n-icon>
                          <n-text type="success">
                            {{ formatDate(order.createdAt) }}
                          </n-text>
                        </n-space>
                      </n-descriptions-item>
                    </n-descriptions>
                  </div>

                  <div class="rounded-lg bg-white p-3 sm:p-4 h-full">
                    <h3
                      class="flex items-center gap-2 text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-gray-700"
                    >
                      <n-icon class="text-primary"><BookOpenIcon /></n-icon>
                      Exchange Details
                    </h3>
                    <n-space vertical :size="12">
                      <ExchangeParty
                        label="From"
                        :user="order.request.sender"
                        :book="order.request.senderBook"
                      />

                      <div class="flex items-center gap-3 py-2">
                        <div class="flex-1 h-px bg-gray-200"></div>
                        <n-icon class="text-gray-400">
                          <ArrowsRightLeftIcon />
                        </n-icon>
                        <div class="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <ExchangeParty
                        label="To"
                        :user="order.request.receiver"
                        :book="order.request.receiverBook"
                      />
                    </n-space>
                  </div>
                </div>
              </div>
            </n-card>
          </n-list-item>
        </n-list>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  NCard,
  NButton,
  NSpace,
  NSpin,
  NEmpty,
  NList,
  NListItem,
  NTag,
  NDescriptions,
  NDescriptionsItem,
  NIcon,
  NText,
  useMessage,
} from "naive-ui";
import {
  ArrowPathIcon,
  QrCodeIcon,
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/vue/24/outline";
import services from "@/services";
import type { Order } from "@/services/OrdersService";
import { useUserStore } from "@/stores/user";
import ExchangeParty from "./common/ExchangeParty.vue";

const userStore = useUserStore();
const message = useMessage();
const loading = ref(false);
const orders = ref<Order[]>([]);

const getStatusType = (status: string) => {
  const types = {
    pending: "warning",
    processing: "info",
    shipped: "success",
    delivered: "success",
    cancelled: "error",
  };
  return types[status] || "default";
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const loadOrders = async () => {
  loading.value = true;
  try {
    const response: any = await services
      .OrdersService()
      ?.getUserOrders(userStore.user?.id || "");
    orders.value = response.data;
  } catch (error) {
    message.error("Failed to load orders");
    console.error("Error loading orders:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOrders();
});
</script>
