"use client"

import PostEditor, { Post } from "@/components/admin/PostEditor"

export default function NewPostPage() {
  const emptyPost: Post = { title: "", body: "" }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <PostEditor post={emptyPost} />
    </main>
  )
}
