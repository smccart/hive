import type { ReactNode } from 'react'

// Wraps MDX content with prose styling.
// MDX files from @mdx-js/rollup compile to plain React components,
// so we just need a styled container div.
export function MDXProvider({ children }: { children: ReactNode }) {
  return <div className="prose">{children}</div>
}
