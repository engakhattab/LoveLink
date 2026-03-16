import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Chapter, HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

type CellValue = null | 'player' | 'opponent'
type Board = CellValue[]
type ChapterXOStage = 'intro' | 'playing' | 'won' | 'lost'

interface ChapterXOGameProps {
  config: NonNullable<Chapter['xoGameLock']>
  onWin: () => void
  locale: HekayaLocale
}

interface ConfettiPiece {
  id: number
  angle: number
  distance: number
  duration: number
  delay: number
  size: number
  color: string
}

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const CONFETTI: ConfettiPiece[] = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  angle: (360 / 24) * index,
  distance: 68 + ((index * 13) % 44),
  duration: 0.9 + (index % 4) * 0.2,
  delay: (index % 5) * 0.03,
  size: 5 + (index % 3) * 2,
  color:
    index % 2 === 0
      ? 'rgba(217, 70, 239, 0.95)'
      : 'rgba(251, 191, 36, 0.92)',
}))

const TRANSITION_PARTICLES = [
  { left: '14%', top: '28%', glyph: '❤', delay: 0.1 },
  { left: '26%', top: '62%', glyph: '✦', delay: 0.45 },
  { left: '76%', top: '31%', glyph: '❤', delay: 0.3 },
  { left: '86%', top: '63%', glyph: '✦', delay: 0.65 },
  { left: '52%', top: '18%', glyph: '❤', delay: 0.2 },
]

function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => null)
}

function findWinningLine(board: Board, target: Exclude<CellValue, null>) {
  for (const line of WIN_LINES) {
    if (line.every((index) => board[index] === target)) return line
  }
  return null
}

function findThreatCells(board: Board) {
  const threats = new Set<number>()
  for (const line of WIN_LINES) {
    const playerCount = line.filter((index) => board[index] === 'player').length
    const opponentCount = line.filter((index) => board[index] === 'opponent').length
    const empty = line.filter((index) => board[index] === null)
    if (playerCount === 2 && opponentCount === 0 && empty.length === 1) {
      threats.add(empty[0]!)
    }
  }
  return [...threats]
}

function findStrongestPlayerLine(board: Board): number[] | null {
  let strongest: number[] | null = null
  let maxCount = -1

  for (const line of WIN_LINES) {
    const playerCount = line.filter((index) => board[index] === 'player').length
    const opponentCount = line.filter((index) => board[index] === 'opponent').length
    if (opponentCount > 0) continue
    if (playerCount > maxCount) {
      maxCount = playerCount
      strongest = line
    }
  }
  return strongest
}

function chooseIntentionalLosingMove(board: Board) {
  const empty = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index >= 0)
  if (empty.length === 0) return null

  let candidates = [...empty]
  const threats = findThreatCells(board)
  if (threats.length > 0) {
    const withoutBlocking = candidates.filter((index) => !threats.includes(index))
    if (withoutBlocking.length > 0) candidates = withoutBlocking
  }

  const strongest = findStrongestPlayerLine(board)
  if (strongest) {
    const awayFromLine = candidates.filter((index) => !strongest.includes(index))
    if (awayFromLine.length > 0) candidates = awayFromLine
  }

  const noWinForOpponent = candidates.filter((index) => {
    const next = [...board]
    next[index] = 'opponent'
    return !findWinningLine(next, 'opponent')
  })
  if (noWinForOpponent.length > 0) candidates = noWinForOpponent

  const pick = (board.filter(Boolean).length * 5 + candidates.length) % candidates.length
  return candidates[pick] ?? candidates[0] ?? null
}

function chooseStandardMove(board: Board) {
  const empty = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index >= 0)
  if (empty.length === 0) return null

  for (const index of empty) {
    const next = [...board]
    next[index] = 'opponent'
    if (findWinningLine(next, 'opponent')) return index
  }

  const threats = findThreatCells(board)
  if (threats.length > 0) return threats[0]!

  if (board[4] === null) return 4
  const corners = [0, 2, 6, 8].filter((index) => board[index] === null)
  if (corners.length > 0) return corners[0]!
  return empty[0]!
}

function chooseOpponentMove(board: Board, autoWinMode: boolean) {
  return autoWinMode ? chooseIntentionalLosingMove(board) : chooseStandardMove(board)
}

function forcePlayerWinBoard(board: Board) {
  const existingWin = findWinningLine(board, 'player')
  if (existingWin) {
    return { board, line: existingWin }
  }

  let bestLine: number[] | null = null
  let bestCount = -1

  for (const line of WIN_LINES) {
    const opponentCount = line.filter((index) => board[index] === 'opponent').length
    if (opponentCount > 0) continue

    const playerCount = line.filter((index) => board[index] === 'player').length
    if (playerCount > bestCount) {
      bestCount = playerCount
      bestLine = line
    }
  }

  if (!bestLine) {
    return { board, line: null }
  }

  const forced = [...board]
  bestLine.forEach((index) => {
    if (forced[index] === null) forced[index] = 'player'
  })

  return { board: forced, line: bestLine }
}

