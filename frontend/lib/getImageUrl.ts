import { BASE_URL } from "@/lib/baseUrl";

export function getImageUrl(imagePath?: string) {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith("/uploads/")) {
    return `${BASE_URL}${imagePath}`;
  }
  return imagePath;
}
