import type { ReactNode } from 'react'

interface PageProps {
  title: string
  children: ReactNode
}

export function Page({ title, children }: PageProps) {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">{title}</h1>
      {children}
    </section>
  )
}
