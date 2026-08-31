/*
 * Демонстрационные данные прототипа. Перенесены дословно из hi-fi макета.
 * Реального бэкенда нет: всё, что здесь лежит, показывается как есть,
 * и в интерфейсе помечено как демонстрационное (см. components/DemoMark).
 */

export type VerificationCheck = {
  title: string
  detail: string
}

export type Donation = {
  n: number
  name: string
  note: string
  sum: number
  channel: string
  time: string
}

export type Payout = {
  payee: string
  purpose: string
  sum: number
  date: string
  document: string
}

export type Update = {
  date: string
  title: string
  text: string
  document: string
  hasScan: boolean
}

export type CampaignFile = {
  name: string
  meta: string
}

export type Campaign = {
  slug: string
  number: string
  title: string
  category: string
  city: string
  raised: number
  goal: number
  donors: number
  lastDonation: string
  publishedAt: string
  deadline: string
  deadlineShort: string
  daysLeft: number
  organizer: { name: string; shortName: string; relation: string; city: string }
  beneficiary: { name: string; detail: string }
  payTo: { name: string; detail: string; shortDetail: string }
  verifiedAt: string
  checks: VerificationCheck[]
  storyShort: string[]
  storyFull: string[]
  payouts: Payout[]
  donations: Donation[]
  updates: Update[]
  files: CampaignFile[]
  deadlineNote: string
}

export const sabina: Campaign = {
  slug: 'sabina-leukemia',
  number: '0412',
  title: 'Лечение лейкоза для четырёхлетней Сабины',
  category: 'Лечение',
  city: 'Ташкент',
  raised: 112_400_000,
  goal: 180_000_000,
  donors: 312,
  lastDonation: '7 минут назад',
  publishedAt: '12.08.2026',
  deadline: '30.09.2026',
  deadlineShort: '30.09',
  daysLeft: 30,
  organizer: {
    name: 'Дилноза Раупова',
    shortName: 'Дилноза Р.',
    relation: 'мать получателя · личность подтверждена',
    city: 'мать · Ташкент',
  },
  beneficiary: {
    name: 'Сабина Раупова, 4 года',
    detail: 'острый лимфобластный лейкоз',
  },
  payTo: {
    name: 'Клиника «Ilhom Med»',
    detail: 'расчётный счёт, не карта',
    shortDetail: 'счёт клиники',
  },
  verifiedAt: '14.08.2026',
  checks: [
    {
      title: 'Личность сборщика подтверждена',
      detail: 'MyID, биометрия · Раупова Дилноза, паспорт AD•••4271',
    },
    {
      title: 'Родство с получателем подтверждено',
      detail: 'Свидетельство о рождении · мать и дочь',
    },
    {
      title: 'Медицинские документы проверены',
      detail: 'Выписка НИИ гематологии, счёт клиники на 180 000 000 сум',
    },
    {
      title: 'Реквизиты получателя сверены',
      detail: 'Расчётный счёт клиники «Ilhom Med», ИНН 30•••912',
    },
  ],
  storyShort: [
    'Меня зовут Дилноза, моей дочери Сабине четыре года. В июне врачи нашли лейкоз. Мы начали лечение в Ташкенте, но следующий блок химиотерапии и препараты нам нужно оплатить самим.',
    'Я работаю швеёй, муж — водитель. Мы собрали, сколько смогли, и продали машину. Осталось 180 миллионов, которые клиника просит внести до конца сентября.',
  ],
  storyFull: [
    'Меня зовут Дилноза, моей дочери Сабине четыре года. В июне врачи нашли острый лимфобластный лейкоз. Мы начали лечение в Ташкенте: первый блок химиотерапии прошёл, Сабина держится, но следующий блок и препараты нам нужно оплатить самим.',
    'Я работаю швеёй, муж — водитель. Мы собрали, сколько смогли, продали машину и заняли у родственников. Осталось 180 миллионов сум, которые клиника просит внести до конца сентября — иначе лечение придётся прерывать, а при её диагнозе перерыв опасен.',
    'Счёт от клиники и выписка приложены к сбору, деньги идут прямо на счёт больницы. Я буду публиковать здесь каждый документ и каждую выписку. Спасибо всем, кто уже помог.',
  ],
  payouts: [
    {
      payee: 'Клиника «Ilhom Med»',
      purpose: 'Химиотерапия, блок 2',
      sum: 60_000_000,
      date: '18.08.2026',
      document: 'Платёжка',
    },
    {
      payee: 'Аптека «Shifo»',
      purpose: 'Препараты по рецепту',
      sum: 12_800_000,
      date: '24.08.2026',
      document: 'Счёт-фактура',
    },
  ],
  donations: [
    { n: 312, name: 'Азиза Т.', note: 'Держитесь, всё будет хорошо', sum: 100_000, channel: 'Click', time: '7 мин' },
    { n: 311, name: 'Анонимно', note: '', sum: 500_000, channel: 'Payme', time: '31 мин' },
    { n: 310, name: 'Ойбек Х.', note: 'От нашей смены на заводе', sum: 250_000, channel: 'Uzum', time: '1 ч' },
    { n: 309, name: 'Мадина', note: 'Сабина, выздоравливай', sum: 30_000, channel: 'Click', time: '2 ч' },
    { n: 308, name: 'Анонимно', note: '', sum: 20_000, channel: 'Humo', time: '2 ч' },
    { n: 307, name: 'Шахзод Р.', note: 'Держитесь', sum: 150_000, channel: 'Payme', time: '3 ч' },
    { n: 306, name: 'Анонимно', note: 'От коллег из Namangan', sum: 1_000_000, channel: 'Перевод', time: '4 ч' },
    { n: 305, name: 'Гулнора А.', note: '', sum: 50_000, channel: 'Click', time: '5 ч' },
  ],
  updates: [
    {
      date: '24 августа 2026',
      title: 'Второй блок химиотерапии начали',
      text: 'Сабину положили в среду. Из собранного клиника получила 60 миллионов сум, выписку и платёжное поручение прикладываю.',
      document: '2 документа приложено',
      hasScan: true,
    },
    {
      date: '19 августа 2026',
      title: 'Купили препараты по рецепту',
      text: 'Аптека «Shifo» отпустила лекарства на 12 800 000 сум, счёт-фактура в документах сбора.',
      document: '1 документ приложен',
      hasScan: false,
    },
    {
      date: '16 августа 2026',
      title: 'Спасибо первым ста людям',
      text: 'За четыре дня собрали треть суммы. Врач сказал, что в сроки лечения мы укладываемся.',
      document: '',
      hasScan: false,
    },
  ],
  files: [
    { name: 'Выписка НИИ гематологии', meta: 'PDF · загружено 12.08.2026 · проверено' },
    { name: 'Счёт клиники «Ilhom Med»', meta: 'PDF · 180 000 000 сум · проверено' },
    { name: 'Свидетельство о рождении', meta: 'JPG · подтверждает родство · проверено' },
    { name: 'Платёжное поручение №1', meta: 'PDF · 60 000 000 сум · 18.08.2026' },
    { name: 'Счёт-фактура аптеки', meta: 'PDF · 12 800 000 сум · 24.08.2026' },
    { name: 'Справка о диагнозе', meta: 'PDF · загружено 12.08.2026 · проверено' },
  ],
  deadlineNote:
    'Если цель не собрана к сроку, собранное уходит клинике на лечение Сабины, сбор закрывается с публичным отчётом о каждом поступлении.',
}

