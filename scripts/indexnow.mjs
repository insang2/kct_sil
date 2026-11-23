// 배포 후 사이트맵의 모든 URL을 IndexNow(Bing·Naver·Yandex·Seznam 등)에 제출한다.
// 실패해도 배포를 막지 않는다. 사용: node scripts/indexnow.mjs  (INDEXNOW_KEY, SITE_URL 환경변수로 덮어쓰기 가능)
import { readdirSync } from 'node:fs'

const SITE = (process.env.SITE_URL || 'https://kconstrade.com').replace(/\/$/, '')
const HOST = new URL(SITE).host
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
  'https://yandex.com/indexnow',
  'https://search.seznam.cz/indexnow',
]

// 키 파일: public/<32자리 hex>.txt (내용 = 파일명)
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
const KEY = process.env.INDEXNOW_KEY || keyFile?.replace('.txt', '')
if (!KEY) { console.log('[indexnow] 키 파일(public/<hex32>.txt)이 없어 건너뜁니다.'); process.exit(0) }

try {
  await new Promise((r) => setTimeout(r, 5000)) // 배포 반영 대기
  const keyRes = await fetch(`${SITE}/${KEY}.txt`)
  if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) throw new Error(`키 파일이 아직 공개되지 않았습니다 (${keyRes.status})`)

  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  const urlList = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))].filter((u) => u.startsWith(SITE))
  if (!urlList.length) throw new Error('사이트맵에서 URL을 찾지 못했습니다')

  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList })
  for (const ep of ENDPOINTS) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body, signal: AbortSignal.timeout(30000) })
      console.log(`[indexnow] ${new URL(ep).host} -> ${r.status} (${urlList.length} URLs)`)
    } catch (e) { console.log(`[indexnow] ${new URL(ep).host} 실패: ${e.message}`) }
  }
} catch (e) {
  console.log(`[indexnow] 건너뜀: ${e.message}`)
}
