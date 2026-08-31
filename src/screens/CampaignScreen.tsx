import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { VerificationBlock } from '../components/VerificationBlock'
import { Button, Hatch, Money, Progress, SectionLabel } from '../components/ui'
import { DemoMark } from '../components/Demo'
import { useStore } from '../store'
import type { Campaign } from '../data/seed'
import { fill, t } from '../i18n/ru'
import { money, percent, plural } from '../lib/format'
import { useCopyLink, useIsDesktop } from '../lib/hooks'
import s from './CampaignScreen.module.css'

export function CampaignScreen() {
  const { campaign } = useStore()
  const { slug } = useParams()
  const isDesktop = useIsDesktop()

  /* В прототипе раскрыт один сбор. Каталог не даёт открыть остальные,
     но прямой переход по адресу возможен — возвращаем на каталог. */
  if (slug !== campaign.slug) {
    return (
      <>
        <Header activeCampaigns />
        <main className={s.notFound}>
          <p className={s.notFoundText}>
            В прототипе раскрыт один сбор — Сабины. Остальные карточки каталога показывают только
            витрину.
          </p>
          <Button to={`/c/${campaign.slug}`} variant="outline" size="md">
            Открыть сбор Сабины
          </Button>
        </main>
      </>
    )
  }

  return isDesktop ? <DesktopCampaign campaign={campaign} /> : <MobileCampaign campaign={campaign} />
}

/* ---------------------------------------------------------------- мобайл */

