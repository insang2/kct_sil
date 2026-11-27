import { PAGES } from '@/lib/tech-manual'
import { IPAGES } from '@/lib/industrial/pages'
import { SERIES } from './config'

export const TECH_UPDATED = '2026-11-27'

export interface Hub { key: string; path: string; title: { ko: string; en: string }; desc: { ko: string; en: string }; count: number; icon: string }

// 기술정보 4개 자료 허브 (메뉴·관련 자료·검색에서 공통 사용)
export const HUBS: Hub[] = [
  { key: 'fire', path: 'technical', icon: 'bi-fire', count: PAGES.length,
    title: { ko: '내화 실란트 기술 매뉴얼', en: 'Fire-rated Sealant Technical Manual' },
    desc: { ko: '화재 반응성·내화 성능, 선형 줄눈·관통부 시험, 연기 차단, 시공 지침', en: 'Reaction to fire, fire resistance, linear joints, penetrations, smoke control, installation' } },
  { key: 'industrial', path: 'technical/industrial', icon: 'bi-gear-wide-connected', count: IPAGES.length,
    title: { ko: '산업·가전·유지보수용 선정 가이드', en: 'Industrial, Appliance & Maintenance Guide' },
    desc: { ko: '아세톡시·알콕시·옥심·핫멜트 실란트와 실리콘 폼 38개 제품', en: '38 acetoxy, alkoxy, oxime, hot-melt sealants and silicone foams' } },
  { key: 'basics', path: 'technical/basics', icon: 'bi-mortarboard', count: SERIES.basics.pages.length,
    title: { ko: '실리콘 일반 교육', en: 'Silicone Basics Training' },
    desc: { ko: '실리콘의 화학·제조·특성·응용과 부록 데이터', en: 'Silicone chemistry, manufacturing, properties, applications and data' } },
  { key: 'psa', path: 'technical/psa', icon: 'bi-tape', count: SERIES.psa.pages.length,
    title: { ko: '실리콘 점착제(PSA) 선택 요령', en: 'Silicone PSA Selection Guide' },
    desc: { ko: '2024 최신판 포함, PSA 41종의 사양·선정·도포·경화·이형', en: '2024 edition included: 41 PSAs — specifications, selection, coating, cure, release' } },
  { key: 'tapes', path: 'technical/tapes', icon: 'bi-lightning-charge', count: SERIES.tapes.pages.length,
    title: { ko: '전기·전자 테이프용 PSA', en: 'Electrical Tape PSAs' },
    desc: { ko: '절연테이프용 Dow 점착제 20종, 선정표, 한국건설트레이딩 기술 지원', en: '20 Dow insulation-tape PSAs, selection table, KCT technical support' } },
]

export interface SearchItem { t: string; s: string; href: string; hub: string }

export function searchIndex(lang: string, l: 'ko' | 'en'): SearchItem[] {
  const hubName = (k: string) => HUBS.find((h) => h.key === k)!.title[l]
  return [
    ...PAGES.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/${p.slug}`, hub: hubName('fire') })),
    ...IPAGES.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/industrial/${p.slug}`, hub: hubName('industrial') })),
    ...Object.values(SERIES).flatMap((x) => x.pages.map((p) => ({ t: p.title[l], s: p.summary[l], href: `/${lang}/technical/${x.key}/${p.slug}`, hub: hubName(x.key) }))),
  ]
}
