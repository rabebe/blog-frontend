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
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await apiFetch("/posts?featured=true")
        setFeaturedPosts(data.slice(0, 3))
      } catch (err) {
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-28 text-center">
          <h1 className="font-sans text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Thoughts, stories & ideas
          </h1>
          <p className="text-lg md:text-xl text-secondary leading-relaxed mb-10">
            Articles, tutorials, and reflections on topics I enjoy exploring.
          </p>

          <Link
            href="/blog"
            className="btn inline-flex items-center justify-center rounded-full
              bg-black text-white px-8 py-3 text-sm font-medium
              hover:bg-gray-900 transition"
          >
            Explore the blog →
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-sans font-semibold">
            Featured posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-secondary hover:text-foreground transition"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-secondary text-center py-16">
            Loading featured posts…
          </p>
        ) : featuredPosts.length > 0 ? (
          <ul className="grid gap-8 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <li
                key={post.id}
                className="group rounded-2xl border border-cardBorder
                  bg-card p-6 transition
                  hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/blog/post/${post.id}`}>
                  <h3
                    className="font-sans text-xl font-semibold mb-3
                      group-hover:text-link transition-colors"
                  >
                    {post.title}
                  </h3>
                </Link>

                <p className="text-secondary text-sm leading-relaxed line-clamp-4">
                  {post.body}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/blog/post/${post.id}`}
                    className="text-sm font-medium text-link hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-secondary text-center py-16">
            No featured posts yet.
          </p>
        )}
      </section>
    </div>
  )
}