function MobileCampaign({ campaign }: { campaign: Campaign }) {
  const [storyOpen, setStoryOpen] = useState(false)
  const [registryOpen, setRegistryOpen] = useState(false)
  const [copied, copy] = useCopyLink()
  const donateHref = `/c/${campaign.slug}/donate`

  return (
    <>
      <Header />
      <main className={s.mobile}>
        <Hatch height={260} caption={t.campaign.photoStub} align="bottom" radius="none" />

        <section className={s.head}>
          <h1 className={s.title}>{campaign.title}</h1>

          <div className={s.parties}>
            <div className={s.party}>
              <span className="label">{t.campaign.organizer}</span>
              <span className={s.partyName}>{campaign.organizer.shortName}</span>
              <span className={s.partyNote}>{campaign.organizer.city}</span>
            </div>
            <div className={s.party}>
              <span className="label">{t.campaign.payTo}</span>
              <span className={s.partyName}>{campaign.payTo.name}</span>
              <span className={s.partyNote}>{campaign.payTo.shortDetail}</span>
            </div>
          </div>

          <div className={s.amountBlock}>
            <div className={s.amountRow}>
              <Money value={campaign.raised} className={s.amount} />
              <span className={s.amountUnit}>{t.currency}</span>
            </div>
            <Progress raised={campaign.raised} goal={campaign.goal} />
            <div className={s.amountMeta}>
              <span>{fill(t.campaign.collectedOf, { percent: percent(campaign.raised, campaign.goal) })}</span>
              <span className="mono">
                {t.common.goal} {money(campaign.goal)} {t.currency}
              </span>
            </div>
            <p className={s.donorsLine}>
              {campaign.donors} {plural(campaign.donors, 'человек помог', 'человека помогли', 'человек помогли')}{' '}
              · последний перевод {campaign.lastDonation}
            </p>
          </div>
        </section>

        <section className={s.actions}>
          <div className={s.actionsRow}>
            <Button to={donateHref} size="md" full>
              {t.common.help}
            </Button>
            <Button variant="outline" size="md" full onClick={copy}>
              {copied ? t.common.copied : t.common.share}
            </Button>
          </div>
          <p className={s.note}>{t.campaign.directNote}</p>
        </section>

        <div className={s.verifyWrap}>
          <VerificationBlock checks={campaign.checks} verifiedAt={campaign.verifiedAt} />
        </div>

        <section className={s.section}>
          <SectionLabel>{t.campaign.story}</SectionLabel>
          {(storyOpen ? campaign.storyFull : campaign.storyShort).map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className={s.story}>
              {paragraph}
            </p>
          ))}
          {!storyOpen && (
            <button type="button" className={s.linkAction} onClick={() => setStoryOpen(true)}>
              {t.common.readMore}
            </button>
          )}
        </section>

        <section className={s.section}>
          <SectionLabel>{t.campaign.payouts}</SectionLabel>
          <PayoutsList campaign={campaign} />
        </section>

        <section className={s.section}>
          <SectionLabel
            right={
              <>
                <span>{fill(t.campaign.registryCount, { count: campaign.donors })}</span>
                <DemoMark />
              </>
            }
          >
            {t.campaign.registry}
          </SectionLabel>
          <ul className={s.registry}>
            {(registryOpen ? campaign.donations : campaign.donations.slice(0, 5)).map((d) => (
              <li key={d.n} className={s.registryRow}>
                <span className={s.registryWho}>
                  <span className={s.registryName}>{d.name}</span>
                  {d.note && <span className={s.registryNote}>{d.note}</span>}
                </span>
                <span className={s.registryRight}>
                  <Money value={d.sum} className={s.registrySum} />
                  <span className={s.registryTime}>{d.time}</span>
                </span>
              </li>
            ))}
          </ul>
          {registryOpen ? (
            <p className={s.registryFoot}>
              {fill(t.campaign.registryShown, {
                shown: campaign.donations.length,
                total: campaign.donors,
              })}
            </p>
          ) : (
            <button type="button" className={s.linkAction} onClick={() => setRegistryOpen(true)}>
              {t.common.showAll}
            </button>
          )}
        </section>

        <section className={s.section}>
          <SectionLabel>
            {fill(t.campaign.updates, { count: campaign.updates.length })}
          </SectionLabel>
          {campaign.updates.slice(0, 2).map((u) => (
            <article key={u.date} className={s.update}>
              <span className={s.updateDate}>{u.date}</span>
              <h3 className={s.updateTitle}>{u.title}</h3>
              <p className={s.updateText}>{u.text}</p>
              {u.hasScan && (
                <Hatch height={96} caption={t.campaign.scanStub} radius="md" className={s.updateScan} />
              )}
            </article>
          ))}
        </section>

        <section className={s.deadline}>
          <SectionLabel>{t.campaign.deadline}</SectionLabel>
          <div className={s.deadlineRow}>
            <span>{fill(t.campaign.announced, { date: campaign.publishedAt })}</span>
            <span>{fill(t.campaign.runsTo, { date: campaign.deadline })}</span>
          </div>
          <p className={s.deadlineNote}>{campaign.deadlineNote}</p>
        </section>
      </main>

      <div className={s.sticky}>
        <Button to={donateHref} size="md" full>
          {t.common.help}
        </Button>
        <button
          type="button"
          className={s.stickyShare}
          onClick={copy}
          aria-label={t.common.share}
          title={copied ? t.common.copied : t.common.share}
        >
          ↗
        </button>
      </div>
    </>
  )
}

