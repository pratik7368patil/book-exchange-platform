<template>
  <NLayoutHeader bordered class="header">
    <div class="nav-container grid grid-cols-12 gap-2 py-3 px-2 items-center">
      <!-- Logo -->
      <div class="logo col-span-1 lg:col-span-2">
        <router-link :to="{ name: 'home' }">
          <BookOpenIcon
            class="h-6 w-6 block lg:hidden"
            style="color: #4f46e5"
          />
          <NText
            class="logo-text font-bold text-3xl hidden lg:block"
            style="color: #4f46e5"
            >BookExchange</NText
          >
        </router-link>
      </div>

      <!-- Search Field - Desktop -->
      <div
        class="search-container desktop-only col-span-8 lg:col-span-9 flex justify-center"
      >
        <NInputGroup class="search-input-group max-w-lg">
          <NInput
            class="w-full"
            v-model:value="searchQuery"
            placeholder="Search books..."
            clearable
            round
            :theme-overrides="{
              textColor: '#4F46E5',
              borderHover: '#4F46E5',
              borderFocus: '#4F46E5',
            }"
          >
            <template #prefix>
              <MagnifyingGlassIcon class="h-5 w-5 text-indigo-600" />
            </template>
          </NInput>
        </NInputGroup>
      </div>

      <!-- Right Navigation -->
      <div class="nav-right col-span-3 lg:col-span-1 flex items-center">
        <!-- Chat Button -->
        <NButton class="mr-2" quaternary circle @click="handleChat">
          <template #icon>
            <ChatBubbleLeftRightIcon class="h-5 w-5" />
          </template>
        </NButton>

        <!-- Profile Dropdown -->
        <NDropdown
          trigger="click"
          :options="menuOptions"
          @select="handleSelect"
          :show-arrow="true"
        >
          <NAvatar
            :style="{ background: '#4f46e5' }"
            class="cursor-pointer"
            size="medium"
            round
          >
            {{ userInitials }}
          </NAvatar>
        </NDropdown>
      </div>
    </div>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useRouter } from "vue-router";
import {
  NLayoutHeader,
  NText,
  NInputGroup,
  NInput,
  NButton,
  NDropdown,
  NAvatar,
  useMessage,
} from "naive-ui";
import { removeToken } from "@/helper";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  BookmarkIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const message = useMessage();
const searchQuery = ref("");
const showSearch = ref(false);

// Mock user data - replace with actual user data later
const user = {
  name: "John Doe",
};

const userInitials = computed(() => {
  return user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
});

const menuOptions = [
  {
    label: "Profile",
    key: "profile",
    icon: () => h(UserCircleIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Register Book",
    key: "register-book",
    icon: () => h(BookOpenIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Orders",
    key: "orders",
    icon: () => h(ShoppingBagIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Bookmarks",
    key: "bookmarks",
    icon: () => h(BookmarkIcon, { class: "h-5 w-5" }),
  },
  {
    label: "Logout",
    key: "logout",
    icon: () => h(ArrowLeftStartOnRectangleIcon, { class: "h-5 w-5" }),
  },
];

const handleChat = () => {
  message.info("Chat feature coming soon!");
};

const handleSelect = (key: string) => {
  switch (key) {
    case "profile":
      router.push({ name: "profile" });
      break;
    case "register-book":
      router.push({ name: "register-book" });
      break;
    case "orders":
      router.push({ name: "orders" });
      break;
    case "bookmarks":
      router.push({ name: "bookmarks" });
      break;
    case "logout":
      removeToken();
      message.success("Logged out successfully");
      router.push({ name: "login" });
      break;
  }
};
</script>

<style scoped>
/* Hide horizontal scrollbar */
::-webkit-scrollbar-horizontal {
  display: none;
}
</style>
