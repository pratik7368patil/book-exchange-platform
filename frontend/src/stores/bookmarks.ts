import { defineStore } from "pinia";
import services from "@/services";
import { ref } from "vue";
import type { Bookmark } from "@/services/BookmarkService";
import { useUserStore } from "./user";

export const useBookmarkStore = defineStore("bookmarks", () => {
  const bookmarks = ref<Bookmark[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const userStore = useUserStore();

  const fetchUserBookmarks = async () => {
    if (!userStore.user?.id) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response: any = await services
        .BookmarkService()
        ?.getUserBookmarks(userStore.user.id);
      bookmarks.value = response?.data || [];
    } catch (err: any) {
      error.value = err.message || "Failed to fetch bookmarks";
      console.error("Error fetching bookmarks:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const toggleBookmark = async (bookId: string) => {
    if (!userStore.user?.id) return;

    try {
      const isBookmarked = bookmarks.value.some((b) => b.book.id === bookId);

      if (isBookmarked) {
        await services
          .BookmarkService()
          ?.deleteBookmark(userStore.user.id, bookId);
        bookmarks.value = bookmarks.value.filter((b) => b.book.id !== bookId);
      } else {
        const response: any = await services
          .BookmarkService()
          ?.createOrUpdateBookmark({
            userId: userStore.user.id,
            bookId,
            notes: "",
          });
        if (response?.data) {
          bookmarks.value.push(response.data);
        }
      }
    } catch (err: any) {
      error.value = err.message || "Failed to update bookmark";
      console.error("Error updating bookmark:", err);
    }
  };

  const isBookmarked = (bookId?: string) => {
    if (!bookId) return false;
    return bookmarks.value.some((bookmark) => bookmark.book.id === bookId);
  };

  return {
    bookmarks,
    isLoading,
    error,
    fetchUserBookmarks,
    toggleBookmark,
    isBookmarked,
  };
});
