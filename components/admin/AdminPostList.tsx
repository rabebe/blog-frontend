"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import PostEditor from "./PostEditor"
import { useRouter } from "next/navigation"

interface Post {
  id: number
  title: string
  body: string
}

export default function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  
  // 🔥 Safeguard State: Stores the ID of the post currently being "confirmed"
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    apiFetch("/posts")
      .then(setPosts)
      .catch(console.error)
  }, [])

  const deletePost = async (id: number) => {
    // 1. Safeguard: If this is the first click, don't delete yet
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      // Auto-reset if they don't click again within 4 seconds
      setTimeout(() => setConfirmDeleteId(null), 4000)
      return
    }

    // 2. Second click: Execute deletion
    try {
      await apiFetch(`/posts/${id}`, {
        method: "DELETE",
      })

      setPosts((prev) => prev.filter((p) => p.id !== id))
      setConfirmDeleteId(null)
      router.refresh() 
    } catch {
      alert("Failed to delete post")
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Posts</h2>
        <button
          onClick={() => setEditingPost({ id: 0, title: "", body: "" })}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
        >
          + Create New Post
        </button>
      </div>

      {editingPost && (
        <PostEditor
          post={editingPost}
          onClose={() => {
            setEditingPost(null)
            // Re-fetch posts after closing editor in case one was added/edited
            apiFetch("/posts").then(setPosts)
          }}
        />
      )}

      {/* 🔥 Empty State Logic */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No posts found. Time to write something great!</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 bg-white rounded-xl shadow-sm border border-gray-100">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">{post.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1 text-sm bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                >
                  Edit
                </button>
                
                {/* 🔥 Safeguard Delete Button UI */}
                <button
                  onClick={() => deletePost(post.id)}
                  className={`px-3 py-1 text-sm rounded border transition-all ${
                    confirmDeleteId === post.id
                      ? "bg-red-600 text-white border-red-700 animate-pulse"
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  }`}
                >
                  {confirmDeleteId === post.id ? "Confirm Delete?" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}