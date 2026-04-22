import type { SVGProps } from 'react'

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12.08 4C7.64 4 4 7.55 4 11.98c0 1.44.39 2.84 1.12 4.07L4 20l4.1-1.07a8.17 8.17 0 0 0 3.98 1.03h.01c4.44 0 8.08-3.55 8.08-7.98C20.17 7.55 16.53 4 12.08 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.12 8.84c-.2-.45-.41-.46-.6-.47h-.51c-.18 0-.47.07-.72.35-.25.28-.95.93-.95 2.28 0 1.35.97 2.65 1.1 2.83.13.18 1.87 2.98 4.63 4.05 2.29.9 2.77.72 3.27.67.5-.05 1.61-.66 1.84-1.3.23-.64.23-1.18.16-1.3-.07-.12-.27-.2-.57-.35s-1.76-.88-2.03-.98c-.27-.1-.47-.15-.67.15-.2.3-.76.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.7-1.78-.98-2.39Z"
        fill="currentColor"
      />
    </svg>
  )
}
