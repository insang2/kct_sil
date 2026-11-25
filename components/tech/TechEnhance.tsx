'use client'
import { useEffect, useState } from 'react'

// 읽기 진행 막대 + 목차 현재 위치 강조(scroll-spy) + 맨 위로 버튼
export default function TechEnhance({ lang }: { lang: string }) {
  const [pct, setPct] = useState(0)
  const [top, setTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
      setTop(h.scrollTop > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('aside a[href^="#"]'))
    const map = new Map<string, HTMLAnchorElement>()
    links.forEach((a) => map.set(a.getAttribute('href')!.slice(1), a))
    const targets = Array.from(map.keys()).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!targets.length || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current') })
            const a = map.get(e.target.id)
            if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location') }
          }
        })
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const label = lang === 'ko' ? '맨 위로' : 'Back to top'
  return (
    <>
      <div className="tech-progress" role="progressbar" aria-label={lang === 'ko' ? '읽기 진행률' : 'Reading progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
        <span style={{ width: `${pct}%` }} />
      </div>
      {top && (
        <button type="button" className="tech-top" aria-label={label} title={label} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="bi bi-arrow-up" />
        </button>
      )}
    </>
  )
}
