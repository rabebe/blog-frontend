"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor, { Post } from "@/components/admin/PostEditor";

interface Props {
  params: { id: string };
}

export default function EditPost({ params }: Props) {
  const { id } = params;
  const router = useRouter();

  const [post, setPost] = useState<Post>({ id: Number(id), title: "", body: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();

        setPost({ id: data.id, title: data.title, body: data.body });
        setLoading(false);
      } catch {
        alert("Could not load post data.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading post data...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      {/* Reuse PostEditor for editing */}
      <PostEditor
        post={post}
        onClose={() => router.push("/admin/posts")}
      />
    </div>
  );
}
