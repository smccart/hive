import { Highlight, themes } from 'prism-react-renderer'

interface Props {
  children: string
  className?: string
}

export default function CodeBlock({ children, className }: Props) {
  const language = (className?.replace('language-', '') ?? 'text') as Parameters<typeof Highlight>[0]['language']

  return (
    <Highlight theme={themes.nightOwl} code={children.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={style}
          className="overflow-x-auto rounded-lg border border-neutral-800 p-4 text-sm my-4 font-mono leading-relaxed"
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
