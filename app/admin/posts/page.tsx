import { ReactNode } from "react"

interface AdminPostsPageProps {
  children?: ReactNode
}

export default function AdminPostsPage({ children }: AdminPostsPageProps) {
  return <div>{children}</div>
}
