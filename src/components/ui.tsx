import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { money, progressWidth } from '../lib/format'
import { t } from '../i18n/ru'
import s from './ui.module.css'

/* Примитивы дизайн-системы. Никаких инлайн-стилей за пределами
   вычисляемой ширины полосы прогресса. */

/** Знак Ishonch: печать на документе — рамка с ромбом. Всегда чернильный. */
export function Logo({
  size = 23,
  inverse = false,
  withWordmark = true,
  wordmarkSize,
}: {
  size?: number
  inverse?: boolean
  withWordmark?: boolean
  wordmarkSize?: number
}) {
  const seal = (
    <span
      className={inverse ? `${s.seal} ${s.sealInverse}` : s.seal}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.26) }}
      aria-hidden="true"
    >
      <span
        className={inverse ? `${s.sealDiamond} ${s.sealDiamondInverse}` : s.sealDiamond}
        style={{ width: Math.round(size * 0.39), height: Math.round(size * 0.39) }}
      />
    </span>
  )
  if (!withWordmark) return seal
  return (
    <span className={s.logo}>
      {seal}
      <span
        className={inverse ? `${s.wordmark} ${s.wordmarkInverse}` : s.wordmark}
        style={wordmarkSize ? { fontSize: wordmarkSize } : undefined}
      >
        {t.brand}
      </span>
    </span>
  )
}

/** Переключатель языка. Присутствует визуально, локализация не реализована. */
export function LangSwitch({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return <span className={s.langCompact}>{t.langs.join(' / ')}</span>
  }
  return (
    <div className={s.lang} role="group" aria-label="Язык интерфейса">
      {t.langs.map((lang, i) => (
        <span key={lang} className={i === 0 ? `${s.langItem} ${s.langItemOn}` : s.langItem}>
          {lang}
        </span>
      ))}
    </div>
  )
}

/** Сумма: монотип, табличные цифры, разряды через пробел. */
export function Money({
  value,
  unit,
  className,
}: {
  value: number
  unit?: string
  className?: string
}) {
  return (
    <span className={className ? `mono ${className}` : 'mono'}>
      {money(value)}
      {unit ? ` ${unit}` : ''}
    </span>
  )
}

export function Progress({
  raised,
  goal,
  size = 'md',
}: {
  raised: number
  goal: number
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div
      className={`${s.track} ${s[`track_${size}`]}`}
      role="progressbar"
      aria-valuenow={Math.min(100, Math.round((raised / goal) * 100))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={s.bar} style={{ width: progressWidth(raised, goal) }} />
    </div>
  )
}

/**
 * Заглушка изображения. Диагональная штриховка из макета: в прототипе
 * фотографий и сканов нет, и вид блока не притворяется, что они есть.
 */
export function Hatch({
  height,
  caption,
  align = 'center',
  radius = 'lg',
  className,
}: {
  height: number | string
  caption?: string
  align?: 'center' | 'bottom' | 'bottom-left'
  radius?: 'none' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  return (
    <div
      className={[s.hatch, s[`hatch_${align}`], s[`hatchR_${radius}`], className]
        .filter(Boolean)
        .join(' ')}
      style={{ height }}
      aria-hidden="true"
    >
      {caption && <span className={s.hatchCaption}>{caption}</span>}
    </div>
  )
}

type ButtonProps = {
  children: ReactNode
  variant?: 'accent' | 'outline' | 'quiet' | 'ink'
  size?: 'lg' | 'md' | 'sm'
  to?: string
  full?: boolean
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  ariaLabel?: string
}

export function Button({
  children,
  variant = 'accent',
  size = 'lg',
  to,
  full = false,
  onClick,
  disabled,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const cls = [s.btn, s[`btn_${variant}`], s[`btn_${size}`], full ? s.btnFull : '']
    .filter(Boolean)
    .join(' ')
  if (to && !disabled) {
    return (
      <Link className={cls} to={to} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

/** Монотипный заглавный лейбл секции. */
export function SectionLabel({
  children,
  right,
}: {
  children: ReactNode
  right?: ReactNode
}) {
  if (right) {
    return (
      <div className={s.labelRow}>
        <span className="label">{children}</span>
        <span className={s.labelRight}>{right}</span>
      </div>
    )
  }
  return <span className="label">{children}</span>
}
