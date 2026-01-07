"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export interface Post {
  id?: number
  title: string
  body: string
}

interface Props {
  post: Post
  onClose?: () => void
}

export default function PostEditor({ post, onClose }: Props) {
  const [title, setTitle] = useState(post.title)
  const [body, setBody] = useState(post.body)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      window.alert("Title and Body cannot be empty!")
      return
    }

    setLoading(true)
    try {
      if (post.id) {
        // Update existing post
        await apiFetch(`/posts/${post.id}`, {
          method: "PUT",
          body: JSON.stringify({ post: { title, body } }),
        })
        window.alert("Post updated successfully!")
      } else {
        // Create new post
        await apiFetch("/posts", {
          method: "POST",
          body: JSON.stringify({ post: { title, body } }),
        })
        window.alert("Post created successfully!")
      }

      if (onClose) {
        onClose() // Close modal / form if provided
      } else if (!post.id) {
        router.push("/admin/posts") // Navigate to posts list if new post
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        window.alert(err.message)
      } else {
        window.alert("Failed to save post.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 mb-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-2">
        {post.id ? "Edit Post" : "New Post"}
      </h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-3 py-1 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
