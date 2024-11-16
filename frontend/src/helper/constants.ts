// Book Genre Options
export const genreOptions = [
  { label: "Fiction", value: "fiction" },
  { label: "Non-Fiction", value: "non-fiction" },
  { label: "Mystery", value: "mystery" },
  { label: "Science Fiction", value: "sci-fi" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Romance", value: "romance" },
  { label: "Thriller", value: "thriller" },
  { label: "Horror", value: "horror" },
  { label: "Biography", value: "biography" },
  { label: "History", value: "history" },
  { label: "Science", value: "science" },
  { label: "Technology", value: "technology" },
  { label: "Self-Help", value: "self-help" },
];

// Book Condition Options
export const conditionOptions = [
  { label: "New", value: "new" },
  { label: "Like New", value: "like-new" },
  { label: "Very Good", value: "very-good" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];

// Book Status Options
export const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Exchanged", value: "exchanged" },
];

// Naive UI Theme Overrides
export const inputThemeOverrides = {
  borderHover: "#4F46E5",
  borderFocus: "#4F46E5",
  boxShadowFocus: "0 0 0 2px rgba(79, 70, 229, 0.2)",
  textColor: "#374151",
  placeholderColor: "#9CA3AF",
  borderError: "#EF4444",
  loadingColor: "#4F46E5",
};

export const selectThemeOverrides = {
  peers: {
    InternalSelection: {
      borderHover: "#4F46E5",
      borderFocus: "#4F46E5",
      textColor: "#374151",
      placeholderColor: "#9CA3AF",
      boxShadowFocus: "0 0 0 2px rgba(79, 70, 229, 0.2)",
    },
    InternalSelectMenu: {
      optionTextColor: "#374151",
      optionTextColorActive: "#4F46E5",
      optionTextColorPressed: "#4F46E5",
      optionCheckColor: "#4F46E5",
      optionColorPending: "rgba(79, 70, 229, 0.1)",
      optionColorActive: "rgba(79, 70, 229, 0.1)",
      color: "white",
    },
  },
};