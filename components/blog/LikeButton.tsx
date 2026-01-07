"use client"

// Define props interface
interface LikeButtonProps {
  postId: number
  onLike: (postId: number) => Promise<void>
}

export default function LikeButton({ postId, onLike }: LikeButtonProps) {
  const handleClick = async () => {
    await onLike(postId)
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Like
    </button>
  )
}
