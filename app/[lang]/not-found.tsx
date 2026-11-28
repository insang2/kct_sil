import type { Metadata } from 'next';
import Link from 'next/link';
import Tx from '@/components/tech/Tx';

// 상위 app/[lang]/layout.tsx의 robots(index, follow) 상속을 제거하여
// Next.js가 404 경계에 자동 삽입하는 <meta name="robots" content="noindex">만 단일 출력되도록 함
export const metadata: Metadata = {
  title: '404 — 페이지를 찾을 수 없습니다 | KCT',
  description: '요청하신 페이지를 찾을 수 없습니다. 홈, 제품정보 또는 기술자료로 이동해 주세요.',
  robots: null,
};

export default function LangNotFound() {
  return (
    <Tx>
      <section className="tx-hero tx-big">
        <div className="container">
          <span className="badge">404 NOT FOUND</span>
          <h1 className="fw-bold mt-3">
            404 <span className="tx-light">페이지를 찾을 수 없습니다</span>
          </h1>
          <p>
            주소가 변경되었거나 삭제된 페이지입니다. 아래 메뉴에서 원하시는 정보를 확인해 주세요.
            <br />
            <span style={{ fontSize: '0.95rem', color: '#9AA0A6' }}>
              The requested page could not be found. Please navigate using the links below.
            </span>
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link href="/ko" className="btn btn-light">
              홈으로 이동 →
            </Link>
            <Link href="/ko/products" className="btn btn-outline-light">
              제품정보 보기
            </Link>
            <Link href="/ko/technical" className="btn btn-outline-light">
              기술자료 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container pb-5">
          <div className="tx-cat-no mb-2">NAVIGATION</div>
          <h2 className="tx-sec-h">주요 페이지 바로가기</h2>

          <div className="tx-grid" style={{ marginTop: '2rem' }}>
            <Link href="/ko/products">
              <div className="tx-no mb-2">01</div>
              <h3>제품정보 <em>30종</em></h3>
              <p>DOWSIL™ 건축 외장·구조용·내화·프라이머 제품 사양과 TDS 다운로드</p>
            </Link>
            <Link href="/ko/technical">
              <div className="tx-no mb-2">02</div>
              <h3>기술자료 <em>Library</em></h3>
              <p>내화 매뉴얼, 실란트 비교·선정 가이드, PSA 및 실리콘 교육 자료</p>
            </Link>
            <Link href="/ko/quote">
              <div className="tx-no mb-2">03</div>
              <h3>B2B 견적서 <em>PDF</em></h3>
              <p>제품과 수량, 무역 조건을 선택해 견적서 PDF를 즉시 발급</p>
            </Link>
            <Link href="/ko/export">
              <div className="tx-no mb-2">04</div>
              <h3>수출 문의 <em>Export</em></h3>
              <p>FOB/CIF 조건, 수출 서류, 해외 바이어 맞춤 공급 상담</p>
            </Link>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--tx-line)', fontSize: '0.92rem' }}>
            <span className="fw-semibold" style={{ color: 'var(--tx-mute)' }}>English / 日本語</span>
            <Link href="/en" style={{ color: 'var(--tx-fg)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Home (EN)</Link>
            <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>·</span>
            <Link href="/en/products" style={{ color: 'var(--tx-fg)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Products (EN)</Link>
            <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>·</span>
            <Link href="/en/technical" style={{ color: 'var(--tx-fg)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Technical Library (EN)</Link>
            <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>·</span>
            <Link href="/ja" style={{ color: 'var(--tx-fg)', textDecoration: 'underline', textUnderlineOffset: 3 }}>ホーム (JA)</Link>
            <span aria-hidden="true" style={{ color: 'var(--tx-mute)' }}>·</span>
            <Link href="/ja/products" style={{ color: 'var(--tx-fg)', textDecoration: 'underline', textUnderlineOffset: 3 }}>製品情報 (JA)</Link>
          </div>
        </div>
      </section>
    </Tx>
  );
}
