import { Link } from 'react-router-dom'
import { Logo, SectionLabel } from '../components/ui'
import { DemoMark, useDemoNotice } from '../components/Demo'
import { useStore } from '../store'
import { dashboardStats } from '../data/seed'
import { fill, t } from '../i18n/ru'
import { money } from '../lib/format'
import { useIsDesktop } from '../lib/hooks'
import s from './DashboardScreen.module.css'

/**
 * Кабинет сборщика с десктопного макета. Плотный и табличный: сборщик
 * отвечает за отчёт о расходовании, и кабинет построен вокруг него, а не
 * вокруг баланса. Балансов, счетов и кнопок вывода здесь нет — платформа
 * деньги не держит.
 */
export function DashboardScreen() {
  const { campaign } = useStore()
  const notice = useDemoNotice()
  const isDesktop = useIsDesktop()
  const distributed = campaign.payouts.reduce((sum, p) => sum + p.sum, 0)
  const undistributed = campaign.raised - distributed

  if (!isDesktop) {
    return (
      <main className={s.narrow}>
        <p className={s.narrowText}>{t.dashboard.onlyDesktop}</p>
        <Link to={`/c/${campaign.slug}`}>← {t.common.openPage}</Link>
      </main>
    )
  }

  return (
    <main className={s.screen}>
      <nav className={s.sidebar}>
        <Link to="/" className={s.brand} aria-label={t.brand}>
          <Logo size={24} wordmarkSize={18} />
        </Link>
        <div className={s.navList}>
          {t.dashboard.nav.map((item, i) => (
            <span key={item} className={i === 0 ? `${s.navItem} ${s.navItemOn}` : s.navItem}>
              {item}
            </span>
          ))}
        </div>
        <div className={s.account}>
          <span className={s.accountName}>{campaign.organizer.name}</span>
          <span className={s.accountNote}>
            {t.dashboard.myidConfirmed} <DemoMark />
          </span>
        </div>
      </nav>

      <div className={s.content}>
        <div className={s.contentHead}>
          <div className={s.contentTitles}>
            <h1 className={s.title}>{campaign.title}</h1>
            <span className={`mono ${s.meta}`}>
              {fill(t.dashboard.campaignMeta, {
                number: campaign.number,
                published: campaign.publishedAt,
                deadline: campaign.deadline,
              })}
            </span>
          </div>
          <div className={s.headActions}>
            <Link to={`/c/${campaign.slug}`} className={s.secondaryAction}>
              {t.common.openPage}
            </Link>
            <button type="button" className={s.primaryAction} onClick={() => notice()}>
              {t.dashboard.publishUpdate}
            </button>
          </div>
        </div>

        <div className={s.stats}>
          {dashboardStats.map((stat, i) => (
            <div key={stat.label} className={s.stat}>
              <span className={s.statLabel}>{stat.label}</span>
              <span className={`mono ${s.statValue}`}>
                {i === 0 ? money(campaign.raised) : money(stat.value)}
              </span>
              <span className={s.statNote}>{stat.note}</span>
            </div>
          ))}
        </div>

        <div className={s.alert}>
          <div className={s.alertText}>
            <span className={s.alertTitle}>
              {fill(t.dashboard.alertTitle, { sum: money(undistributed) })}
            </span>
            <p className={s.alertBody}>{t.dashboard.alertBody}</p>
          </div>
          <button type="button" className={s.alertAction} onClick={() => notice()}>
            {t.dashboard.alertAction}
          </button>
        </div>

        <section className={s.tableBlock}>
          <SectionLabel
            right={
              <>
                <DemoMark />
                <span className={s.csv}>{t.dashboard.exportCsv}</span>
              </>
            }
          >
            {t.dashboard.recentIncome}
          </SectionLabel>
          <div className={s.table}>
            <div className={`${s.row} ${s.rowHead}`}>
              <span>{t.campaign.table.n}</span>
              <span>{t.campaign.table.donor}</span>
              <span>{t.campaign.table.note}</span>
              <span className={s.right}>{t.campaign.table.sum}</span>
              <span className={s.right}>{t.campaign.table.channel}</span>
              <span className={s.right}>{t.campaign.table.when}</span>
            </div>
            {campaign.donations.map((d) => (
              <div key={d.n} className={s.row}>
                <span className={`mono ${s.rowNumber}`}>{d.n}</span>
                <span>{d.name}</span>
                <span className={s.dim}>{d.note}</span>
                <span className={`${s.right} mono`}>{money(d.sum)}</span>
                <span className={`${s.right} mono ${s.rowSmall}`}>{d.channel}</span>
                <span className={`${s.right} mono ${s.rowSmall}`}>{d.time}</span>
              </div>
            ))}
            <div className={s.tableFoot}>
              <span>
                {fill(t.campaign.registryShown, {
                  shown: campaign.donations.length,
                  total: campaign.donors,
                })}
              </span>
              <span className="mono">
                {fill(t.campaign.registryTotal, { sum: money(campaign.raised) })}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
