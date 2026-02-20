import { describe, expect, it } from "vitest";
import { uploadAvatar } from "@/lib/utils/uploadAvatar";

describe("uploadAvatar", () => {
  it("rejects files larger than 5MB", async () => {
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large.png",
      { type: "image/png" }
    );

    const result = await uploadAvatar(largeFile, "user-123");

    expect(result.error).toBe("File size must be less than 5MB");
    expect(result.url).toBeUndefined();
  });

  it("rejects non-image files", async () => {
    const textFile = new File(["hello"], "file.txt", { type: "text/plain" });

    const result = await uploadAvatar(textFile, "user-123");

    expect(result.error).toContain("Must be an image");
    expect(result.url).toBeUndefined();
  });

  it("validates that a file is provided", async () => {
    const result = await uploadAvatar(null as any, "user-123");

    expect(result.error).toBeTruthy();
    expect(result.url).toBeUndefined();
  });
});
