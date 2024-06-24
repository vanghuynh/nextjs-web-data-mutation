"use server";

import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { redirect } from "next/navigation";
import { uploadImage } from "../lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];
  if (!title || title.length === 0) {
    errors.push("Title is required.");
  }
  if (!content || content.length === 0) {
    errors.push("Content is required.");
  }
  if (!image || image.size === 0) {
    errors.push("Image is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Can not upload image");
  }

  await storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: 1,
  });
  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/feed", "layout");
}
