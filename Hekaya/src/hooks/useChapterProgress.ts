import { useEffect, useState } from 'react'
import type { Chapter, ChapterProgress } from '../types/hekaya'

const STORAGE_KEY = 'hekaya_chapter_progress'

interface StoredChapterProgress {
  chapterProgress: unknown
  reflectedQuestionIds: unknown
}

interface RawChapterProgressItem {
  chapterId?: unknown
  viewed?: unknown
  viewedAt?: unknown
  xoGameCompleted?: unknown
  xoGameCompletedAt?: unknown
}

interface PersistedChapterProgress {
  chapterProgress: Array<{
    chapterId: string
    viewed: boolean
    viewedAt?: string
    xoGameCompleted?: boolean
    xoGameCompletedAt?: string
  }>
  reflectedQuestionIds: string[]
}

function toValidDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function normalizeChapterProgress(
  rawItems: unknown,
  validChapterIds: Set<string>,
): ChapterProgress[] {
  if (!Array.isArray(rawItems)) return []

  const byChapterId = new Map<string, ChapterProgress>()
  rawItems.forEach((rawItem) => {
    if (!rawItem || typeof rawItem !== 'object') return

    const item = rawItem as RawChapterProgressItem
    if (typeof item.chapterId !== 'string') return
    if (!validChapterIds.has(item.chapterId)) return

    const normalized: ChapterProgress = {
      chapterId: item.chapterId,
      viewed: Boolean(item.viewed),
      xoGameCompleted: Boolean(item.xoGameCompleted),
    }

    const viewedAt = toValidDate(item.viewedAt)
    if (viewedAt) normalized.viewedAt = viewedAt

    const xoGameCompletedAt = toValidDate(item.xoGameCompletedAt)
    if (xoGameCompletedAt) normalized.xoGameCompletedAt = xoGameCompletedAt

    byChapterId.set(item.chapterId, normalized)
  })

  return [...byChapterId.values()]
}

function normalizeQuestionIds(rawIds: unknown, validQuestionIds: Set<string>) {
  if (!Array.isArray(rawIds)) return []
  return rawIds.filter(
    (id): id is string => typeof id === 'string' && validQuestionIds.has(id),
  )
}

function loadProgress(validChapterIds: Set<string>, validQuestionIds: Set<string>) {
  const fallback: {
    chapterProgress: ChapterProgress[]
    reflectedQuestionIds: string[]
  } = {
    chapterProgress: [],
    reflectedQuestionIds: [],
  }

  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw) as unknown

    if (Array.isArray(parsed)) {
      return {
        chapterProgress: normalizeChapterProgress(parsed, validChapterIds),
        reflectedQuestionIds: [],
      }
    }

    if (!parsed || typeof parsed !== 'object') return fallback

    const stored = parsed as StoredChapterProgress
    return {
      chapterProgress: normalizeChapterProgress(
        stored.chapterProgress,
        validChapterIds,
      ),
      reflectedQuestionIds: normalizeQuestionIds(
        stored.reflectedQuestionIds,
        validQuestionIds,
      ),
    }
  } catch {
    return fallback
  }
}

export function useChapterProgress(chapters: Chapter[]) {
  const chapterIds = chapters.map((chapter) => chapter.id)
  const questionIds = chapters
    .map((chapter) => chapter.question?.id)
    .filter((id): id is string => Boolean(id))

  const validChapterIds = new Set(chapterIds)
  const validQuestionIds = new Set(questionIds)

  const [progress, setProgress] = useState<ChapterProgress[]>(() =>
    loadProgress(validChapterIds, validQuestionIds).chapterProgress,
  )
  const [reflectedQuestionIds, setReflectedQuestionIds] = useState<string[]>(() =>
    loadProgress(validChapterIds, validQuestionIds).reflectedQuestionIds,
  )

  useEffect(() => {
    setProgress((previous) =>
      previous.filter((item) => validChapterIds.has(item.chapterId)),
    )
    setReflectedQuestionIds((previous) =>
      previous.filter((id) => validQuestionIds.has(id)),
    )
  }, [chapters])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const payload: PersistedChapterProgress = {
      chapterProgress: progress.map((item) => ({
        chapterId: item.chapterId,
        viewed: item.viewed,
        viewedAt: item.viewedAt ? item.viewedAt.toISOString() : undefined,
        xoGameCompleted: item.xoGameCompleted,
        xoGameCompletedAt: item.xoGameCompletedAt
          ? item.xoGameCompletedAt.toISOString()
          : undefined,
      })),
      reflectedQuestionIds,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [progress, reflectedQuestionIds])

  const upsertProgress = (
    chapterId: string,
    updater: (current?: ChapterProgress) => ChapterProgress,
  ) => {
    setProgress((previous) => {
      const existing = previous.find((item) => item.chapterId === chapterId)
      const updated = updater(existing)
      if (existing) {
        return previous.map((item) =>
          item.chapterId === chapterId ? updated : item,
        )
      }
      return [...previous, updated]
    })
  }

  const markChapterViewed = (chapterId: string) => {
    if (!validChapterIds.has(chapterId)) return

    upsertProgress(chapterId, (existing) => ({
      chapterId,
      viewed: true,
      viewedAt: new Date(),
      xoGameCompleted: existing?.xoGameCompleted ?? false,
      xoGameCompletedAt: existing?.xoGameCompletedAt,
    }))
  }

  const markXOGameCompleted = (chapterId: string) => {
    if (!validChapterIds.has(chapterId)) return

    upsertProgress(chapterId, (existing) => ({
      chapterId,
      viewed: existing?.viewed ?? false,
      viewedAt: existing?.viewedAt,
      xoGameCompleted: true,
      xoGameCompletedAt: new Date(),
    }))
  }

  const markQuestionReflected = (questionId: string) => {
    if (!validQuestionIds.has(questionId)) return

    setReflectedQuestionIds((previous) =>
      previous.includes(questionId) ? previous : [...previous, questionId],
    )
  }

  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setProgress([])
    setReflectedQuestionIds([])
  }

  const getChapterProgress = (chapterId: string) =>
    progress.find((item) => item.chapterId === chapterId)

  const viewedChapterIds = progress
    .filter((item) => item.viewed)
    .map((item) => item.chapterId)
  const viewedSet = new Set(viewedChapterIds)
  const completionPercent =
    chapters.length === 0
      ? 0
      : Math.round((viewedChapterIds.length / chapters.length) * 100)
  const continueChapterId = chapterIds.find((id) => !viewedSet.has(id)) ?? chapterIds[0]

  const isChapterViewed = (chapterId: string) =>
    Boolean(getChapterProgress(chapterId)?.viewed)
  const isXOGameCompleted = (chapterId: string) =>
    Boolean(getChapterProgress(chapterId)?.xoGameCompleted)
  const isQuestionReflected = (questionId: string) =>
    reflectedQuestionIds.includes(questionId)

  return {
    progress,
    viewedChapterIds,
    reflectedQuestionIds,
    completionPercent,
    continueChapterId,
    markChapterViewed,
    markXOGameCompleted,
    markQuestionReflected,
    resetProgress,
    getChapterProgress,
    isChapterViewed,
    isXOGameCompleted,
    isQuestionReflected,
  }
}
