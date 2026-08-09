interface LabMarkProps {
  size?: number
}

export function LabMark({ size = 36 }: LabMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className="lab-mark"
      height={size}
      viewBox="0 0 36 36"
      width={size}
    >
      <rect height="35" rx="10" width="35" x="0.5" y="0.5" />
      <circle cx="18" cy="18" r="3.25" />
      <ellipse cx="18" cy="18" rx="11" ry="4.8" />
      <ellipse cx="18" cy="18" rx="11" ry="4.8" transform="rotate(60 18 18)" />
      <ellipse cx="18" cy="18" rx="11" ry="4.8" transform="rotate(120 18 18)" />
    </svg>
  )
}

