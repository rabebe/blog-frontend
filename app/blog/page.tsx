"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

interface Post {
  id: number
  title: string
  body: string
  user_id: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await apiFetch("/posts")
        setPosts(data)
      } catch (err) {
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8 font-serif text-foreground">
      {/* Header */}
      <header className="mb-12 flex justify-between items-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-sans font-extrabold tracking-tight">My Blog</h1>
        <nav className="flex gap-6 text-link font-medium">
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto">
        {loading ? (
          <p className="text-secondary">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-secondary">No posts yet.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map(post => (
              <li
                key={post.id}
                className="p-6 rounded-xl bg-card border border-cardBorder shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link
                  href={`/blog/post/${post.id}`}
                  className="text-2xl font-sans text-foreground hover:text-link transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-secondary mt-3 line-clamp-3 leading-relaxed text-base">
                  {post.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