export type CampaignCategory = 'Лечение' | 'Реабилитация' | 'Помощь семье'

/** Карточки каталога. У Сабины страница раскрыта полностью, остальные — витрина. */
export type CampaignCard = {
  slug: string
  title: string
  raised: number
  goal: number
  meta: string
  category: CampaignCategory
  urgent: boolean
}

export const campaignCards: CampaignCard[] = [
  {
    slug: 'sabina-leukemia',
    title: 'Лечение лейкоза для четырёхлетней Сабины',
    raised: 112_400_000,
    goal: 180_000_000,
    meta: '312 человек · до 30.09.2026',
    category: 'Лечение',
    urgent: true,
  },
  {
    slug: 'rustam-heart',
    title: 'Операция на сердце для Рустама, 52 года',
    raised: 38_000_000,
    goal: 95_000_000,
    meta: '104 человека · до 12.10.2026',
    category: 'Лечение',
    urgent: false,
  },
  {
    slug: 'nigora-rehab',
    title: 'Реабилитация после ДТП: Нигора снова учится ходить',
    raised: 21_600_000,
    goal: 40_000_000,
    meta: '87 человек · до 05.10.2026',
    category: 'Реабилитация',
    urgent: false,
  },
  {
    slug: 'yusupov-family',
    title: 'Семье Юсуповых после пожара в Намангане',
    raised: 9_200_000,
    goal: 28_000_000,
    meta: '61 человек · до 20.09.2026',
    category: 'Помощь семье',
    urgent: true,
  },
]

/** Пресеты суммы доната, сум. */
export const donationPresets = [20_000, 50_000, 100_000, 300_000]
export const minDonation = 5_000

export type PaymentMethod = {
  id: string
  name: string
  hint: string
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'click', name: 'Click', hint: 'через приложение Click' },
  { id: 'payme', name: 'Payme', hint: 'через приложение Payme' },
  { id: 'uzum', name: 'Uzum Bank', hint: 'через приложение Uzum' },
  { id: 'card', name: 'Карта Humo / Uzcard', hint: 'ввести номер карты' },
  { id: 'manual', name: 'Перевод на карту вручную', hint: 'реквизиты клиники, чек прикрепить' },
]

/** Документы шага 5 мастера создания сбора. */
export type DocState = 'готово' | 'нужно' | 'проверяем'

export const wizardDocs: { name: string; hint: string; state: DocState }[] = [
  { name: 'Выписка из больницы', hint: 'приложено 2 файла · проверено', state: 'готово' },
  { name: 'Счёт клиники на сумму сбора', hint: 'приложен 1 файл · проверено', state: 'готово' },
  { name: 'Свидетельство о рождении дочери', hint: 'подтверждает родство', state: 'нужно' },
  { name: 'Реквизиты клиники', hint: 'сверим сами после загрузки счёта', state: 'проверяем' },
]

/** Показатели кабинета сборщика. */
export const dashboardStats = [
  { label: 'собрано', value: 112_400_000, note: '62% от цели' },
  { label: 'поступлений', value: 312, note: 'последнее 7 минут назад' },
  { label: 'выплачено целево', value: 72_800_000, note: 'клиника и аптека' },
  { label: 'осталось собрать', value: 67_600_000, note: '30 дней до срока' },
]
