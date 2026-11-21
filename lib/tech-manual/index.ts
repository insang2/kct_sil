import type { Cell, TechPage } from './types'
import { PAGES_A } from './pages-a'
import { PAGES_B } from './pages-b'
import { PAGES_C } from './pages-c'
import tables from './tables.json'

export const PAGES: TechPage[] = [...PAGES_A, ...PAGES_B, ...PAGES_C].sort((a, b) => a.no - b.no)
export const getPage = (slug: string) => PAGES.find((p) => p.slug === slug)
export const MANUAL_PDF = '/docs/fire-rated-dow-technologies-technical-manual.pdf'
export const MANUAL_TITLE = { en: 'Fire-rated Dow Technologies Technical Manual', ko: 'Dow 내화 기술 매뉴얼 (Fire-rated Dow Technologies Technical Manual)' }

const H = (en: string, ko: string): Cell => [en, ko]
export const DATA: Record<string, { head: Cell[]; rows: string[][]; compact?: boolean }> = {
  walls: {
    head: [H('Silicone', '실리콘'), H('Type', '유형'), H('Bite width', '접착 폭'), H('Thickness/ depth', '두께/깊이'), H('Orientation (V/H)', '방향(V/H)'), H('Single-double', '단일/이중'), H('Backing type', '백업재 종류'), H('Backing thickness', '백업재 두께'), H('Density/ compression', '밀도/압축'), H('Wall material', '벽 재료'), H('Wall thickness', '벽 두께'), H('Tested standard', '시험 규격'), H('Integrity (E)', '차염성(E)'), H('Insulation (I)', '차열성(I)'), H('Report', '성적서')],
    rows: tables.walls,
  },
  floors: {
    head: [H('Material', '재료'), H('Drawing', '도면'), H('Bite width', '접착 폭'), H('Thickness/ depth', '두께/깊이'), H('Single-double', '단일/이중'), H('Shear movement', '전단 이동'), H('Backing type', '백업재 종류'), H('Backing thickness', '백업재 두께'), H('Density/ compression', '밀도/압축'), H('Wall material', '벽 재료'), H('Wall thickness', '벽 두께'), H('Tested standard', '시험 규격'), H('Integrity (E)', '차염성(E)'), H('Insulation (I)', '차열성(I)'), H('Report', '성적서')],
    rows: tables.floors,
  },
  pen_walls: {
    head: [H('Product', '제품'), H('Thickness/ depth', '두께/깊이'), H('Backing type', '백업재 종류'), H('Backing thickness', '백업재 두께'), H('Density', '밀도'), H('Penetration size', '관통부 크기'), H('Penetrants', '관통체'), H('Material', '재료'), H('Thickness', '두께'), H('Standard', '규격'), H('Integrity (E)', '차염성(E)'), H('Insulation (I)', '차열성(I)'), H('Drawing', '도면'), H('Report', '성적서')],
    rows: tables.pen_walls,
  },
  pen_floors: {
    head: [H('Product', '제품'), H('Thickness/ depth', '두께/깊이'), H('Penetration size', '관통부 크기'), H('Penetrants', '관통체'), H('Floor thickness', '바닥 두께'), H('Standard', '규격'), H('Integrity (E)', '차염성(E)'), H('Insulation', '차열성'), H('Drawing', '도면'), H('Report', '성적서')],
    rows: tables.pen_floors,
  },
}
