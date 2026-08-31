import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FlowHeader } from '../components/Header'
import { Button, Money, SectionLabel } from '../components/ui'
import { DemoMark } from '../components/Demo'
import { useStore } from '../store'
import { donationPresets, minDonation, paymentMethods } from '../data/seed'
import { fill, t } from '../i18n/ru'
import { money } from '../lib/format'
import s from './DonateScreen.module.css'

export function DonateScreen() {
  const { campaign, donate } = useStore()
  const { slug } = useParams()
  const navigate = useNavigate()

  const [amount, setAmount] = useState(50_000)
  const [custom, setCustom] = useState('')
  const [method, setMethod] = useState(paymentMethods[0].id)
  const [named, setNamed] = useState(true)
  const [comment, setComment] = useState('')

  const customAmount = Number(custom.replace(/\D/g, ''))
  const effective = custom ? customAmount : amount
  const tooSmall = custom.length > 0 && customAmount < minDonation
  const canSubmit = effective >= minDonation

  const chooseCustom = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 12)
    setCustom(digits)
  }

  const submit = () => {
    if (!canSubmit) return
    const chosen = paymentMethods.find((m) => m.id === method)
    donate({
      amount: effective,
      named,
      comment: comment.trim(),
      method: chosen ? chosen.name.split(' ')[0] : method,
    })
    navigate(`/c/${slug ?? campaign.slug}/donate/success`)
  }

  return (
    <>
      <FlowHeader
        title={t.donate.heading}
        subtitle={t.donate.subheading}
        backTo={`/c/${campaign.slug}`}
      />
      <main className={s.screen}>
        <section className={s.section}>
          <SectionLabel>{t.donate.amount}</SectionLabel>
          <div className={s.presets}>
            {donationPresets.map((value) => {
              const on = !custom && amount === value
              return (
                <button
                  key={value}
                  type="button"
                  className={on ? `${s.preset} ${s.presetOn}` : s.preset}
                  onClick={() => {
                    setAmount(value)
                    setCustom('')
                  }}
                  aria-pressed={on}
                >
                  <span className={`mono ${s.presetValue}`}>{money(value)}</span>
                  <span className={s.presetUnit}>{t.currency}</span>
                </button>
              )
            })}
          </div>

          <div className={custom ? `${s.custom} ${s.customOn}` : s.custom}>
            <input
              className={s.customInput}
              inputMode="numeric"
              value={custom ? money(customAmount) : ''}
              onChange={(e) => chooseCustom(e.target.value)}
              placeholder={t.donate.ownAmount}
              aria-label={t.donate.ownAmount}
            />
            <span className={`mono ${s.customHint}`}>
              {fill(t.donate.ownAmountFrom, { min: money(minDonation) })}
            </span>
          </div>
          {tooSmall && (
            <p className={s.error}>{fill(t.donate.belowMin, { min: money(minDonation) })}</p>
          )}
        </section>

        <section className={s.section}>
          <SectionLabel right={<DemoMark />}>{t.donate.method}</SectionLabel>
          <div className={s.methods} role="radiogroup" aria-label={t.donate.method}>
            {paymentMethods.map((m) => {
              const on = method === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={on ? `${s.method} ${s.methodOn}` : s.method}
                  onClick={() => setMethod(m.id)}
                >
                  <span className={s.methodText}>
                    <span className={s.methodName}>{m.name}</span>
                    <span className={s.methodHint}>{m.hint}</span>
                  </span>
                  <span className={on ? `${s.dot} ${s.dotOn}` : s.dot} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </section>

        <section className={s.sectionTight}>
          <button
            type="button"
            className={s.switchRow}
            onClick={() => setNamed((v) => !v)}
            aria-pressed={named}
          >
            <span className={s.switchText}>
              <span className={s.switchTitle}>{t.donate.showName}</span>
              <span className={s.switchHint}>
                {fill(t.donate.willShow, {
                  name: named ? t.donate.demoDonorName : t.donate.anonymous,
                })}
              </span>
            </span>
            <span
              className={named ? `${s.track} ${s.trackOn}` : s.track}
              aria-hidden="true"
            >
              <span className={s.knob} />
            </span>
          </button>

          <div className={s.commentBox}>
            <label className={s.commentLabel} htmlFor="donate-comment">
              {t.donate.commentLabel}
            </label>
            <textarea
              id="donate-comment"
              className={s.commentInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.donate.commentPlaceholder}
              rows={2}
              maxLength={140}
            />
          </div>
        </section>

        <section className={s.total}>
          <div className={s.totalRow}>
            <span className={s.totalLabel}>{t.donate.total}</span>
            <Money value={effective} unit={t.currency} className={s.totalValue} />
          </div>
          <p className={s.totalNote}>{t.donate.totalNote}</p>
          <Button full onClick={submit} disabled={!canSubmit}>
            {t.donate.submit}
          </Button>
          <p className={s.stubNote}>
            <DemoMark /> Платёжный шлюз не подключён: кнопка сразу открывает экран после перевода.
          </p>
        </section>
      </main>
    </>
  )
}
