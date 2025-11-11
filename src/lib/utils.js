/**
 * Utility function to merge class names
 */
export function cn(...classes) {
  return classes
    .filter((cls) => cls != null && cls !== "")
    .join(" ")
    .trim() || "";
}

