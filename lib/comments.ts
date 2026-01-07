import { apiFetch } from "./api"

export function createComment(postId: number, content: string) {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment: { content } }),
  })
}
