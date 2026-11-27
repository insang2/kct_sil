// 실제 Git 콘텐츠 발행·갱신일 기반 섹션·시리즈별 고정 날짜 (미래 날짜 금지, ≤ 2026-11-27 UTC/KST 안전)
export const ORG_ENTITY = {
  '@type': 'Organization',
  '@id': 'https://kconstrade.com/#organization',
  name: '한국건설트레이딩 (KCT)',
  url: 'https://kconstrade.com',
} as const

export const SITE_DATES = {
  home: '2026-11-26',
  about: '2026-11-25',
  export: '2026-11-21',
  quote: '2026-11-21',
  technicalHub: '2026-11-28',
} as const

export const SERIES_DATES: Record<string, string> = {
  fire: '2026-11-21',       // 내화 실란트 기술 매뉴얼
  industrial: '2026-11-23', // 산업·가전·유지보수 선정 가이드
  basics: '2026-11-26',     // 실리콘 일반 교육
  psa: '2026-11-27',        // 실리콘 점착제(PSA) 선택 요령 허브·2024 최신판
  psa2006: '2026-11-26',    // 실리콘 PSA 2006 구판 페이지
  tapes: '2026-11-27',      // 전기·전자 테이프용 PSA
  selection: '2026-11-28',  // DOWSIL 실란트 비교·선택 가이드
}

export function seriesPageDate(seriesKey: string, doc?: string): string {
  if (seriesKey === 'psa' && doc?.startsWith('2006')) return SERIES_DATES.psa2006
  return SERIES_DATES[seriesKey] ?? SITE_DATES.technicalHub
}
