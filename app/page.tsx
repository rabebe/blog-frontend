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
        const data = await apiFetch("/posts?featured=true") // optional featured filter
        setFeaturedPosts(data.slice(0, 3)) // show top 3 posts
      } catch (err) {
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-background font-serif text-foreground">


      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-5xl font-sans font-bold mb-6">Welcome to My Blog</h2>
        <p className="text-secondary text-lg leading-relaxed mb-6">
          Discover articles, tutorials, and insights on topics I love to write about.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-link text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Read Articles
        </Link>
      </section>

      {/* Featured Posts */}
      {loading ? (
        <p className="text-center text-secondary mt-12">Loading featured posts...</p>
      ) : featuredPosts.length > 0 ? (
        <section className="max-w-3xl mx-auto mt-16 space-y-8">
          <h3 className="text-2xl font-sans font-semibold mb-6">Featured Posts</h3>
          <ul className="space-y-6">
            {featuredPosts.map(post => (
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
        </section>
      ) : null}
    </div>
  )
}
