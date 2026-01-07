"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import CommentForm from "@/components/blog/CommentForm"
import CommentList from "@/components/blog/CommentList"

interface Comment {
  id: number
  body: string
  user_id: number
  created_at: string
  status: number
}

interface Post {
  id: number
  title: string
  body: string
  user_id: number
  created_at: string
  updated_at: string
  likes_count: number
  user_liked?: boolean
  comments?: Comment[]
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Lazy initialize auth state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  })

  // Sync auth state if login happens elsewhere (like Navbar)
  const checkAuth = useCallback(() => {
    setIsLoggedIn(!!localStorage.getItem("token"))
  }, [])


  useEffect(() => {
    window.addEventListener("authChange", checkAuth)
    
    const fetchPost = async () => {
      try {
        const data: Post = await apiFetch(`/posts/${postId}`)
        setPost(data)
        setLiked(data.user_liked || false)
      } catch (err) {
        console.error(err)
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    if (postId) fetchPost()
    
    return () => window.removeEventListener("authChange", checkAuth)
  }, [postId, checkAuth])

  const handleLike = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push(`/login?redirect=/blog/post/${postId}`)
      return
    }

    const method = liked ? "DELETE" : "POST"
    try {
      await apiFetch(`/posts/${postId}/like`, { method })
      setPost((prev) =>
        prev ? { ...prev, likes_count: prev.likes_count + (liked ? -1 : 1) } : prev
      )
      setLiked(!liked)
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleComment = async ({ postId, body }: { postId: number; body: string }) => {
    if (!body.trim()) {
      alert("Comment cannot be empty!"); // <-- popup
      return;
    }
    const token = localStorage.getItem("token")
    if (!token) {
      router.push(`/login?redirect=/blog/post/${postId}`)
      return
    }

    try {
      await apiFetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment: { body } }),
      })
      
      alert("Thanks! Your comment has been submitted for moderation. ✨")
      setRefreshKey(prev => prev + 1)
      
    } catch (err) {
      console.error("Failed to submit comment:", err)
      alert("Failed to post comment. Please try again.")
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto p-8 text-center text-gray-500 italic">
      Loading post...
    </div>
  )
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-8 text-center text-red-600 font-medium">
      {error}
    </div>
  )
  
  if (!post) return (
    <div className="max-w-3xl mx-auto p-8 text-center text-gray-500">
      Post not found.
    </div>
  )


  return (
    <div className="post-container max-w-3xl mx-auto p-6 md:p-12 bg-white min-h-screen">
      <header className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
              {post.user_id}
            </div>
            <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
              liked 
                ? "bg-red-50 text-red-600 border border-red-100 shadow-sm" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{liked ? "❤️" : "🤍"}</span>
            <span>{post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}</span>
          </button>
        </div>
      </header>

      <article className="prose lg:prose-xl max-w-none mb-12">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
          {post.body}
        </p>
      </article>

      <hr className="border-gray-100 mb-12" />

      <section className="mb-16">
        <CommentList
          postId={post.id}
          key={refreshKey}
        />
      </section>

      <section className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Leave a response</h3>
        {isLoggedIn ? (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Share your thoughts with the community. (Comments are moderated).
            </p>
            <CommentForm postId={post.id} onComment={handleComment} />
          </>
        ) : (
          <div className="text-center py-4">
             <p className="text-gray-500 mb-4">You must be logged in to leave a comment.</p>
             <button 
                onClick={() => router.push(`/login?redirect=/blog/post/${postId}`)}
                className="text-blue-600 font-bold hover:underline"
              >
                Login to Comment →
              </button>
          </div>
        )}
      </section>
      
      <footer className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
        <button 
          onClick={() => router.push('/')}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Blog
        </button>
      </footer>
    </div>
  )
}
