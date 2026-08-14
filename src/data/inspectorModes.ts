export const inspectorModes = [
  { id: 'simulate', label: 'Simulate' },
  { id: 'explain', label: 'Explain' },
  { id: 'rearrange', label: 'Rearrange' },
  { id: 'units', label: 'Units' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'graph', label: 'Graph' },
  { id: 'example', label: 'Example' },
  { id: 'practice', label: 'Practice' },
  { id: 'related', label: 'Related' },
] as const

export type InspectorModeId = (typeof inspectorModes)[number]['id']
