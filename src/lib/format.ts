/**
 * Форматирование сумм по правилу макета: разряды разделяются пробелом.
 * Используется вместе с классом .mono (монотип + tabular-nums).
 */
export function money(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** Процент сбора, округлённый до целого — как в макете (62%). */
export function percent(raised: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.round((raised / goal) * 100)
}

/** Точная ширина полосы прогресса: макет использует 62.4%, не округлённое значение. */
export function progressWidth(raised: number, goal: number): string {
  if (goal <= 0) return '0%'
  return `${Math.min(100, (raised / goal) * 100).toFixed(1)}%`
}

/** Склонение существительного после числа: 1 человек, 2 человека, 5 человек. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

/** Номер квитанции демонстрационного перевода: ISH-ГГММДД-НННН. */
export function receiptNumber(n: number, date = new Date()): string {
  const yy = String(date.getFullYear()).slice(2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `ISH-${yy}${mm}${dd}-${String(n).padStart(4, '0')}`
}
