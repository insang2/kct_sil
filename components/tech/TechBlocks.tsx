import type { Block, Cell } from '@/lib/tech-manual/types'
import { DATA } from '@/lib/tech-manual'
import { ProductCards, Matrix, AdhMatrix } from './ProductBlocks'

type Lang = 'ko' | 'en'
const INK = '#16142F'
const SUB = '#555370'
const t = (c: Cell, lang: Lang) => (typeof c === 'string' ? c : lang === 'ko' ? c[1] : c[0])

// ko 페이지에서는 번역문 아래에 영문 원문을 접어서 함께 제공한다.
function Original({ en, lang }: { en: string; lang: Lang }) {
  if (lang !== 'ko') return null
  return (
    <details className="tech-orig mb-3">
      <summary>English original</summary>
      <p className="mb-0">{en}</p>
    </details>
  )
}

function Table({ head, rows, lang, compact }: { head: Cell[]; rows: Cell[][]; lang: Lang; compact?: boolean }) {
  return (
    <div className={`tech-table-wrap${compact ? ' tech-table-big' : ''}`}>
      <table className="table table-sm tech-table mb-0">
        <thead>
          <tr>{head.map((c, i) => <th key={i}>{t(c, lang)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{t(c, lang) || '–'}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TechBlocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.k) {
          case 'p':
            return (
              <div key={i}>
                <p className="tech-p">{lang === 'ko' ? b.ko : b.en}</p>
                <Original en={b.en} lang={lang} />
              </div>
            )
          case 'h':
            return <h3 key={i} className="tech-h3">{lang === 'ko' ? b.ko : b.en}</h3>
          case 'note':
            return (
              <div key={i} className="tech-note">
                {lang === 'ko' ? b.ko : b.en}
                {lang === 'ko' && <details className="tech-orig mt-2 mb-0"><summary>English original</summary><p className="mb-0">{b.en}</p></details>}
              </div>
            )
          case 'ul':
            return (
              <div key={i}>
                <ul className="tech-ul">
                  {b.items.map(([en, ko], j) => <li key={j}>{lang === 'ko' ? ko : en}</li>)}
                </ul>
                {lang === 'ko' && (
                  <details className="tech-orig mb-3">
                    <summary>English original</summary>
                    <ul className="mb-0">{b.items.map(([en], j) => <li key={j}>{en}</li>)}</ul>
                  </details>
                )}
              </div>
            )
          case 'fig':
            return (
              <figure key={i} className="tech-fig">
                <img src={b.src} alt={lang === 'ko' ? b.ko : b.en} loading="lazy" />
                <figcaption>{lang === 'ko' ? b.ko : b.en}</figcaption>
                {lang === 'ko' && <details className="tech-orig mt-1 mb-0"><summary>English caption</summary><p className="mb-0">{b.en}</p></details>}
              </figure>
            )
          case 'figs':
            return (
              <div key={i} className="row g-3 mb-4">
                {b.items.map((f, j) => (
                  <div key={j} className={b.items.length === 1 ? 'col-12' : 'col-md-6'}>
                    <figure className="tech-fig h-100">
                      <img src={f.src} alt={lang === 'ko' ? f.ko : f.en} loading="lazy" />
                      <figcaption>{lang === 'ko' ? f.ko : f.en}</figcaption>
                      {lang === 'ko' && <details className="tech-orig mt-1 mb-0"><summary>English caption</summary><p className="mb-0">{f.en}</p></details>}
                    </figure>
                  </div>
                ))}
              </div>
            )
          case 'tbl':
            return (
              <div key={i} className="mb-4">
                {b.title && <div className="tech-table-title">{lang === 'ko' ? b.title.ko : b.title.en}</div>}
                <Table head={b.head} rows={b.rows} lang={lang} />
                {b.note && <div className="tech-table-note">{lang === 'ko' ? b.note.ko : b.note.en}</div>}
              </div>
            )
          case 'prods':
            return <ProductCards key={i} ids={b.ids} lang={lang} />
          case 'matrix':
            return <Matrix key={i} ids={b.ids} kind={b.kind} lang={lang} />
          case 'adh':
            return <AdhMatrix key={i} ids={b.ids} lang={lang} />
          case 'data': {
            const d = DATA[b.id]
            return (
              <div key={i} className="mb-4">
                <div className="tech-table-note mb-2">
                  {lang === 'ko' ? `총 ${d.rows.length}개 시험 결과 · 표를 좌우·상하로 스크롤할 수 있습니다.` : `${d.rows.length} test results · scroll the table horizontally and vertically.`}
                </div>
                <Table head={d.head} rows={d.rows} lang={lang} compact />
              </div>
            )
          }
        }
      })}
    </>
  )
}

