import { useState } from 'react'
import type { VerificationCheck } from '../data/seed'
import { fill, t } from '../i18n/ru'
import { DemoMark } from './Demo'
import s from './VerificationBlock.module.css'

/**
 * Центральный элемент продукта: что именно проверено и чем это подтверждено.
 *
 * Блок остаётся раскрытой карточкой на четыре пункта. Он не сворачивается
 * в бейдж с галочкой: галочка сообщает вывод, а продаём мы основания.
 * Рамка чернильная, не акцентная — акцент принадлежит кнопке «Помочь».
 */
export function VerificationBlock({
  checks,
  verifiedAt,
  defaultOpen = true,
}: {
  checks: VerificationCheck[]
  verifiedAt: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className={s.block} aria-label={t.campaign.verify.title}>
      <button
        type="button"
        className={s.head}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={s.headTitles}>
          <span className={s.title}>{t.campaign.verify.title}</span>
          <span className={s.counter}>
            {fill(t.campaign.verify.counter, { date: verifiedAt })}
            <DemoMark />
          </span>
        </span>
        <span className={s.glyph} aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className={s.body}>
          {checks.map((check) => (
            <div key={check.title} className={s.check}>
              <span className={s.tick} aria-hidden="true">
                ✓
              </span>
              <span className={s.checkText}>
                <span className={s.checkTitle}>{check.title}</span>
                <span className={s.checkDetail}>{check.detail}</span>
              </span>
            </div>
          ))}
          <p className={s.footer}>{t.campaign.verify.footer}</p>
        </div>
      )}
    </section>
  )
}
