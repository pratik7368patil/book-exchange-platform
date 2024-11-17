<template>
  <n-form
    ref="formRef"
    :model="formData"
    label-placement="top"
    class="space-y-3"
    @submit.prevent="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <n-form-item label="Book Title" class="col-span-full">
        <n-input
          v-model:value="formData.title"
          type="text"
          placeholder="Enter book title"
          required
          :theme-overrides="inputThemeOverrides"
        />
      </n-form-item>

      <n-form-item label="Author" class="col-span-full">
        <n-input
          v-model:value="formData.author"
          type="text"
          placeholder="Enter author name"
          required
          :theme-overrides="inputThemeOverrides"
        />
      </n-form-item>

      <n-form-item label="Genre">
        <n-select
          v-model:value="formData.genre"
          :options="genreOptions"
          placeholder="Select genre"
          required
          :theme-overrides="selectThemeOverrides"
        />
      </n-form-item>

      <n-form-item label="Condition">
        <n-select
          v-model:value="formData.condition"
          :options="conditionOptions"
          placeholder="Select book condition"
          required
          :theme-overrides="selectThemeOverrides"
        />
      </n-form-item>

      <n-form-item label="Availability Status" class="col-span-full">
        <n-select
          v-model:value="formData.status"
          :options="statusOptions"
          placeholder="Select availability status"
          required
          :theme-overrides="selectThemeOverrides"
        />
      </n-form-item>

      <n-form-item label="Book Cover Image" class="col-span-full">
        <div class="flex items-center gap-3">
          <div
            class="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
          >
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Book Cover Preview"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              <PhotoIcon class="w-5 h-5" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <n-upload
              accept="image/*"
              :max="1"
              @change="handleImageChange"
              :default-upload="false"
            >
              <n-button
                secondary
                type="primary"
                class="flex items-center gap-1"
              >
                <PhotoIcon class="w-4 h-4" />
                Select Image
              </n-button>
            </n-upload>
            <p class="text-xs text-gray-500">JPG, PNG or GIF (MAX. 5MB)</p>
          </div>
        </div>
      </n-form-item>
    </div>

    <div class="mt-4">
      <n-button
        type="primary"
        block
        attr-type="submit"
        :loading="isLoading"
        :disabled="!isFormValid"
        class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
        :theme-overrides="{
          textColor: 'white',
          color: '#4F46E5',
          colorHover: '#4338CA',
          colorPressed: '#3730A3',
          colorFocus: '#4F46E5',
          colorDisabled: '#818CF8',
          textColorDisabled: 'white',
          borderFocus: '#4F46E5',
          rippleColor: 'rgba(79, 70, 229, 0.2)',
        }"
      >
        {{ submitButtonText }}
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NUpload,
  FormInst,
  useMessage,
} from "naive-ui";
import type { UploadFileInfo } from "naive-ui";
import { PhotoIcon } from "@heroicons/vue/24/outline";
import { BooksServiceInstance } from "@/services";
import type { Book } from "@/services/BooksService";
import {
  genreOptions,
  conditionOptions,
  statusOptions,
  inputThemeOverrides,
  selectThemeOverrides,
} from "../../helper/constants";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
  initialData?: Partial<Book>;
  isLoading?: boolean;
  submitButtonText?: string;
}>();

const emit = defineEmits<{
  (e: "submit", data: Partial<Book>): void;
}>();

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const imagePreview = ref("");

// Form data
const formData = ref({
  title: "",
  author: "",
  genre: "",
  condition: "",
  status: "",
  imageUrl: "",
  description: "",
  owner: useUserStore().user?.id,
});

// Watch for initialData changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...formData.value, ...newData };
      imagePreview.value = newData.imageUrl || "";
    }
  },
  { immediate: true }
);

// Handle image change
const handleImageChange = async (options: { file: UploadFileInfo }) => {
  try {
    const { file } = options;
    const response: any = await BooksServiceInstance?.uploadBookImage(
      file.file as File
    );
    if (response.data?.url) {
      formData.value.imageUrl = response.data?.url;
      imagePreview.value = response.data?.url;
      message.success("Image uploaded successfully");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    message.error("Failed to upload image");
  }
};

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.title &&
    formData.value.author &&
    formData.value.genre &&
    formData.value.condition &&
    formData.value.status
  );
});

// Handle form submission
const handleSubmit = () => {
  if (!isFormValid.value) return;
  emit("submit", formData.value);
};
</script>
