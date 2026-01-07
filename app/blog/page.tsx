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

export default function BlogPage() {
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-cardBorder">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Blog
          </h1>
          <p className="text-secondary text-lg max-w-2xl">
            Writing about ideas, experiments, and things I’m learning along the way.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        {loading ? (
          <p className="text-secondary text-center">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-secondary text-center">No posts yet.</p>
        ) : (
          <ul className="space-y-14">
            {posts.map((post) => (
              <li key={post.id} className="group">
                <Link href={`/blog/post/${post.id}`}>
                  <h2
                    className="font-sans text-2xl md:text-3xl font-semibold mb-3
                      group-hover:text-link transition-colors"
                  >
                    {post.title}
                  </h2>
                </Link>

                <p className="text-secondary leading-relaxed line-clamp-3 max-w-3xl">
                  {post.body}
                </p>

                <div className="mt-4">
                  <Link
                    href={`/blog/post/${post.id}`}
                    className="text-sm font-medium text-link hover:underline"
                  >
                    Read article →
                  </Link>
                </div>

                <div className="mt-10 border-b border-cardBorder" />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
