import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LangSwitch, Logo } from './ui'
import { t } from '../i18n/ru'
import s from './Header.module.css'

/**
 * Шапка сайта. На мобайле — знак и переключатель языка; десктопная навигация
 * появляется от 1024 пикселей. Пунктов «Как мы проверяем» и «Фондам» в
 * прототипе нет — они ведут на каталог и помечены как незавершённые.
 */
export function Header({ activeCampaigns = false }: { activeCampaigns?: boolean }) {
  return (
    <header className={s.header}>
      <div className={s.inner}>
        <div className={s.left}>
          <Link to="/" className={s.brand} aria-label={t.brand}>
            <Logo size={23} />
          </Link>
          <nav className={s.nav}>
            <NavLink
              to="/"
              className={activeCampaigns ? `${s.navLink} ${s.navLinkOn}` : s.navLink}
            >
              {t.nav.campaigns}
            </NavLink>
            <span className={s.navLinkMuted}>{t.nav.howWeVerify}</span>
            <span className={s.navLinkMuted}>{t.nav.forFunds}</span>
          </nav>
        </div>
        <div className={s.right}>
          <LangSwitch />
          <span className={s.login}>{t.nav.login}</span>
          <Link to="/create" className={s.create}>
            {t.nav.createCampaign}
          </Link>
        </div>
      </div>
    </header>
  )
}

/** Шапка потока: возврат назад, заголовок и подзаголовок. */
export function FlowHeader({
  title,
  subtitle,
  right,
  backTo,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  backTo?: string
}) {
  const navigate = useNavigate()
  return (
    <header className={s.flow}>
      <div className={s.flowInner}>
        <button
          type="button"
          className={s.back}
          aria-label={t.common.back}
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        >
          ←
        </button>
        <div className={s.flowTitles}>
          <span className={s.flowTitle}>{title}</span>
          {subtitle && <span className={s.flowSubtitle}>{subtitle}</span>}
        </div>
        {right && <div className={s.flowRight}>{right}</div>}
      </div>
    </header>
  )
}
