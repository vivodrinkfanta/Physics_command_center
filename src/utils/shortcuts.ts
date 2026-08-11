interface ShortcutEvent {
  ctrlKey: boolean
  key: string
  metaKey: boolean
}

export function isPhysicsSearchShortcut(event: ShortcutEvent) {
  const key = event.key.toLowerCase()
  return (event.metaKey || event.ctrlKey) && (key === 'k' || key === 'f')
}
