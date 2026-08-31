import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Hatch, Progress, SectionLabel } from '../components/ui'
import { DemoMark } from '../components/Demo'
import { campaignCards } from '../data/seed'
import type { CampaignCard } from '../data/seed'
import { useStore } from '../store'
import { t } from '../i18n/ru'
import { money } from '../lib/format'
import { useIsDesktop } from '../lib/hooks'
import s from './CatalogScreen.module.css'

type Filter = 'all' | 'treatment' | 'rehab' | 'urgent'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: t.catalog.filters.all },
  { id: 'treatment', label: t.catalog.filters.treatment },
  { id: 'rehab', label: t.catalog.filters.rehab },
  { id: 'urgent', label: t.catalog.filters.urgent },
]

function matches(card: CampaignCard, filter: Filter): boolean {
  if (filter === 'all') return true
  if (filter === 'treatment') return card.category === 'Лечение'
  if (filter === 'rehab') return card.category === 'Реабилитация'
  return card.urgent
}

export function CatalogScreen() {
  const [filter, setFilter] = useState<Filter>('all')
  const { campaign } = useStore()
  const isDesktop = useIsDesktop()

  /* Сбор Сабины показывает актуальную сумму: донат в демонстрации её меняет. */
  const cards = useMemo(
    () =>
      campaignCards
        .map((card) =>
          card.slug === campaign.slug
            ? { ...card, raised: campaign.raised, meta: `${campaign.donors} человек · до ${campaign.deadline}` }
            : card,
        )
        .filter((card) => matches(card, filter)),
    [filter, campaign.raised, campaign.donors, campaign.deadline, campaign.slug],
  )

  return (
    <>
      <Header activeCampaigns />
      <main className={s.screen}>
        <div className={s.head}>
          <div className={s.headTop}>
            <h1 className={s.title}>{t.catalog.title}</h1>
            <span className={s.count}>
              <span className="mono">
                {cards.length} {t.catalog.countSuffix}
              </span>
              <DemoMark />
            </span>
          </div>
          <p className={s.subtitle}>{t.catalog.subtitle}</p>
          <div className={s.filters} role="tablist">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={filter === item.id}
                className={filter === item.id ? `${s.chip} ${s.chipOn}` : s.chip}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {cards.length === 0 ? (
          <p className={s.empty}>{t.catalog.empty}</p>
        ) : isDesktop ? (
          <div className={s.grid}>
            {cards.map((card) => (
              <CardWide key={card.slug} card={card} openable={card.slug === campaign.slug} />
            ))}
          </div>
        ) : (
          <ul className={s.list}>
            {cards.map((card) => (
              <li key={card.slug}>
                <CardRow card={card} openable={card.slug === campaign.slug} />
              </li>
            ))}
          </ul>
        )}

        <div className={s.foot}>
          <SectionLabel>{t.catalog.checksBadge}</SectionLabel>
          <p className={s.footNote}>{t.catalog.subtitle}</p>
        </div>
      </main>
    </>
  )
}

function CardRow({ card, openable }: { card: CampaignCard; openable: boolean }) {
  const inner = (
    <>
      <Hatch height={84} radius="lg" className={s.thumb} />
      <div className={s.rowBody}>
        <span className={s.rowTitle}>{card.title}</span>
        <Progress raised={card.raised} goal={card.goal} size="sm" />
        <div className={s.rowNumbers}>
          <span>{money(card.raised)}</span>
          <span>
            {t.common.of} {money(card.goal)}
          </span>
        </div>
        <span className={s.rowMeta}>{card.meta}</span>
        {!openable && <span className={s.rowStub}>в прототипе не раскрыт</span>}
      </div>
    </>
  )
  if (!openable) return <div className={s.row}>{inner}</div>
  return (
    <Link to={`/c/${card.slug}`} className={`${s.row} ${s.rowLink}`}>
      {inner}
    </Link>
  )
}

function CardWide({ card, openable }: { card: CampaignCard; openable: boolean }) {
  const inner = (
    <>
      <Hatch height={180} radius="none" />
      <div className={s.cardBody}>
        <span className={s.cardTitle}>{card.title}</span>
        <Progress raised={card.raised} goal={card.goal} size="md" />
        <div className={s.cardNumbers}>
          <span>{money(card.raised)}</span>
          <span className={s.cardGoal}>
            {t.common.of} {money(card.goal)}
          </span>
        </div>
        <span className={s.cardMeta}>{card.meta}</span>
        <span className={s.cardBadge}>
          {openable ? t.catalog.checksBadge : 'в прототипе не раскрыт'}
        </span>
      </div>
    </>
  )
  if (!openable) return <div className={s.card}>{inner}</div>
  return (
    <Link to={`/c/${card.slug}`} className={`${s.card} ${s.cardLink}`}>
      {inner}
    </Link>
  )
}
