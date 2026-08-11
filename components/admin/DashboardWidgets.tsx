'use client'

import { useState, useEffect } from 'react'

// ─── 세계 시각 ────────────────────────────────────────────────────────────────

const CITIES = [
  { name: '서울',   tz: 'Asia/Seoul',        flag: '🇰🇷', abbr: 'KST' },
  { name: '도쿄',   tz: 'Asia/Tokyo',        flag: '🇯🇵', abbr: 'JST' },
  { name: '베이징', tz: 'Asia/Shanghai',     flag: '🇨🇳', abbr: 'CST' },
  { name: '두바이', tz: 'Asia/Dubai',        flag: '🇦🇪', abbr: 'GST' },
  { name: '런던',   tz: 'Europe/London',     flag: '🇬🇧', abbr: 'GMT' },
  { name: '뉴욕',   tz: 'America/New_York',  flag: '🇺🇸', abbr: 'ET'  },
]

function getTime(tz: string) {
  const now = new Date()
  const time = new Intl.DateTimeFormat('ko-KR', {
    timeZone: tz,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(now)
  const date = new Intl.DateTimeFormat('ko-KR', {
    timeZone: tz,
    month: 'short', day: 'numeric', weekday: 'short',
  }).format(now)
  const hour = parseInt(new Intl.DateTimeFormat('en', {
    timeZone: tz, hour: 'numeric', hour12: false,
  }).format(now))
  const isNight = hour < 8 || hour >= 21
  return { time, date, isNight }
}

export function WorldClockWidget() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-globe-asia-australia text-primary" />
          세계 시각
        </h6>
      </div>
      <div className="card-body px-4 pb-4 pt-2">
        <div className="row g-2">
          {CITIES.map(city => {
            const { time, date, isNight } = getTime(city.tz)
            const isSeoul = city.name === '서울'
            return (
              <div key={city.name} className="col-6 col-md-4 col-lg-2">
                <div
                  className="rounded-3 p-3 text-center"
                  style={{
                    background: isSeoul ? '#1558D6' : isNight ? '#1e1e2e' : '#f8f9fa',
                    border: isSeoul ? 'none' : '1px solid #e9ecef',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>{city.flag}</div>
                  <div
                    className="fw-bold mt-1"
                    style={{
                      fontSize: '0.78rem',
                      color: isSeoul ? 'rgba(255,255,255,0.8)' : isNight ? 'rgba(255,255,255,0.6)' : '#6c757d',
                    }}
                  >
                    {city.name}
                  </div>
                  <div
                    className="fw-bold"
                    style={{
                      fontSize: '1.15rem',
                      letterSpacing: '-0.5px',
                      color: isSeoul || isNight ? '#fff' : '#1a1a2e',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {time.slice(0, 5)}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: isSeoul ? 'rgba(255,255,255,0.65)' : isNight ? 'rgba(255,255,255,0.45)' : '#adb5bd',
                    }}
                  >
                    {date}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── 환율 정보 ────────────────────────────────────────────────────────────────

interface RateInfo {
  code: string
  name: string
  flag: string
  krw: number
  multiply: number
  unit: string
  change?: number
}

const RATE_META = [
  { code: 'USD', name: '미국 달러',   flag: '🇺🇸', multiply: 1,   unit: '1 USD' },
  { code: 'EUR', name: '유럽 유로',   flag: '🇪🇺', multiply: 1,   unit: '1 EUR' },
  { code: 'JPY', name: '일본 엔화',   flag: '🇯🇵', multiply: 100, unit: '100 JPY' },
  { code: 'CNY', name: '중국 위안',   flag: '🇨🇳', multiply: 1,   unit: '1 CNY' },
  { code: 'SGD', name: '싱가포르 달러', flag: '🇸🇬', multiply: 1,  unit: '1 SGD' },
  { code: 'AUD', name: '호주 달러',   flag: '🇦🇺', multiply: 1,   unit: '1 AUD' },
]

function calcKrw(rates: Record<string, number>, usdKrw: number, code: string, multiply: number) {
  if (code === 'USD') return usdKrw * multiply
  const crossRate = rates[code]
  if (!crossRate) return 0
  return (usdKrw / crossRate) * multiply
}

export function ExchangeRateWidget() {
  const [rates, setRates] = useState<RateInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<string>('')
  const [error, setError] = useState(false)

  async function fetchRates() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/exchange-rates', { cache: 'no-store' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      const raw: Record<string, number> = json.rates
      const usdKrw: number = raw.KRW

      const computed = RATE_META.map(m => ({
        ...m,
        krw: Math.round(calcKrw(raw, usdKrw, m.code, m.multiply)),
      }))
      setRates(computed)
      setUpdatedAt(new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).format(new Date()) + ' KST')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRates() }, [])

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-currency-exchange text-success" />
          환율 정보
          <span className="badge bg-light text-secondary fw-normal ms-1" style={{ fontSize: '0.65rem' }}>vs KRW</span>
        </h6>
        <div className="d-flex align-items-center gap-2">
          {updatedAt && (
            <span className="text-body-secondary" style={{ fontSize: '0.72rem' }}>{updatedAt} 기준</span>
          )}
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-0"
            onClick={fetchRates}
            disabled={loading}
            style={{ fontSize: '0.75rem' }}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }} />
              : <i className="bi bi-arrow-clockwise" />}
          </button>
        </div>
      </div>
      <div className="card-body px-4 pb-4 pt-2">
        {error ? (
          <div className="text-body-secondary small text-center py-3">
            <i className="bi bi-wifi-off me-1" />환율 정보를 불러올 수 없습니다
          </div>
        ) : (
          <div className="row g-3">
            {(loading ? RATE_META : rates).map(r => (
              <div key={r.code} className="col-6 col-md-3">
                <div className="rounded-3 p-3 border" style={{ background: '#f8f9fa' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: '1.1rem' }}>{r.flag}</span>
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.78rem' }}>{r.code}</div>
                      <div className="text-body-secondary" style={{ fontSize: '0.68rem' }}>{r.name}</div>
                    </div>
                  </div>
                  {loading ? (
                    <div className="placeholder-glow">
                      <span className="placeholder col-8 rounded" style={{ height: 24 }} />
                    </div>
                  ) : (
                    <>
                      <div className="fw-bold text-dark" style={{ fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                        {(r as RateInfo).krw.toLocaleString('ko-KR')}
                        <span className="text-body-secondary fw-normal ms-1" style={{ fontSize: '0.7rem' }}>원</span>
                      </div>
                      <div className="text-body-secondary" style={{ fontSize: '0.7rem' }}>{r.unit}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 환율 계산기 ──────────────────────────────────────────────────────────────

const CALC_CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: '달러' },
  { code: 'EUR', flag: '🇪🇺', name: '유로' },
  { code: 'JPY', flag: '🇯🇵', name: '엔화' },
  { code: 'CNY', flag: '🇨🇳', name: '위안' },
  { code: 'SGD', flag: '🇸🇬', name: 'SGD' },
  { code: 'AUD', flag: '🇦🇺', name: 'AUD' },
]

export function FxCalculatorWidget() {
  const [rawRates, setRawRates] = useState<Record<string, number> | null>(null)
  const [fromCode, setFromCode] = useState('USD')
  const [toCode, setToCode] = useState('KRW')
  const [amount, setAmount] = useState('1000')

  useEffect(() => {
    fetch('/api/exchange-rates').then(r => r.json()).then(json => {
      if (json.rates) {
        const rates: Record<string, number> = { USD: 1, ...json.rates }
        setRawRates(rates)
      }
    }).catch(() => {})
  }, [])

  function convert(from: string, to: string, amt: number): number | null {
    if (!rawRates) return null
    const usdKrw = rawRates['KRW']
    const fromRate = from === 'USD' ? 1 : (from === 'KRW' ? usdKrw : rawRates[from])
    const toRate   = to   === 'USD' ? 1 : (to   === 'KRW' ? usdKrw : rawRates[to])
    if (!fromRate || !toRate) return null
    const usd = amt / fromRate
    return usd * toRate
  }

  const numAmt = parseFloat(amount) || 0
  const result = convert(fromCode, toCode, numAmt)

  const allCodes = ['KRW', ...CALC_CURRENCIES.map(c => c.code)]
  function flagFor(code: string) {
    if (code === 'KRW') return '🇰🇷'
    return CALC_CURRENCIES.find(c => c.code === code)?.flag ?? ''
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
        <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-calculator text-primary" />
          환율 계산기
          <span className="badge bg-light text-secondary fw-normal ms-1" style={{ fontSize: '0.65rem' }}>실시간</span>
        </h6>
      </div>
      <div className="card-body px-4 pb-4 pt-2">
        <div className="row g-3 align-items-end">
          {/* 금액 입력 */}
          <div className="col-md-3">
            <label className="form-label text-body-secondary mb-1" style={{ fontSize: '0.78rem' }}>금액</label>
            <input
              className="form-control fw-bold"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ fontSize: '1.1rem' }}
              placeholder="0"
            />
          </div>
          {/* 출발 통화 */}
          <div className="col-md-3">
            <label className="form-label text-body-secondary mb-1" style={{ fontSize: '0.78rem' }}>변환 전</label>
            <select className="form-select" value={fromCode} onChange={e => setFromCode(e.target.value)}>
              {allCodes.map(code => (
                <option key={code} value={code}>{flagFor(code)} {code}</option>
              ))}
            </select>
          </div>
          {/* 화살표 + 스왑 */}
          <div className="col-md-1 text-center pb-1">
            <button className="btn btn-light rounded-circle border" style={{ width: 36, height: 36, padding: 0 }}
              onClick={() => { const tmp = fromCode; setFromCode(toCode); setToCode(tmp) }}
              title="통화 교환">
              <i className="bi bi-arrow-left-right" style={{ fontSize: '0.85rem' }} />
            </button>
          </div>
          {/* 도착 통화 */}
          <div className="col-md-3">
            <label className="form-label text-body-secondary mb-1" style={{ fontSize: '0.78rem' }}>변환 후</label>
            <select className="form-select" value={toCode} onChange={e => setToCode(e.target.value)}>
              {allCodes.map(code => (
                <option key={code} value={code}>{flagFor(code)} {code}</option>
              ))}
            </select>
          </div>
          {/* 결과 */}
          <div className="col-md-2">
            <label className="form-label text-body-secondary mb-1" style={{ fontSize: '0.78rem' }}>결과</label>
            <div className="rounded-3 px-3 py-2 d-flex align-items-center"
              style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', minHeight: 38 }}>
              {rawRates === null ? (
                <span className="text-body-secondary" style={{ fontSize: '0.8rem' }}>로딩...</span>
              ) : result === null ? (
                <span className="text-body-secondary" style={{ fontSize: '0.8rem' }}>-</span>
              ) : (
                <span className="fw-bold text-primary" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>
                  {result >= 1000 ? result.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) : result.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
                  <span className="fw-normal ms-1" style={{ fontSize: '0.75rem' }}>{toCode}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 자주 쓰는 금액 버튼 */}
        <div className="d-flex gap-2 mt-3 flex-wrap">
          <span className="text-body-secondary align-self-center" style={{ fontSize: '0.75rem' }}>빠른 선택:</span>
          {[1000, 5000, 10000, 50000, 100000].map(v => (
            <button key={v} className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              style={{ fontSize: '0.75rem' }}
              onClick={() => setAmount(String(v))}>
              {v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
