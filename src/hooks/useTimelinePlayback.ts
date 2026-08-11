import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

export function useTimelinePlayback<T extends { time: number }>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  timeLimit: number,
  playbackRate = 1,
) {
  const [isPlaying, setIsPlaying] = useState(false)
  const previousFrame = useRef<number | null>(null)

  useEffect(() => {
    if (!isPlaying) {
      previousFrame.current = null
      return
    }
    let animationFrame = 0
    const update = (timestamp: number) => {
      if (previousFrame.current === null) previousFrame.current = timestamp
      const elapsed = Math.min((timestamp - previousFrame.current) / 1000, 0.05)
      previousFrame.current = timestamp
      setState((current) => ({
        ...current,
        time: Math.min(current.time + elapsed * playbackRate, timeLimit),
      }))
      animationFrame = requestAnimationFrame(update)
    }
    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPlaying, playbackRate, setState, timeLimit])

  useEffect(() => {
    if (state.time >= timeLimit) setIsPlaying(false)
  }, [state.time, timeLimit])

  const play = () => {
    if (state.time >= timeLimit) setState((current) => ({ ...current, time: 0 }))
    setIsPlaying(true)
  }
  const reset = () => {
    setIsPlaying(false)
    setState((current) => ({ ...current, time: 0 }))
  }
  const scrub = (time: number) => {
    setIsPlaying(false)
    setState((current) => ({ ...current, time }))
  }

  return { isPlaying, play, reset, scrub, setIsPlaying }
}
