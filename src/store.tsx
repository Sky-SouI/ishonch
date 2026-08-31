import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { sabina } from './data/seed'
import type { Campaign, Donation } from './data/seed'
import { receiptNumber } from './lib/format'
import { t } from './i18n/ru'

/*
 * Состояние прототипа целиком лежит в памяти вкладки: бэкенда нет,
 * перезагрузка страницы возвращает seed-данные. Перевод, сделанный в
 * демонстрации, дописывается в реестр и увеличивает собранную сумму —
 * чтобы поток «донат → реестр → отчёт» был виден целиком.
 */

export type CompletedDonation = {
  n: number
  amount: number
  named: boolean
  comment: string
  method: string
  receipt: string
  raisedAfter: number
}

type Store = {
  campaign: Campaign
  lastDonation: CompletedDonation | null
  donate: (input: { amount: number; named: boolean; comment: string; method: string }) => CompletedDonation
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useState<Campaign>(sabina)
  const [lastDonation, setLastDonation] = useState<CompletedDonation | null>(null)

  const donate = useCallback<Store['donate']>(
    ({ amount, named, comment, method }) => {
      const n = campaign.donors + 1
      const raisedAfter = campaign.raised + amount
      const record: Donation = {
        n,
        name: named ? t.donate.demoDonorName : t.donate.anonymous,
        note: comment,
        sum: amount,
        channel: method,
        time: 'только что',
      }
      setCampaign((prev) => ({
        ...prev,
        raised: raisedAfter,
        donors: n,
        lastDonation: 'только что',
        donations: [record, ...prev.donations],
      }))
      const completed: CompletedDonation = {
        n,
        amount,
        named,
        comment,
        method,
        receipt: receiptNumber(n),
        raisedAfter,
      }
      setLastDonation(completed)
      return completed
    },
    [campaign.donors, campaign.raised],
  )

  const value = useMemo<Store>(
    () => ({ campaign, lastDonation, donate }),
    [campaign, lastDonation, donate],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore вызван вне StoreProvider')
  return store
}
