import { byId, specRows, GROUP_LABEL, GROUP_PAGE } from './data'

const BASE = 'https://kconstrade.com'

// 제품 한 건의 schema.org Product (가격 없음 — 기술 자료용)
export function productLd(id: string, lang: string) {
  const p = byId(id)
  const l = lang === 'ko' ? 'ko' : 'en'
  const props = specRows(p.group)
    .filter(([k]) => p.specs[k] && p.specs[k] !== '–' && p.specs[k] !== '—')
    .map(([k, label]) => ({ '@type': 'PropertyValue', name: label.en, value: p.specs[k] }))
  if (p.variants) {
    p.variants.forEach((v) => props.push({ '@type': 'PropertyValue', name: `Density, kg/m3${v.color ? ` (${v.color})` : ''}`, value: v.density }))
  }
  return {
    '@type': 'Product',
    '@id': `${BASE}/${lang}/technical/industrial/${GROUP_PAGE[p.group]}#${p.id}`,
    name: p.name,
    brand: { '@type': 'Brand', name: p.brand },
    category: GROUP_LABEL[p.group].en,
    description: [p.features.en, p.uses.en, p.apps.en].filter(Boolean).join(' — ').slice(0, 480),
    inLanguage: l,
    url: `${BASE}/${lang}/technical/industrial/${GROUP_PAGE[p.group]}#${p.id}`,
    additionalProperty: props,
  }
}
