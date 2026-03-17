import { useId, useState } from 'react'
import type { HekayaLocale } from '../../../types/hekaya'
import { GlassCard } from '../../shared/GlassCard'
import { NeonButton } from '../../shared/NeonButton'

interface ConfigErrorStateProps {
  locale: HekayaLocale
  kind?: 'config' | 'runtime'
  errors?: string[]
  onReload?: () => void
}

export function ConfigErrorState({
  locale,
  kind = 'config',
  errors = [],
  onReload,
}: ConfigErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false)
  const detailsId = useId()
  const hasErrors = errors.length > 0

  const copy =
    locale === 'ar'
      ? {
          title:
            kind === 'runtime'
              ? 'حدث خطأ غير متوقع'
              : 'تعذر تشغيل الحكاية حالياً',
          description:
            kind === 'runtime'
              ? 'حصل خطأ أثناء تشغيل التجربة. جربي إعادة التحميل.'
              : 'يوجد خطأ في إعدادات المحتوى. عدلي الإعدادات ثم أعيدي التحميل.',
          details: 'تفاصيل تقنية',
          hideDetails: 'إخفاء التفاصيل',
          reload: 'إعادة التحميل',
        }
      : {
          title:
            kind === 'runtime'
              ? 'Unexpected Error'
              : 'Unable to Start Hekaya',
          description:
            kind === 'runtime'
              ? 'A runtime error occurred. Please reload and try again.'
              : 'There is a configuration issue. Fix the content config, then reload.',
          details: 'Technical details',
          hideDetails: 'Hide details',
          reload: 'Reload',
        }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <GlassCard tone="elevated" className="space-y-5">
          <header className="space-y-2 text-center">
            <h1 className="hekaya-font-display text-3xl text-[var(--hekaya-text-primary)] sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-sm text-[var(--hekaya-text-secondary)] sm:text-base">
              {copy.description}
            </p>
          </header>

          {hasErrors ? (
            <section className="space-y-3">
              <NeonButton
                wide={false}
                variant="gold"
                onClick={() => setShowDetails((current) => !current)}
                aria-expanded={showDetails}
                aria-controls={detailsId}
              >
                {showDetails ? copy.hideDetails : copy.details}
              </NeonButton>

              {showDetails ? (
                <div
                  id={detailsId}
                  className="rounded-2xl border border-[rgba(248,113,113,0.4)] bg-[rgba(46,14,26,0.55)] p-3"
                >
                  <ul className="list-disc space-y-1 ps-5 text-sm text-[var(--hekaya-text-secondary)]">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="text-center">
            <NeonButton
              wide={false}
              onClick={() => {
                if (onReload) {
                  onReload()
                  return
                }
                if (typeof window !== 'undefined') window.location.reload()
              }}
            >
              {copy.reload}
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </main>
  )
}

export default ConfigErrorState
