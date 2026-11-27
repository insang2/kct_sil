import type { Metadata } from 'next';
import Link from 'next/link';

// 상위 app/[lang]/layout.tsx의 robots(index, follow) 상속을 제거하여
// Next.js가 404 경계에 자동 삽입하는 <meta name="robots" content="noindex">만 단일 출력되도록 함
export const metadata: Metadata = {
  title: '404 — 페이지를 찾을 수 없습니다 | KCT',
  description: '요청하신 페이지를 찾을 수 없습니다. 홈, 제품정보 또는 기술자료로 이동해 주세요.',
  robots: null,
};

export default function LangNotFound() {
  return (
    <section className="py-9 py-lg-11 bg-white" style={{ paddingTop: 140, paddingBottom: 96 }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-7">
            <p className="fw-bold text-primary mb-2" style={{ fontSize: '0.95rem', letterSpacing: '0.08em' }}>
              404 NOT FOUND
            </p>
            <h1 className="fw-bold mb-3" style={{ color: '#16142F', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
              요청하신 페이지를 찾을 수 없습니다
            </h1>
            <p className="mb-4" style={{ color: '#555370', lineHeight: 1.75 }}>
              주소가 변경되었거나 삭제된 페이지입니다. 아래 메뉴에서 원하시는 정보를 확인해 주세요.
              <br />
              <span style={{ fontSize: '0.92rem' }}>
                The requested page could not be found. Please navigate using the links below.
              </span>
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              <Link href="/ko" className="btn btn-primary rounded-pill px-4">
                홈으로 이동
              </Link>
              <Link href="/ko/products" className="btn btn-outline-primary rounded-pill px-4">
                제품정보 보기
              </Link>
              <Link href="/ko/technical" className="btn btn-outline-secondary rounded-pill px-4">
                기술자료 보기
              </Link>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-3" style={{ fontSize: '0.88rem' }}>
              <Link href="/en" className="text-decoration-none">Home (EN)</Link>
              <span aria-hidden="true" style={{ color: '#cbd5e1' }}>·</span>
              <Link href="/en/products" className="text-decoration-none">Products (EN)</Link>
              <span aria-hidden="true" style={{ color: '#cbd5e1' }}>·</span>
              <Link href="/en/technical" className="text-decoration-none">Technical Library (EN)</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
