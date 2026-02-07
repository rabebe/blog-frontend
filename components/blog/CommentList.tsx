"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

interface Comment {
  id: number
  body: string
  created_at: string
  user?: {
    id: number
    name: string
  }
}

interface CommentListProps {
  postId: number
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // Read admin status from localStorage
  const isAdmin =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("user") || "{}")?.role === "admin"

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true)
        const data = await apiFetch(`/posts/${postId}/comments/`)
        setComments(data)
      } catch (err) {
        console.error("Failed to load approved comments:", err)
      } finally {
        setLoading(false)
      }
    }

    if (postId) loadComments()
  }, [postId])

  const handleDelete = async (commentId: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      await apiFetch(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      })

      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error(err)
      alert("Failed to delete comment")
    }
  }

  if (loading) {
    return <div className="text-gray-500 animate-pulse">Loading discussion...</div>
  }

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">
        Discussion ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                {comment.user?.name?.charAt(0) || "A"}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {comment.user?.name || "Anonymous User"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* ADMIN DELETE BUTTON */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
