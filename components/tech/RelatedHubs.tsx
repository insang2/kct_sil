import Link from 'next/link'
import { HUBS } from '@/lib/series/hubs'

// 현재 자료를 제외한 다른 기술정보 허브 안내
export default function RelatedHubs({ lang, l, current }: { lang: string; l: 'ko' | 'en'; current: string }) {
  const ko = l === 'ko'
  return (
    <section aria-labelledby="related-hubs" className="mt-5">
      <h2 id="related-hubs" className="fw-bold mb-3" style={{ color: '#16142F', fontSize: '1.2rem' }}>{ko ? '다른 기술정보 자료' : 'More technical resources'}</h2>
      <div className="row g-3">
        {HUBS.filter((h) => h.key !== current).map((h) => (
          <div key={h.key} className="col-md-4">
            <Link href={`/${lang}/${h.path}`} className="d-block p-3 border rounded-4 text-decoration-none h-100">
              <i className={`bi ${h.icon}`} style={{ color: '#1558D6', fontSize: '1.3rem' }} />
              <div className="fw-bold mt-1" style={{ color: '#16142F', fontSize: '.95rem', lineHeight: 1.4 }}>{h.title[l]}</div>
              <div style={{ color: '#555370', fontSize: '.85rem', lineHeight: 1.55 }}>{h.desc[l]}</div>
              <div style={{ color: '#1558D6', fontSize: '.8rem', fontWeight: 600, marginTop: 6 }}>{h.count}{ko ? '개 페이지' : ' pages'} →</div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
