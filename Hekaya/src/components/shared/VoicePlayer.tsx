import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { HekayaLocale } from '../../types/hekaya'

interface VoicePlayerProps {
  src: string
  label?: string
  duration?: number
  locale: HekayaLocale
  className?: string
}

const ARABIC_DIGIT_FORMATTER = new Intl.NumberFormat('ar-EG', {
  useGrouping: false,
})

function formatTime(totalSeconds: number, locale: HekayaLocale) {
  const safeSeconds = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  const raw = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`

  if (locale !== 'ar') return raw

  return raw.replace(/\d/g, (digit) =>
    ARABIC_DIGIT_FORMATTER.format(Number(digit)),
  )
}

export function VoicePlayer({
  src,
  label,
  duration,
  locale,
  className,
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [resolvedDuration, setResolvedDuration] = useState(duration ?? 0)
  const [isReady, setIsReady] = useState(false)

  const copy =
    locale === 'ar'
      ? {
          play: 'تشغيل',
          pause: 'إيقاف',
          fallbackLabel: 'رسالة صوتية',
          loading: 'جارٍ التحميل...',
        }
      : {
          play: 'Play',
          pause: 'Pause',
          fallbackLabel: 'Voice Note',
          loading: 'Loading...',
        }

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setResolvedDuration(duration ?? 0)
    setIsReady(false)
  }, [duration, src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setResolvedDuration(audio.duration || duration || 0)
      setIsReady(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(audio.duration || 0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    if (audio.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [duration, src])

  const handleTogglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch {
      setIsPlaying(false)
    }
  }

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const maxDuration = resolvedDuration > 0 ? resolvedDuration : 1
  const currentValue = Math.min(currentTime, maxDuration)

  return (
    <div
      className={`rounded-2xl border border-[rgba(217,70,239,0.25)] bg-[rgba(22,10,38,0.55)] p-3 backdrop-blur-sm ${className ?? ''}`}
    >
      <audio ref={audioRef} src={src} preload="none" className="hidden" />

      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={isPlaying ? copy.pause : copy.play}
          onClick={handleTogglePlayback}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(251,191,36,0.45)] bg-[rgba(251,191,36,0.15)] text-[var(--hekaya-star-bright)] transition hover:bg-[rgba(251,191,36,0.24)]"
        >
          <span aria-hidden>{isPlaying ? '❚❚' : '▶'}</span>
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm text-[var(--hekaya-text-primary)]">
              {label ?? copy.fallbackLabel}
            </p>
            {!isReady ? (
              <span className="text-xs text-[var(--hekaya-text-muted)]">
                {copy.loading}
              </span>
            ) : null}
          </div>

          <input
            type="range"
            min={0}
            max={maxDuration}
            step={1}
            value={currentValue}
            onChange={handleSeek}
            disabled={resolvedDuration <= 0}
            className="hekaya-range w-full"
            aria-label={locale === 'ar' ? 'تقديم الصوت' : 'Seek audio'}
          />

          <div className="flex items-center justify-between text-xs text-[var(--hekaya-text-muted)]">
            <span>{formatTime(currentTime, locale)}</span>
            <span>{formatTime(resolvedDuration, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoicePlayer
