"use client"

import { useState } from "react"

// Define props interface
interface CommentFormProps {
  postId: number
  onComment: (comment: { postId: number; body: string }) => Promise<void>
}

export default function CommentForm({ postId, onComment }: CommentFormProps) {
  const [body, setBody] = useState("")


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!body.trim()) {
      alert("Comment cannot be empty!")
      return
    }

    try {
      await onComment({ postId, body })
      setBody("")
    } catch (err) {
      console.error(err)
      alert("Failed to submit comment. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        className="border p-2 w-full"
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        Comment
      </button>
    </form>
  )
}
