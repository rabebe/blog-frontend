"use client"

import { useEffect, useState, useCallback } from "react"
import { apiFetch } from "@/lib/api"

// Define the shape of a comment to satisfy TypeScript
interface Comment {
  id: number
  body: string
  post_id: number
  status: number
  user?: {
    name: string
  }
}

export default function AdminCommentList() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  // Memoize the fetch function to satisfy ESLint hooks rules
  const loadQueue = useCallback(async () => {
    try {
      setLoading(true)
      // Hits Rails: Admin::CommentsController#index
      const data = await apiFetch("/admin/comments")
      setComments(data)
    } catch (error) {
      console.error("Failed to load comment queue:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      // Determine HTTP method based on action
      const method = action === "approve" ? "PATCH" : "DELETE"
      const endpoint = `/admin/comments/${id}/${action}`

      // 1. Tell the Backend to update status to 1 or destroy
      await apiFetch(endpoint, { method })

      // 2. Update the Frontend UI: Filter out the comment that was just handled
      // This makes it "vanish" from the dashboard instantly
      setComments((prev) => prev.filter((c) => c.id !== id))
      
    } catch (error) {
      console.error(`Failed to ${action} comment:`, error)
      alert(`Error: Could not ${action} the comment.`)
    }
  }

  if (loading) return <div className="p-4 text-gray-500">Loading queue...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Pending Comments</h2>

      {comments.length === 0 ? (
        <p className="text-gray-500 italic">Everything is caught up! No pending comments.</p>
      ) : (
        <div className="grid gap-4">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                {/* ESLint safe quotes using entities */}
                <p className="text-gray-800 text-lg italic mb-1">
                  &ldquo;{comment.body}&rdquo;
                </p>
                <div className="text-xs text-gray-400 flex gap-2">
                  <span>Post ID: {comment.post_id}</span>
                  {comment.user && <span>• By: {comment.user.name}</span>}
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleAction(comment.id, "approve")}
                  className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(comment.id, "reject")}
                  className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}