export function ChapterXOGame({ config, onWin, locale }: ChapterXOGameProps) {
  const maxMoves = Math.max(1, config.maxMoves || 5)
  const [stage, setStage] = useState<ChapterXOStage>('intro')
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [resultMessage, setResultMessage] = useState('')
  const [showTransition, setShowTransition] = useState(false)

  const aiTimeoutRef = useRef<number | null>(null)
  const completeTimeoutRef = useRef<number | null>(null)
  const stageRef = useRef(stage)

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current !== null) window.clearTimeout(aiTimeoutRef.current)
      if (completeTimeoutRef.current !== null) window.clearTimeout(completeTimeoutRef.current)
    }
  }, [])

  const copy =
    locale === 'ar'
      ? {
          start: 'ابدئي اللعبة',
          turnYou: 'دورك',
          turnAI: 'دور اللعبة',
          won: 'فزتي! 🎉',
          lost: 'المرة دي خسرنا... جربي تاني ✨',
          draw: 'تعادل... جربي مرة تانية 🌙',
          retry: 'إعادة اللعبة',
        }
      : {
          start: 'Start Game',
          turnYou: 'Your Turn',
          turnAI: 'Game Turn',
          won: 'You won! 🎉',
          lost: 'Not this round... try again ✨',
          draw: 'Draw... try again 🌙',
          retry: 'Replay',
        }

  const resetGame = () => {
    if (aiTimeoutRef.current !== null) window.clearTimeout(aiTimeoutRef.current)
    if (completeTimeoutRef.current !== null) window.clearTimeout(completeTimeoutRef.current)
    setBoard(createEmptyBoard())
    setWinningLine(null)
    setResultMessage('')
    setShowTransition(false)
    setIsPlayerTurn(true)
    setStage('playing')
  }

  const scheduleOpponentMove = () => {
    if (aiTimeoutRef.current !== null) {
      window.clearTimeout(aiTimeoutRef.current)
    }

    aiTimeoutRef.current = window.setTimeout(() => {
      setBoard((currentBoard) => {
        if (stageRef.current !== 'playing') return currentBoard

        const move = chooseOpponentMove(currentBoard, config.autoWinMode)
        if (move === null) {
          setStage('lost')
          setIsPlayerTurn(false)
          setResultMessage(copy.draw)
          return currentBoard
        }

        const next = [...currentBoard]
        next[move] = 'opponent'
        const opponentLine = findWinningLine(next, 'opponent')

        if (opponentLine) {
          setWinningLine(opponentLine)
          setStage('lost')
          setIsPlayerTurn(false)
          setResultMessage(copy.lost)
          return next
        }

        if (!next.includes(null)) {
          setStage('lost')
          setIsPlayerTurn(false)
          setResultMessage(copy.draw)
          return next
        }

        setIsPlayerTurn(true)
        return next
      })
    }, 540)
  }

  const handlePlayerMove = (index: number) => {
    if (stage !== 'playing') return
    if (!isPlayerTurn) return

    setBoard((currentBoard) => {
      if (currentBoard[index] !== null) return currentBoard

        const next = [...currentBoard]
        next[index] = 'player'
        const playerMoves = next.filter((cell) => cell === 'player').length
        const playerLine = findWinningLine(next, 'player')

        if (playerLine) {
          setWinningLine(playerLine)
          setStage('won')
        setIsPlayerTurn(false)
        setResultMessage(copy.won)
        setShowTransition(true)
        completeTimeoutRef.current = window.setTimeout(() => {
          onWin()
        }, config.transitionDuration || 3500)
          return next
        }

        if (config.autoWinMode && playerMoves >= maxMoves) {
          const forcedWin = forcePlayerWinBoard(next)
          if (forcedWin.line) setWinningLine(forcedWin.line)
          setStage('won')
          setIsPlayerTurn(false)
          setResultMessage(copy.won)
          setShowTransition(true)
          completeTimeoutRef.current = window.setTimeout(() => {
            onWin()
          }, config.transitionDuration || 3500)
          return forcedWin.board
        }

        if (!next.includes(null)) {
          setStage('lost')
          setIsPlayerTurn(false)
          setResultMessage(copy.draw)
        return next
      }

      setIsPlayerTurn(false)
      scheduleOpponentMove()
      return next
    })
  }

  if (stage === 'intro') {
    return (
      <GlassCard tone="elevated" className="space-y-5">
        <p className="whitespace-pre-line text-sm leading-8 text-[var(--hekaya-text-primary)]">
          {config.introMessage}
        </p>
        <NeonButton wide={false} onClick={() => setStage('playing')}>
          {copy.start}
        </NeonButton>
      </GlassCard>
    )
  }

  return (
    <GlassCard tone="elevated" className="relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-[var(--hekaya-text-secondary)]">
            {config.playerSymbol} vs {config.opponentSymbol}
          </p>
          <p
            className={clsx(
              'rounded-full border px-3 py-1 text-xs tracking-[0.12em] uppercase',
              isPlayerTurn
                ? 'border-[rgba(217,70,239,0.6)] bg-[rgba(217,70,239,0.16)] text-[var(--hekaya-neon-soft)]'
                : 'border-[rgba(167,139,250,0.35)] bg-[rgba(20,10,35,0.42)] text-[var(--hekaya-text-muted)]',
            )}
          >
            {isPlayerTurn ? copy.turnYou : copy.turnAI}
          </p>
        </div>

        <div className="hekaya-glass rounded-3xl p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {board.map((cell, index) => {
              const isWinningCell = winningLine?.includes(index) ?? false
              const glyph =
                cell === 'player' ? config.playerSymbol : config.opponentSymbol

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePlayerMove(index)}
                  disabled={cell !== null || stage !== 'playing' || !isPlayerTurn}
                  aria-label={`Cell ${index + 1}`}
                  className={clsx(
                    'relative aspect-square min-h-[82px] rounded-2xl border bg-[rgba(14,6,26,0.72)] text-3xl transition sm:min-h-[96px]',
                    'disabled:cursor-not-allowed',
                    isWinningCell
                      ? 'border-[rgba(217,70,239,0.92)] shadow-[0_0_24px_rgba(217,70,239,0.55),inset_0_0_18px_rgba(217,70,239,0.28)]'
                      : 'border-[rgba(167,139,250,0.35)] hover:border-[rgba(217,70,239,0.65)] hover:shadow-[0_0_18px_rgba(217,70,239,0.28)]',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {cell ? (
                      <motion.span
                        key={`${cell}-${index}`}
                        initial={{ scale: 0.3, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                        className={clsx(
                          'inline-block',
                          cell === 'player'
                            ? 'text-[var(--hekaya-neon-soft)] [text-shadow:0_0_18px_rgba(217,70,239,0.7)]'
                            : 'text-[var(--hekaya-gold)] [text-shadow:0_0_16px_rgba(251,191,36,0.6)]',
                        )}
                      >
                        {glyph}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence>
          {(stage === 'won' || stage === 'lost') && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="relative overflow-hidden rounded-2xl border border-[rgba(167,139,250,0.35)] bg-[rgba(24,12,41,0.52)] p-4 text-center"
            >
              <p className="hekaya-font-display text-lg text-[var(--hekaya-text-primary)]">
                {resultMessage}
              </p>
              {stage === 'won' ? (
                <div className="pointer-events-none absolute inset-0">
                  {CONFETTI.map((piece) => {
                    const radians = (piece.angle * Math.PI) / 180
                    const x = Math.cos(radians) * piece.distance
                    const y = Math.sin(radians) * piece.distance
                    return (
                      <motion.span
                        key={piece.id}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                        animate={{ opacity: [0, 1, 0], x: [0, x], y: [0, y], scale: [0.6, 1, 0.7] }}
                        transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/2 block rounded-sm"
                        style={{
                          width: piece.size,
                          height: piece.size * 1.8,
                          background: piece.color,
                        }}
                      />
                    )
                  })}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'lost' ? (
          <NeonButton wide={false} onClick={resetGame}>
            {copy.retry}
          </NeonButton>
        ) : null}
      </div>

      <AnimatePresence>
        {showTransition ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,2,19,0.78)] px-4 backdrop-blur-sm"
          >
            <div className="absolute inset-0">
              {TRANSITION_PARTICLES.map((particle, index) => (
                <motion.span
                  key={`${particle.left}-${particle.top}-${index}`}
                  className="absolute text-[var(--hekaya-neon-soft)]"
                  style={{ left: particle.left, top: particle.top }}
                  animate={{ y: [0, -14, 0], opacity: [0.3, 1, 0.35], scale: [0.9, 1.18, 0.92] }}
                  transition={{
                    duration: 3,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {particle.glyph}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl"
            >
              <GlassCard tone="elevated" className="py-8 text-center sm:py-10">
                <p className="hekaya-font-display text-xl leading-9 text-[var(--hekaya-text-primary)] sm:text-2xl sm:leading-10">
                  {config.transitionMessage}
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GlassCard>
  )
}
