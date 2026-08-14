import { useEffect, useRef } from 'react'

interface ResetProgressConfirmationProps {
  confirmLabel: string
  description: string
  id: string
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export function ResetProgressConfirmation({
  confirmLabel,
  description,
  id,
  onCancel,
  onConfirm,
  title,
}: ResetProgressConfirmationProps) {
  const regionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const returnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
    regionRef.current?.focus()
    return () => {
      window.requestAnimationFrame(() => {
        if (returnTarget?.isConnected) returnTarget.focus()
      })
    }
  }, [])

  return (
    <section
      aria-describedby={`${id}-description`}
      aria-labelledby={`${id}-title`}
      className="reset-confirmation"
      ref={regionRef}
      role="region"
      tabIndex={-1}
    >
      <div>
        <strong id={`${id}-title`}>{title}</strong>
        <p id={`${id}-description`}>{description}</p>
      </div>
      <div>
        <button onClick={onCancel} type="button">Keep progress</button>
        <button className="is-destructive" onClick={onConfirm} type="button">{confirmLabel}</button>
      </div>
    </section>
  )
}
