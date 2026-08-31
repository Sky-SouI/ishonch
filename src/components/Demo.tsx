import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { t } from '../i18n/ru'
import s from './Demo.module.css'

/*
 * Сквозной приём честной пометки заглушек. Три элемента, больше ничего:
 *
 *   1. DemoRibbon — полоса над шапкой: прототип, данные вымышлены, интеграций нет.
 *   2. DemoMark   — монотипный чип «демо» рядом с любым местом, которое
 *                   имитирует внешнюю систему: проверку личности, платёж,
 *                   загруженный документ, квитанцию.
 *   3. useDemoNotice — клик по нерабочему элементу говорит об этом прямо,
 *                   а не притворяется, что что-то произошло.
 *
 * Правило: если элемент показывает результат работы системы, которой в
 * прототипе нет, рядом обязан стоять DemoMark.
 */

const DemoNoticeContext = createContext<(text?: string) => void>(() => {})

export function useDemoNotice() {
  return useContext(DemoNoticeContext)
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<string | null>(null)

  const show = useCallback((text?: string) => {
    setNotice(text ?? t.demo.stubAction)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const value = useMemo(() => show, [show])

  return (
    <DemoNoticeContext.Provider value={value}>
      {children}
      {notice && (
        <div className={s.toast} role="status">
          <span className={s.toastMark}>{t.demo.mark}</span>
          <span>{notice}</span>
        </div>
      )}
    </DemoNoticeContext.Provider>
  )
}

/** Чип «демо». Ставится рядом с имитацией внешней системы. */
export function DemoMark({ label }: { label?: string }) {
  return (
    <span className={s.mark} title={label ?? t.demo.markTitle}>
      {t.demo.mark}
    </span>
  )
}

export function DemoRibbon() {
  const [open, setOpen] = useState(false)
  return (
    <div className={s.ribbon}>
      <div className={s.ribbonRow}>
        <span className={s.ribbonLabel}>{t.demo.ribbon}</span>
        <span className={s.ribbonText}>{t.demo.ribbonDetail}</span>
        <button
          type="button"
          className={s.ribbonToggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {t.demo.ribbonMore}
          <span className={s.ribbonGlyph}>{open ? '−' : '+'}</span>
        </button>
      </div>
      {open && (
        <div className={s.ribbonPanel}>
          <p>
            Настоящее здесь — продуктовая логика: как выглядит проверенный сбор, что видит донор
            перед переводом, какой отчёт обязан вести сборщик, куда уходят деньги.
          </p>
          <p>
            Заглушки — MyID, Click, Payme, Uzum, Humo / Uzcard, SMS, загрузка файлов, работа
            модератора. Все данные на экранах вымышлены и помечены чипом{' '}
            <span className={s.markInline}>{t.demo.mark}</span>.
          </p>
        </div>
      )}
    </div>
  )
}
