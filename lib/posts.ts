import { apiFetch } from "./api"

export function getPosts(page = 1) {
  return apiFetch(`/posts?page=${page}`)
}

export function getPost(id: string) {
  return apiFetch(`/posts/${id}`)
}
