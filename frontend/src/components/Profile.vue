<template>
  <div class="min-h-screen py-4 sm:py-8">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Back Button -->
      <div class="mb-4">
        <n-button
          text
          type="primary"
          @click="router.push('/')"
          size="small"
          class="flex items-center gap-1 -ml-2 text-gray-600 hover:text-primary"
        >
          <template #icon>
            <n-icon :component="ArrowLeftIcon" class="h-4 w-4" />
          </template>
          Back to Books
        </n-button>
      </div>
      <div class="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Profile Settings
        </h1>

        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="top"
          require-mark-placement="right-hanging"
          size="medium"
          class="space-y-4"
        >
          <!-- Profile Picture -->
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div
              class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
            >
              <img
                v-if="formData.avatar"
                :src="formData.avatar"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-2xl font-semibold"
              >
                {{ userInitials }}
              </div>
            </div>
            <div class="text-center sm:text-left">
              <n-upload accept="image/*" :max="1" @change="handleAvatarUpload">
                <n-button secondary class="text-indigo-600">
                  <template #icon>
                    <PhotoIcon class="w-5 h-5 mr-1" />
                  </template>
                  Change Photo
                </n-button>
              </n-upload>
              <p class="mt-2 text-sm text-gray-500">
                <InformationCircleIcon class="w-4 h-4 inline-block mr-1" />
                JPG, GIF or PNG. Max size of 5MB.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-[160px,1fr] gap-4">
            <!-- Name Field -->
            <n-form-item label="Name" path="name" class="sm:col-span-2">
              <n-input
                v-model:value="formData.name"
                placeholder="Enter your name"
                class="w-full"
              >
                <template #prefix>
                  <UserIcon class="w-5 h-5" />
                </template>
              </n-input>
            </n-form-item>

            <!-- Email Field -->
            <n-form-item label="Email" path="email" class="sm:col-span-2">
              <n-input
                v-model:value="formData.email"
                placeholder="Enter your email"
                class="w-full"
              >
                <template #prefix>
                  <EnvelopeIcon class="w-5 h-5" />
                </template>
              </n-input>
            </n-form-item>

            <!-- Current Password Field -->
            <n-form-item
              label="Current Password"
              path="currentPassword"
              class="sm:col-span-2"
            >
              <n-input
                v-model:value="formData.currentPassword"
                type="password"
                placeholder="Enter current password"
                show-password-on="click"
                class="w-full"
              >
                <template #prefix>
                  <LockClosedIcon class="w-5 h-5" />
                </template>
              </n-input>
            </n-form-item>

            <!-- New Password Field -->
            <n-form-item
              label="New Password"
              path="newPassword"
              class="sm:col-span-2"
            >
              <n-input
                v-model:value="formData.newPassword"
                type="password"
                placeholder="Enter new password"
                show-password-on="click"
                class="w-full"
              >
                <template #prefix>
                  <KeyIcon class="w-5 h-5" />
                </template>
              </n-input>
            </n-form-item>

            <!-- Confirm New Password Field -->
            <n-form-item
              label="Confirm New Password"
              path="confirmNewPassword"
              class="sm:col-span-2"
            >
              <n-input
                v-model:value="formData.confirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                show-password-on="click"
                class="w-full"
              >
                <template #prefix>
                  <KeyIcon class="w-5 h-5" />
                </template>
              </n-input>
            </n-form-item>
          </div>

          <!-- Save Button -->
          <div class="pt-2">
            <n-button
              type="primary"
              :loading="loading"
              @click="handleSubmit"
              class="w-full"
              size="large"
            >
              Save Changes
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NUpload,
  NIcon,
  useMessage,
} from "naive-ui";
import type { FormInst, UploadFileInfo } from "naive-ui";
import {
  PhotoIcon,
  InformationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  KeyIcon,
} from "@heroicons/vue/24/outline";
import { useUserStore } from "@/stores/user";
import services from "@/services";
import type { UpdateProfileData } from "@/services/UsersService";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const formData = ref<UpdateProfileData>({
  name: userStore.user?.name || "",
  email: userStore.user?.email || "",
  avatar: userStore.user?.avatar || "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const userInitials = computed(() => {
  if (!formData.value.name) return "?";
  return formData.value.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
});

const rules = {
  name: [
    {
      required: true,
      message: "Please enter your name",
      trigger: ["blur", "input"],
    },
    {
      min: 2,
      max: 50,
      message: "Name must be between 2 and 50 characters",
      trigger: ["blur", "input"],
    },
  ],
  email: [
    {
      required: true,
      message: "Please enter your email",
      trigger: ["blur", "input"],
    },
    {
      pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: "Please enter a valid email address",
      trigger: ["blur", "input"],
    },
  ],
  currentPassword: [
    {
      required: true,
      message: "Please enter your current password",
      trigger: ["blur", "input"],
    },
  ],
  newPassword: [
    {
      min: 6,
      message: "Password must be at least 6 characters long",
      trigger: ["blur", "input"],
    },
  ],
  confirmNewPassword: [
    {
      validator: (rule: any, value: string) => {
        return value === formData.value.newPassword;
      },
      message: "Passwords do not match",
      trigger: ["blur", "input"],
    },
  ],
};

const handleAvatarUpload = async ({ file }: { file: UploadFileInfo }) => {
  try {
    loading.value = true;
    const userService = services.UsersService();
    if (!userService) throw new Error("User service not initialized");
    if (!userStore.user?.id) throw new Error("User ID not found");

    const response: any = await userService.uploadAvatar(
      userStore.user.id,
      file.file as File
    );
    if (response?.data) {
      userStore.setUser(response.data);
      formData.value.avatar = response.data.avatar;
      message.success("Avatar uploaded successfully!");
    }
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    message.error(error?.response?.data?.message || "Failed to upload avatar");
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const userService = services.UsersService();
    if (!userService) throw new Error("User service not initialized");
    if (!userStore.user?.id) throw new Error("User ID not found");

    const userData: UpdateProfileData = {
      name: formData.value.name,
      email: formData.value.email,
      currentPassword: formData.value.currentPassword,
      ...(formData.value.newPassword && {
        newPassword: formData.value.newPassword,
      }),
    };

    const response: any = await userService.updateProfile(
      userStore.user.id,
      userData
    );
    if (response?.data) {
      userStore.setUser(response.data);
      message.success("Profile updated successfully!");
      formData.value.currentPassword = "";
      formData.value.newPassword = "";
      formData.value.confirmNewPassword = "";
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    message.error(error?.response?.data?.message || "Failed to update profile");
  } finally {
    loading.value = false;
  }
};
</script>