function PayoutsList({ campaign }: { campaign: Campaign }) {
  const distributed = campaign.payouts.reduce((sum, p) => sum + p.sum, 0)
  return (
    <div className={s.payouts}>
      {campaign.payouts.map((p) => (
        <div key={p.payee} className={s.payout}>
          <div className={s.payoutTop}>
            <span className={s.payoutPayee}>{p.payee}</span>
            <Money value={p.sum} className={s.payoutSum} />
          </div>
          <span className={s.payoutMeta}>
            {p.date} · {p.purpose.toLowerCase()} · {p.document.toLowerCase()} приложен
          </span>
        </div>
      ))}
      <div className={s.payoutRest}>
        <span>{t.campaign.undistributed}</span>
        <Money value={campaign.raised - distributed} unit={t.currency} className={s.payoutRestSum} />
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- десктоп */

type Tab = 'story' | 'updates' | 'registry' | 'docs'

function DesktopCampaign({ campaign }: { campaign: Campaign }) {
  const [tab, setTab] = useState<Tab>('story')
  const [copied, copy] = useCopyLink()
  const distributed = campaign.payouts.reduce((sum, p) => sum + p.sum, 0)
  const donateHref = `/c/${campaign.slug}/donate`

  const tabs: { id: Tab; label: string }[] = [
    { id: 'story', label: t.campaign.tabs.story },
    { id: 'updates', label: fill(t.campaign.tabs.updates, { count: campaign.updates.length }) },
    { id: 'registry', label: fill(t.campaign.tabs.registry, { count: campaign.donors }) },
    { id: 'docs', label: fill(t.campaign.tabs.docs, { count: campaign.files.length }) },
  ]

  return (
    <>
      <Header />
      <main className={s.desktop}>
        <div className={s.main}>
          <div className={s.mainHead}>
            <div className={s.metaLine}>
              <span>
                {campaign.category.toLowerCase()} · {campaign.city.toLowerCase()}
              </span>
              <span>·</span>
              <span>сбор №{campaign.number}</span>
            </div>
            <h1 className={s.titleWide}>{campaign.title}</h1>
            <Hatch height={420} caption={t.campaign.photoStubWide} align="bottom-left" radius="xl" />

            <div className={s.partiesWide}>
              <div className={s.party}>
                <span className="label">{t.campaign.organizer}</span>
                <span className={s.partyNameWide}>{campaign.organizer.name}</span>
                <span className={s.partyNoteWide}>{campaign.organizer.relation}</span>
              </div>
              <div className={s.party}>
                <span className="label">{t.campaign.beneficiaryLong}</span>
                <span className={s.partyNameWide}>{campaign.beneficiary.name}</span>
                <span className={s.partyNoteWide}>{campaign.beneficiary.detail}</span>
              </div>
              <div className={s.party}>
                <span className="label">{t.campaign.moneyGoesTo}</span>
                <span className={s.partyNameWide}>{campaign.payTo.name}</span>
                <span className={s.partyNoteWide}>{campaign.payTo.detail}</span>
              </div>
            </div>
          </div>

          <div className={s.tabs} role="tablist">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={tab === item.id ? `${s.tab} ${s.tabOn}` : s.tab}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'story' && (
            <div className={s.tabPanel}>
              {campaign.storyFull.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className={s.storyWide}>
                  {paragraph}
                </p>
              ))}
              <div className={s.payoutsWide}>
                <span className="label">
                  {fill(t.campaign.payoutsDistributed, {
                    distributed: money(distributed),
                    total: money(campaign.raised),
                  })}
                </span>
                <div className={s.table}>
                  <div className={`${s.payoutRowHead} ${s.tableHead}`}>
                    <span>{t.campaign.table.payee}</span>
                    <span>{t.campaign.table.purpose}</span>
                    <span className={s.right}>{t.campaign.table.sum}</span>
                    <span className={s.right}>{t.campaign.table.document}</span>
                  </div>
                  {campaign.payouts.map((p) => (
                    <div key={p.payee} className={s.payoutRow}>
                      <span>{p.payee}</span>
                      <span className={s.dim}>{p.purpose}</span>
                      <span className={`${s.right} mono`}>{money(p.sum)}</span>
                      <span className={`${s.right} ${s.docLink}`}>{p.document}</span>
                    </div>
                  ))}
                  <div className={`${s.payoutRow} ${s.tableFoot}`}>
                    <span>{t.campaign.undistributed}</span>
                    <span>{t.campaign.undistributedNote}</span>
                    <span className={`${s.right} mono`}>{money(campaign.raised - distributed)}</span>
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'updates' && (
            <div className={s.tabPanelUpdates}>
              {campaign.updates.map((u) => (
                <article key={u.date} className={s.update}>
                  <span className={s.updateDate}>{u.date}</span>
                  <h3 className={s.updateTitleWide}>{u.title}</h3>
                  <p className={s.updateTextWide}>{u.text}</p>
                  {u.document && <span className={s.updateDoc}>{u.document}</span>}
                </article>
              ))}
            </div>
          )}

          {tab === 'registry' && (
            <div className={s.tabPanel}>
              <SectionLabel
                right={
                  <>
                    <DemoMark />
                    <span className={s.csv}>{t.common.download}</span>
                  </>
                }
              >
                {fill(t.campaign.registryPublic, { count: campaign.donors })}
              </SectionLabel>
              <div className={s.table}>
                <div className={`${s.donationRow} ${s.tableHead}`}>
                  <span>{t.campaign.table.n}</span>
                  <span>{t.campaign.table.donor}</span>
                  <span>{t.campaign.table.note}</span>
                  <span className={s.right}>{t.campaign.table.sum}</span>
                  <span className={s.right}>{t.campaign.table.when}</span>
                </div>
                {campaign.donations.map((d) => (
                  <div key={d.n} className={s.donationRow}>
                    <span className={`mono ${s.rowNumber}`}>{d.n}</span>
                    <span>{d.name}</span>
                    <span className={s.dim}>{d.note}</span>
                    <span className={`${s.right} mono`}>{money(d.sum)}</span>
                    <span className={`${s.right} mono ${s.rowTime}`}>{d.time}</span>
                  </div>
                ))}
                <div className={s.tableFootRow}>
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
            </div>
          )}

          {tab === 'docs' && (
            <div className={s.tabPanel}>
              <SectionLabel right={<DemoMark />}>документы сбора</SectionLabel>
              <div className={s.files}>
                {campaign.files.map((f) => (
                  <div key={f.name} className={s.file}>
                    <Hatch height={180} radius="none" />
                    <div className={s.fileMeta}>
                      <span className={s.fileName}>{f.name}</span>
                      <span className={s.fileNote}>{f.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={s.aside}>
          <div className={s.asideCard}>
            <div className={s.amountBlock}>
              <div className={s.amountRow}>
                <Money value={campaign.raised} className={s.amountWide} />
                <span className={s.amountUnitWide}>{t.currency}</span>
              </div>
              <Progress raised={campaign.raised} goal={campaign.goal} />
              <div className={s.amountMetaWide}>
                <span>{fill(t.campaign.percentOfGoal, { percent: percent(campaign.raised, campaign.goal) })}</span>
                <span className="mono">
                  {t.common.goal} {money(campaign.goal)}
                </span>
              </div>
            </div>
            <dl className={s.facts}>
              <div className={s.fact}>
                <dt>{t.campaign.helped}</dt>
                <dd className="mono">
                  {campaign.donors} {t.campaign.people}
                </dd>
              </div>
              <div className={s.fact}>
                <dt>{t.campaign.lastTransfer}</dt>
                <dd className="mono">{campaign.lastDonation}</dd>
              </div>
              <div className={s.fact}>
                <dt>{t.campaign.runsUntil}</dt>
                <dd className="mono">{campaign.deadline}</dd>
              </div>
            </dl>
            <div className={s.asideActions}>
              <Button to={donateHref} full>
                {t.common.help}
              </Button>
              <Button variant="outline" full onClick={copy}>
                {copied ? t.common.copied : t.common.share}
              </Button>
              <p className={s.noteWide}>{t.campaign.directNoteLong}</p>
            </div>
          </div>

          <VerificationBlock checks={campaign.checks} verifiedAt={campaign.verifiedAt} />

          <div className={s.deadlineCard}>
            <span className={s.deadlineCardTitle}>
              {fill(t.campaign.deadlineTitle, { date: campaign.deadlineShort })}
            </span>
            <p className={s.deadlineCardBody}>{campaign.deadlineNote}</p>
          </div>

          <Link to="/dashboard" className={s.dashboardLink}>
            {t.nav.dashboard} →
          </Link>
        </aside>
      </main>
    </>
  )
}
