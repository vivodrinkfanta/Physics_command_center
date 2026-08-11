import { useEffect, useRef, type KeyboardEvent } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalDialog<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  initialFocus: () => HTMLElement | null,
) {
  const rootRef = useRef<T>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => initialFocus()?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      previouslyFocusedElement.current?.focus()
    }
  }, [open])

  const handleDialogKeyDown = (event: KeyboardEvent<T>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return true
    }

    if (event.key !== 'Tab') return false

    const focusableElements = rootRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
    if (!focusableElements?.length) return false

    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
      return true
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
      return true
    }

    return false
  }

  return { handleDialogKeyDown, rootRef }
}
