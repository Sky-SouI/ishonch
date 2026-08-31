import { Navigate, Link } from 'react-router-dom'
import { Button, Money, SectionLabel } from '../components/ui'
import { DemoMark, useDemoNotice } from '../components/Demo'
import { useStore } from '../store'
import { fill, t } from '../i18n/ru'
import { useCopyLink } from '../lib/hooks'
import s from './DonateSuccessScreen.module.css'

/*
 * Экран после перевода. Кнопка «поделиться» весит не меньше самого доната:
 * акцентная, во всю ширину, первая в блоке действий.
 *
 * Строка «Один шер приводит в среднем 4 перевода» из макета убрана —
 * данных за этой цифрой нет.
 */
export function DonateSuccessScreen() {
  const { campaign, lastDonation } = useStore()
  const notice = useDemoNotice()
  const [copied, copy] = useCopyLink()

  if (!lastDonation) return <Navigate to={`/c/${campaign.slug}`} replace />

  return (
    <main className={s.screen}>
      <div className={s.headline}>
        <SectionLabel>{t.success.label}</SectionLabel>
        <Money value={lastDonation.amount} unit={t.currency} className={s.amount} />
        <p className={s.body}>{fill(t.success.body, { n: lastDonation.n })}</p>
      </div>

      <div className={s.receipt}>
        <div className={s.receiptRow}>
          <span>
            {t.success.receipt} <DemoMark />
          </span>
          <span className="mono">{lastDonation.receipt}</span>
        </div>
        <div className={s.receiptRow}>
          <span>{t.success.raisedNow}</span>
          <Money value={lastDonation.raisedAfter} unit={t.currency} />
        </div>
      </div>

      <div className={s.actions}>
        <Button full onClick={() => notice()}>
          {t.success.shareTelegram}
        </Button>
        <div className={s.actionsRow}>
          <Button variant="outline" size="sm" full onClick={() => notice()}>
            {t.success.shareInstagram}
          </Button>
          <Button variant="quiet" size="sm" full onClick={copy}>
            {copied ? t.common.copied : t.common.copyLink}
          </Button>
        </div>
      </div>

      <p className={s.note}>{t.success.shareNote}</p>

      <Link to={`/c/${campaign.slug}`} className={s.back}>
        {t.success.backToCampaign} →
      </Link>
    </main>
  )
}
