import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export interface UploadAvatarResult {
  url?: string;
  error?: string;
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadAvatarResult> {
  // Validate file exists
  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must be less than 5MB" };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Must be an image file (JPEG, PNG, GIF, or WebP)" };
  }

  try {
    const supabase = createClient();

    // Create unique filename: userId/timestamp-originalname
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}-${file.name}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, file, {
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload avatar" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filename);

    return { url: publicUrl };
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return { error: "An error occurred while uploading your avatar" };
  }
}