export const techCss = `
.tech-faq{background:#fff;border:1px solid #e1e5f0;border-radius:12px;padding:.8rem 1.1rem;margin-bottom:.7rem}
.tech-faq summary{cursor:pointer;font-weight:700;color:#16142F;line-height:1.5}
.tech-faq p{margin:.6rem 0 0;color:#16142F;line-height:1.8}
.tech-prod{background:#fff;border:1px solid #e1e5f0;border-radius:14px;padding:1.2rem 1.3rem;margin-bottom:1.3rem}
.tech-prod-title{font-size:1.15rem;font-weight:700;color:#16142F;margin:0 0 .4rem}
.tech-chips span{display:inline-block;background:#eef3ff;color:#1558D6;border-radius:999px;font-size:.72rem;font-weight:600;padding:.15rem .7rem;margin:0 .4rem .6rem 0}
.tech-dl{margin:0 0 1rem;color:#16142F}
.tech-dl dt{font-size:.78rem;font-weight:700;color:#555370;text-transform:none;margin-top:.7rem}
.tech-dl dd{margin:.15rem 0 0;line-height:1.7;font-size:.95rem}
.tech-p{color:${INK};line-height:1.85;font-size:1rem;margin-bottom:.9rem}
.tech-h3{color:${INK};font-size:1.15rem;font-weight:700;margin:1.8rem 0 .8rem}
.tech-ul{color:${INK};line-height:1.8;padding-left:1.2rem;margin-bottom:.9rem}
.tech-ul li{margin-bottom:.45rem}
.tech-orig{font-size:.82rem;color:${SUB};background:#f6f7fb;border-radius:8px;padding:.4rem .8rem}
.tech-orig summary{cursor:pointer;font-weight:600;color:#1558D6}
.tech-orig p,.tech-orig ul{margin-top:.5rem;line-height:1.7}
.tech-note{background:#eef3ff;border-left:4px solid #1558D6;color:${INK};padding:.8rem 1rem;border-radius:6px;margin:1rem 0;font-size:.92rem;line-height:1.7}
.tech-fig{margin:0 0 1.5rem;background:#fff;border:1px solid #e5e7f0;border-radius:12px;padding:.8rem;text-align:center}
.tech-fig img{max-width:100%;max-height:460px;width:auto;height:auto;object-fit:contain;border-radius:6px}
.tech-fig figcaption{color:${SUB};font-size:.85rem;line-height:1.6;margin-top:.6rem;text-align:left}
.tech-table-title{font-weight:700;color:${INK};margin-bottom:.5rem;font-size:.95rem}
.tech-table-note{color:${SUB};font-size:.8rem;margin-top:.4rem}
.tech-table-wrap{overflow:auto;border:1px solid #dfe3ee;border-radius:10px;background:#fff}
.tech-table-big{max-height:70vh}
.tech-table{--bs-table-bg:#fff;--bs-table-color:${INK};font-size:.8rem;margin:0}
.tech-table th{background:#1f3a5f;color:#fff;font-weight:600;white-space:nowrap;position:sticky;top:0;z-index:1;padding:.5rem .6rem}
.tech-table tbody th{border-color:#edf0f6;font-weight:600}
.tech-table td{color:${INK};padding:.4rem .6rem;vertical-align:top;border-color:#edf0f6;background:#fff}
.tech-table tbody tr:nth-child(even) td{background:#f7f9fc}
.tech-table-big .tech-table{font-size:.72rem}
.tech-table-big .tech-table td{white-space:nowrap}
`
