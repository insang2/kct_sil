import { byId, GROUP_PAGE, GROUP_LABEL, specRows, FOAM_ROWS, SUBSTRATES, koColor, type IProduct } from '@/lib/industrial/data'
import { ADH_KO, SUB_KO } from '@/lib/industrial/ko'

type Lang = 'ko' | 'en'
const ADH_NOTE = { en: '* = consult your local Dow representative for further advice on adhesion properties.', ko: '* = 접착 특성에 관한 자세한 조언은 현지 Dow 담당자에게 문의하십시오.' }
const adh = (v: string, lang: Lang) => (lang === 'ko' ? ADH_KO[v] ?? v : v === '*' ? '* (consult Dow)' : v)
const val = (key: string, v: string, lang: Lang) => {
  if (!v) return '–'
  if (key === 'color' && lang === 'ko') return koColor(v)
  return v
}
const prodUrl = (lang: string, id: string) => `/${lang}/technical/industrial/${GROUP_PAGE[byId(id).group]}#${id}`

function SpecTable({ p, lang }: { p: IProduct; lang: Lang }) {
  const rows = specRows(p.group).filter(([k]) => p.specs[k] !== undefined)
  return (
    <table className="table table-sm tech-table mb-3">
      <tbody>
        {rows.map(([k, label]) => (
          <tr key={k}>
            <th scope="row" style={{ width: '48%', background: '#f3f5fa', color: '#16142F', position: 'static', whiteSpace: 'normal' }}>{label[lang]}</th>
            <td>{val(k, p.specs[k], lang)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ProductCards({ ids, lang }: { ids: string[]; lang: Lang }) {
  const ko = lang === 'ko'
  return (
    <div className="mb-4">
      {ids.map((id) => {
        const p = byId(id)
        const subs = Object.keys(p.adhesion).length ? SUBSTRATES.filter((s) => p.adhesion[s] !== undefined) : []
        return (
          <article key={id} id={id} className="tech-prod" style={{ scrollMarginTop: 90 }}>
            <header>
              <h3 className="tech-prod-title">{p.name}</h3>
              <div className="tech-chips">
                <span>{GROUP_LABEL[p.group][lang]}</span>
                <span>{p.brand}</span>
              </div>
            </header>
            <dl className="tech-dl">
              <dt>{ko ? '주요 특징 (Special features)' : 'Special features'}</dt>
              <dd>{p.features[lang]}</dd>
              {p.uses.en && (<><dt>{ko ? '주요 용도 (Primary uses)' : 'Primary uses'}</dt><dd>{p.uses[lang]}</dd></>)}
              {p.apps.en && (<><dt>{ko ? (p.group === 'primer' || p.group === 'cleaner' ? '적용 대상 (Applications)' : '적용 분야 (Applications)') : 'Applications'}</dt><dd>{p.apps[lang]}</dd></>)}
            </dl>
            {p.group === 'foam' && p.variants && (
              <div className="tech-table-wrap mb-3">
                <table className="table table-sm tech-table mb-0">
                  <thead><tr><th>{ko ? '항목' : 'Property'}</th>{p.variants.map((v, i) => <th key={i}>{v.color ? koColor2(v.color, ko) : (ko ? '기본' : 'Standard')}</th>)}</tr></thead>
                  <tbody>
                    {FOAM_ROWS.map(([k, label]) => (
                      <tr key={k}><td>{label[lang]}</td>{p.variants!.map((v, i) => <td key={i}>{v[k] || '–'}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {Object.keys(p.specs).length > 0 && <SpecTable p={p} lang={lang} />}
            {subs.length > 0 && (
              <details className="tech-orig">
                <summary>{ko ? '프라이머 없는 접착(Primerless adhesion) 등급 보기' : 'Primerless adhesion ratings'}</summary>
                <table className="table table-sm tech-table mt-2 mb-1">
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s}><td>{ko ? SUB_KO[s] ?? s : s}</td><td>{adh(p.adhesion[s], lang)}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="tech-table-note">{ADH_NOTE[lang]}</div>
              </details>
            )}
            {ko && (
              <details className="tech-orig mt-2">
                <summary>English original</summary>
                <p className="mb-1"><strong>Special features:</strong> {p.features.en}</p>
                {p.uses.en && <p className="mb-1"><strong>Primary uses:</strong> {p.uses.en}</p>}
                {p.apps.en && <p className="mb-0"><strong>Applications:</strong> {p.apps.en}</p>}
              </details>
            )}
          </article>
        )
      })}
    </div>
  )
}
const koColor2 = (c: string, ko: boolean) => (ko ? koColor(c) : c)

export function Matrix({ ids, kind, lang }: { ids: string[]; kind: 'sealant' | 'hotmelt' | 'foam'; lang: Lang }) {
  const ko = lang === 'ko'
  const ps = ids.map(byId)
  const link = (p: IProduct) => <a href={prodUrl(lang, p.id)} style={{ color: '#1558D6', fontWeight: 600 }}>{p.short}</a>
  if (kind === 'foam') {
    return (
      <div className="tech-table-wrap mb-4">
        <table className="table table-sm tech-table mb-0">
          <thead><tr><th>{ko ? '제품' : 'Product'}</th><th>{ko ? '색상' : 'Color'}</th>{FOAM_ROWS.map(([, l], i) => <th key={i}>{l[lang]}</th>)}</tr></thead>
          <tbody>
            {ps.flatMap((p) => (p.variants ?? []).map((v, i) => (
              <tr key={p.id + i}><td>{link(p)}</td><td>{v.color ? koColor2(v.color, ko) : '–'}</td>{FOAM_ROWS.map(([k], j) => <td key={j}>{v[k] || '–'}</td>)}</tr>
            )))}
          </tbody>
        </table>
      </div>
    )
  }
  const cols: [string, string, string][] = kind === 'hotmelt'
    ? [['sg', 'Specific gravity', '비중'], ['visc120', 'Viscosity 120°C, Pa·s', '120°C 점도, Pa·s'], ['green15', '15-min green strength, MPa', '15분 그린 스트렝스, MPa'], ['dur', 'Shore A', 'Shore A'], ['ten', 'Tensile, MPa', '인장, MPa'], ['elo', 'Elongation, %', '신율, %'], ['tear', 'Tear (B), pli', '인열(B), pli'], ['peel', 'Peel, pli', '박리, pli'], ['saft', 'SAFT, °C', 'SAFT, °C']]
    : [['temp', 'Service temp., °C', '사용 온도, °C'], ['skin', 'Skin-over, min', '피막, 분'], ['tack', 'Tack-free, min', '표면 건조, 분'], ['dur', 'Shore A', 'Shore A'], ['ten', 'Tensile, MPa', '인장, MPa'], ['elo', 'Elongation, %', '신율, %'], ['sg', 'Specific gravity', '비중'], ['color', 'Color', '색상']]
  return (
    <div className="tech-table-wrap mb-4">
      <table className="table table-sm tech-table mb-0">
        <thead><tr><th>{ko ? '제품' : 'Product'}</th>{cols.map(([, en, kk], i) => <th key={i}>{ko ? kk : en}</th>)}</tr></thead>
        <tbody>
          {ps.map((p) => (
            <tr key={p.id}><td>{link(p)}</td>{cols.map(([k], j) => <td key={j}>{val(k, p.specs[k], lang)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdhMatrix({ ids, lang }: { ids: string[]; lang: Lang }) {
  const ko = lang === 'ko'
  const ps = ids.map(byId).filter((p) => Object.keys(p.adhesion).length)
  const subs = SUBSTRATES.filter((s) => ps.some((p) => p.adhesion[s] !== undefined))
  return (
    <div className="mb-4">
      <div className="tech-table-wrap tech-table-big">
        <table className="table table-sm tech-table mb-0">
          <thead>
            <tr><th>{ko ? '기재 (Substrate)' : 'Substrate'}</th>{ps.map((p) => <th key={p.id}>{p.short}</th>)}</tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s}><td>{ko ? SUB_KO[s] ?? s : s}</td>{ps.map((p) => <td key={p.id}>{p.adhesion[s] !== undefined ? adh(p.adhesion[s], lang) : '–'}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tech-table-note">{ADH_NOTE[lang]}</div>
    </div>
  )
}
