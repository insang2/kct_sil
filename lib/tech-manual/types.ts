// Fire-rated Dow Technologies Technical Manual (Dow Form No. 62-2233-01-0325) — 사이트용 데이터 구조
export type L = { en: string; ko: string }
export type Cell = string | [string, string] // 문자열이면 두 언어 공통, 튜플이면 [en, ko]

export type Block =
  | { k: 'p'; en: string; ko: string }
  | { k: 'h'; en: string; ko: string }
  | { k: 'ul'; items: [string, string][] }
  | { k: 'fig'; src: string; en: string; ko: string }
  | { k: 'figs'; items: { src: string; en: string; ko: string }[] }
  | { k: 'tbl'; title?: L; head: Cell[]; rows: Cell[][]; note?: L; big?: boolean }
  | { k: 'data'; id: 'walls' | 'floors' | 'pen_walls' | 'pen_floors' }
  | { k: 'note'; en: string; ko: string }
  | { k: 'prods'; ids: string[] }
  | { k: 'matrix'; ids: string[]; kind: 'sealant' | 'hotmelt' | 'foam' }
  | { k: 'adh'; ids: string[] }

export interface Section { id: string; h: L; blocks: Block[] }

export interface TechPage {
  slug: string
  no: number
  pdfPages: string // 원문 페이지
  title: L
  summary: L
  image: string // 허브 카드·상단 이미지
  sections: Section[]
}

export const p = (en: string, ko: string): Block => ({ k: 'p', en, ko })
export const h = (en: string, ko: string): Block => ({ k: 'h', en, ko })
export const ul = (...items: [string, string][]): Block => ({ k: 'ul', items })
export const fig = (src: string, en: string, ko: string): Block => ({ k: 'fig', src, en, ko })
export const figs = (...items: { src: string; en: string; ko: string }[]): Block => ({ k: 'figs', items })
export const note = (en: string, ko: string): Block => ({ k: 'note', en, ko })
export const sec = (id: string, en: string, ko: string, ...blocks: Block[]): Section => ({ id, h: { en, ko }, blocks })
export const IMG = (n: string) => `/assets/tech/${n}.jpg`
