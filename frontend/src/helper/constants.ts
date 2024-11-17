// Book Genre Options
export const genreOptions = [
  { label: "Fiction", value: "fiction" },
  { label: "Non-Fiction", value: "non-fiction" },
  { label: "Mystery", value: "mystery" },
  { label: "Science Fiction", value: "sci-fi" },
  { label: "Romance", value: "romance" },
  { label: "Thriller", value: "thriller" },
  { label: "Horror", value: "horror" },
  { label: "Biography", value: "biography" },
  { label: "History", value: "history" },
  { label: "Other", value: "other" },
];

// Book Condition Options
export const conditionOptions = [
  { label: "New", value: "new" },
  { label: "Like New", value: "like-new" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];

// Book Status Options
export const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Borrowed", value: "borrowed" },
  { label: "Reserved", value: "reserved" },
];

// Naive UI Theme Overrides
import { GlobalThemeOverrides } from "naive-ui";

export const THEME_OVERRIDES: GlobalThemeOverrides = {
  common: {
    primaryColor: "#4F46E5",
    primaryColorHover: "#4338CA",
    primaryColorPressed: "#3730A3",
    primaryColorSuppl: "#818CF8",
  },
  Button: {
    textColor: "#4F46E5",
    textColorPrimary: "white",
    textColorHoverPrimary: "white",
    textColorPressedPrimary: "white",
    textColorFocusPrimary: "white",
    textColorDisabled: "white",
    rippleColor: "rgba(79, 70, 229, 0.2)",
    colorPrimary: "#4F46E5",
    colorHoverPrimary: "#4338CA",
    colorPressedPrimary: "#3730A3",
    colorFocusPrimary: "#4F46E5",
    colorDisabled: "#818CF8",
    borderPrimary: "#4F46E5",
    borderHoverPrimary: "#4338CA",
    borderPressedPrimary: "#3730A3",
    borderFocusPrimary: "#4F46E5",
    borderDisabled: "#818CF8",
  },
  Card: {
    borderRadius: "0.5rem",
    textColor: "#374151",
    titleTextColor: "#1F2937",
    borderColor: "#E5E7EB",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  Tag: {
    borderRadius: "0.375rem",
  },
} as const;

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
