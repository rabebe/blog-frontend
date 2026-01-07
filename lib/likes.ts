import { apiFetch } from "./api"

export function likePost(postId: number) {
  return apiFetch(`/posts/${postId}/like`, { method: "POST" })
}

export function unlikePost(postId: number) {
  return apiFetch(`/posts/${postId}/like`, { method: "DELETE" })
}
