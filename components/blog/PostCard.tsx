"use client"

// Define props interface
interface PostCardProps {
  post: {
    id: number
    title: string
    body: string
    user_id?: number
    created_at?: string
    updated_at?: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="post-card border rounded p-4 shadow-md">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p>{post.body}</p>
    </div>
  )
}
