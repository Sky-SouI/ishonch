/*
 * Снимает скриншоты экранов для README.
 *
 * Не часть приложения: вспомогательный скрипт, который поднимает собранный
 * прототип и фотографирует четыре мобильные поверхности и десктопную
 * страницу сбора. Требует установленного Chrome или Edge.
 *
 *   npm run build && npm run screenshots
 */

import { existsSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import puppeteer from 'puppeteer-core'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\//, '')
const OUT = new URL('../docs/screens/', import.meta.url).pathname.replace(/^\//, '')
const PORT = 4319

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

/** Статика из dist с SPA-фолбэком на index.html. */
function serve() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost')
      let file = join(DIST, normalize(decodeURIComponent(url.pathname)))
      if (!existsSync(file) || extname(file) === '') file = join(DIST, 'index.html')
      try {
        const body = await readFile(file)
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
        res.end(body)
      } catch {
        res.writeHead(404).end()
      }
    })
    server.listen(PORT, () => resolve(server))
  })
}

const shots = [
  { name: '01-campaign-mobile', path: '/c/sabina-leukemia', width: 390, full: true },
  { name: '02-donate-mobile', path: '/c/sabina-leukemia/donate', width: 390, full: true },
  { name: '03-create-mobile', path: '/create', width: 390, full: true, steps: 4 },
  { name: '04-catalog-mobile', path: '/', width: 390, full: true },
  { name: '05-campaign-desktop', path: '/c/sabina-leukemia', width: 1440, height: 1500, full: false },
  { name: '06-catalog-desktop', path: '/', width: 1440, height: 900, full: false },
  { name: '07-dashboard-desktop', path: '/dashboard', width: 1440, height: 1100, full: false },
]

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('Не найден Chrome или Edge. Укажите путь в CHROME_CANDIDATES.')
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })
const server = await serve()
const browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--font-render-hinting=none'] })

for (const shot of shots) {
  const page = await browser.newPage()
  await page.setViewport({
    width: shot.width,
    height: shot.height ?? 900,
    deviceScaleFactor: 2,
  })
  await page.goto(`http://localhost:${PORT}${shot.path}`, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  // Мастер создания сбора снимаем на шаге 5 — он детально прорисован в макете.
  if (shot.steps) {
    for (let i = 0; i < shot.steps; i += 1) {
      await page.evaluate(() => {
        const next = [...document.querySelectorAll('button')].find((b) =>
          b.textContent.trim().startsWith('Дальше'),
        )
        next?.click()
      })
      await new Promise((r) => setTimeout(r, 120))
    }
  }

  await new Promise((r) => setTimeout(r, 350))
  await page.screenshot({ path: join(OUT, `${shot.name}.png`), fullPage: shot.full })
  console.log(`✓ ${shot.name}.png`)
  await page.close()
}

await browser.close()
server.close()
