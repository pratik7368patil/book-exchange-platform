<template>
  <div class="bg-white rounded-lg p-4 border border-gray-200">
    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {{ label }}
    </h4>
    <div class="mb-3">
      <n-space align="center" :size="8">
        <n-avatar round size="small" :style="{ width: '24px', height: '24px' }">
          <n-icon size="18">
            <UserIcon />
          </n-icon>
        </n-avatar>
        <div class="flex items-center gap-1">
          <n-text strong class="leading-6">{{ user.name }}</n-text>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button text size="tiny" class="flex items-center justify-center h-6 w-6 p-0.5 hover:bg-gray-100">
                <n-icon size="18">
                  <EnvelopeIcon />
                </n-icon>
              </n-button>
            </template>
            {{ user.email }}
          </n-tooltip>
        </div>
      </n-space>
    </div>
    <n-card size="small" embedded class="mt-2">
      <n-space vertical :size="4">
        <n-text strong>{{ book.title }}</n-text>
        <n-text depth="3">by {{ book.author }}</n-text>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NSpace, NAvatar, NIcon, NTooltip, NText, NButton, NCard } from "naive-ui";
import { UserIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";

interface User {
  name: string;
  email: string;
}

interface Book {
  title: string;
  author: string;
}

defineProps<{
  label: string;
  user: User;
  book: Book;
}>();
</script>
