import type { ReactNode } from 'react'

interface PageProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function Page({ title, subtitle, children }: PageProps) {
  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end gap-x-4 gap-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && (
          <span className="mb-1 rounded-full border-2 border-neutral-950 bg-lime-300 px-3 py-0.5 text-sm font-bold">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}
