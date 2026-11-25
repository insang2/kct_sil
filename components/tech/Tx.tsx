import type { ReactNode } from 'react'

// 기술정보 전용 디자인 시스템 (Pretendard · 본문 17px · 1360px 폭 · 헤어라인 그리드 · 다크 히어로)
// 사이트 다른 영역에는 영향이 없도록 .tx 범위 안에서만 적용한다.
export const txCss = `
.tx{--tx-bg:#F5F6F8;--tx-fg:#16181C;--tx-mute:#5d646b;--tx-line:rgba(22,24,28,.14);--tx-accent:#5b49e6;--tx-ink:#0C0D0F;
  font-family:"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;
  font-size:17px;line-height:1.7;letter-spacing:-.011em;color:var(--tx-fg);background:var(--tx-bg);word-break:keep-all;overflow-wrap:break-word}
.tx *{font-family:inherit}
.tx i[class^="bi"],.tx i[class*=" bi-"]{font-family:"bootstrap-icons" !important}
.tx .container{max-width:1360px;padding-left:clamp(20px,4vw,56px);padding-right:clamp(20px,4vw,56px)}
.tx .bg-white{background:var(--tx-bg) !important}
.tx .bg-light{background:#fff !important}
.tx .bg-primary{background:var(--tx-ink) !important}
.tx .bg-primary .btn-light{color:var(--tx-ink)}
.tx .bg-primary h1,.tx .bg-primary h2,.tx .bg-primary h3{color:#fff !important}
.tx .text-body-secondary{color:var(--tx-mute) !important}
.tx .text-dark{color:var(--tx-fg) !important}
.tx h1,.tx h2,.tx h3,.tx h4{color:var(--tx-fg);letter-spacing:-.03em;font-weight:650}
.tx p{color:inherit}

/* 히어로 */
.tx .tx-hero{background:var(--tx-ink) !important;color:#EDEDED !important;padding-top:132px !important;padding-bottom:64px !important;position:relative;overflow:hidden}
.tx .tx-hero.tx-photo{background:linear-gradient(180deg,rgba(12,13,15,.7),rgba(12,13,15,.94)),url(/assets/tech/cover.jpg) center/cover !important}
.tx .tx-hero h1{color:#EDEDED !important;font-weight:650;letter-spacing:-.045em;line-height:1.08;font-size:clamp(2.1rem,4.4vw,3.9rem) !important;margin-bottom:1.1rem !important}
.tx .tx-hero.tx-big h1{font-size:clamp(2.8rem,7vw,5.6rem) !important;line-height:1.04}
.tx .tx-hero h1 .tx-light{font-weight:300;color:#c9cdd1}
.tx .tx-hero p{color:#c4c8cc !important;font-size:1.1rem;line-height:1.8;max-width:46rem}
.tx .tx-hero a:not(.btn){color:#d5d8db !important}
.tx .tx-hero nav{font-size:.92rem !important;color:#9AA0A6}
.tx .tx-hero .badge,.tx .tx-eyebrow{background:none !important;padding:0 !important;font-weight:500;letter-spacing:.06em;text-transform:uppercase;font-size:.8rem;color:#9AA0A6 !important;display:inline-flex;align-items:center;gap:.7rem;border-radius:0}
.tx .tx-hero .badge::before,.tx .tx-eyebrow::before{content:"";width:28px;height:1px;background:#8B7CFF}
.tx .tx-hero [style*="font-weight: 600"],.tx .tx-hero div[style*="letter-spacing"]{color:#9AA0A6 !important}

/* 버튼: 알약형 */
.tx .btn{border-radius:999px !important;font-weight:600;letter-spacing:-.01em;padding:.7rem 1.5rem}
.tx .btn-sm{padding:.45rem 1.1rem;font-size:.88rem}
.tx .btn-light{background:#EDEDED;border-color:#EDEDED;color:#0C0D0F}
.tx .btn-outline-light{border-color:rgba(237,237,237,.35);color:#EDEDED}
.tx .btn-primary,.tx .btn-warning{background:var(--tx-fg);border-color:var(--tx-fg);color:#fff}
.tx .btn-outline-primary,.tx .btn-outline-dark,.tx .btn-outline-secondary,.tx .btn-outline-success{border-color:var(--tx-line);color:var(--tx-fg);background:transparent}
.tx .btn-danger{background:#fff;border-color:var(--tx-line);color:var(--tx-fg)}

/* 섹션 머리말 */
.tx .tx-sec-h{font-size:clamp(1.9rem,3.6vw,3.2rem);letter-spacing:-.035em;line-height:1.15;margin:.6rem 0 .8rem}
.tx .tx-sec-sub{color:var(--tx-mute);max-width:42rem;margin-bottom:2rem}

/* 탭형 내비게이션 + 헤어라인 그리드 */
.tx-tabs{display:flex;flex-wrap:wrap;gap:0 2rem;border-bottom:1px solid var(--tx-line);margin-bottom:2rem;overflow-x:auto}
.tx-tabs a{padding:.9rem 0;font-weight:500;color:var(--tx-mute);text-decoration:none;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.tx-tabs a:hover{color:var(--tx-fg);border-bottom-color:var(--tx-accent)}
.tx-tabs small{color:var(--tx-mute);font-weight:600;margin-left:.35rem;font-size:.8rem}
.tx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0 2.5rem;margin-bottom:3rem}
.tx-grid>a,.tx-grid>div{display:block;border-top:1px solid var(--tx-line);padding:1.5rem 0 2rem;text-decoration:none;color:var(--tx-fg)}
.tx-grid h3{font-size:1.3rem;margin:0 0 .5rem;display:flex;justify-content:space-between;gap:1rem;align-items:baseline;line-height:1.35}
.tx-grid h3 em{font-style:normal;font-size:.85rem;font-weight:600;color:var(--tx-mute);white-space:nowrap}
.tx-grid p{color:var(--tx-mute);font-size:.95rem;line-height:1.65;margin:0}
.tx-grid>a:hover h3{color:var(--tx-accent)}
.tx-no{color:var(--tx-accent);font-size:.8rem;font-weight:700;letter-spacing:.04em}
.tx-notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;margin:3rem 0 1rem}
.tx-notes>div{border-top:1px solid var(--tx-line);padding-top:1rem}
.tx-notes h3{font-size:.95rem;margin-bottom:.4rem;letter-spacing:-.01em}
.tx-notes p{color:var(--tx-mute);font-size:.95rem;margin:0}
.tx-notes a{color:var(--tx-fg);border-bottom:1px solid var(--tx-line);text-decoration:none}

/* 검색: 밑줄형 입력 */
.tx .tx-search input{border:0;border-bottom:1px solid var(--tx-line);border-radius:0;background:transparent;box-shadow:none;padding-left:0;font-size:1.1rem}
.tx .tx-search input:focus{border-bottom-color:var(--tx-fg)}
.tx .tx-search .tx-res{display:block;border-top:1px solid var(--tx-line);padding:1rem 0;text-decoration:none;background:none !important;border-left:0 !important;border-right:0 !important;border-bottom:0 !important;border-radius:0 !important}

/* 카드·박스를 헤어라인 스타일로 통일 */
.tx .card{background:transparent !important;border:0 !important;border-top:1px solid var(--tx-line) !important;border-radius:0 !important;box-shadow:none !important}
.tx .card:hover h3{color:var(--tx-accent) !important}
.tx .card-body{padding-left:0 !important;padding-right:0 !important}
.tx [style*="#fff7ed"],.tx [style*="#eef4ff"],.tx [style*="#f1f5fb"],.tx [style*="#f6f7fb"]{background:#fff !important;border:1px solid var(--tx-line) !important;border-radius:12px !important;color:var(--tx-fg) !important}
.tx [style*="#fff7ed"] div:first-child,.tx [style*="#eef4ff"] div:first-child{color:var(--tx-accent) !important}
.tx .border.rounded-4{border-color:var(--tx-line) !important;background:#fff;border-radius:12px !important}

/* 본문(원문) 가독성 */
.tx article h2{font-size:clamp(1.6rem,2.5vw,2.1rem) !important;letter-spacing:-.035em;border-bottom:0 !important;border-top:1px solid var(--tx-line);padding-top:1.4rem !important;margin-top:.5rem}
.tx article h2+*{margin-top:.4rem}
.tx .tech-p{font-size:1.0625rem;line-height:1.9;color:var(--tx-fg)}
.tx .tech-h3{font-size:1.25rem;letter-spacing:-.025em}
.tx .tech-ul{font-size:1.0625rem}
.tx .tech-faq{border-radius:0;border:0;border-top:1px solid var(--tx-line);background:transparent;padding:1rem 0;margin:0}
.tx .tech-faq summary{font-size:1.1rem;font-weight:600}
.tx .tech-fig{border-radius:12px;border-color:var(--tx-line)}
.tx .tech-table th{background:#16181C}
.tx aside{font-size:.95rem}
.tx aside a{text-decoration:none}
.tx aside .fw-bold{font-size:.8rem !important;letter-spacing:.04em;color:var(--tx-mute) !important;text-transform:uppercase}
.tx aside ol a,.tx aside ul a{color:var(--tx-mute) !important}
.tx aside ol a[style*="font-weight: 700"],.tx aside a.is-active{color:var(--tx-fg) !important}
.tx .tech-orig{background:#fff;border:1px solid var(--tx-line)}
.tx-foot{font-size:.9rem;color:var(--tx-mute)}
/* 제품 정보: 색인 바, 용도별 블록, 제품 타일 */
.tx-index{position:sticky;top:76px;z-index:20;background:#fff;border-bottom:1px solid var(--tx-line);overflow-x:auto}
.tx-index .container{display:flex;gap:2rem;white-space:nowrap}
.tx-index a{display:flex;gap:.6rem;align-items:baseline;padding:1rem 0;color:var(--tx-fg);text-decoration:none;font-weight:500;font-size:.95rem}
.tx-index a span{color:var(--tx-mute);font-size:.78rem;font-weight:600}
.tx-index a:hover{color:var(--tx-accent)}
.tx-cat{padding:4.5rem 0 1rem;border-top:1px solid var(--tx-line);scroll-margin-top:130px}
.tx-cat:first-of-type{border-top:0}
.tx-cat-no{font-size:.85rem;font-weight:700;color:var(--tx-accent);letter-spacing:.06em}
.tx-roles>div{display:grid;grid-template-columns:minmax(120px,.7fr) 2fr;gap:.4rem 2rem;border-top:1px solid var(--tx-line);padding:1.2rem 0}
.tx-roles .tx-role{font-size:.82rem;font-weight:700;color:var(--tx-accent);letter-spacing:.03em}
.tx-roles h4{font-size:1.15rem;margin:0 0 .25rem;letter-spacing:-.02em}
.tx-roles p{margin:0 0 .6rem;color:var(--tx-mute);font-size:.97rem}
.tx-roles .tx-chip{display:inline-block;border:1px solid var(--tx-line);border-radius:999px;padding:.12rem .8rem;margin:0 .4rem .4rem 0;font-size:.85rem;font-weight:600;color:var(--tx-fg);text-decoration:none;background:#fff}
.tx-roles .tx-chip:hover{border-color:var(--tx-fg)}
.tx-pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:1.5rem;margin:2.2rem 0 1rem}
.tx-pcard{background:#fff;border:1px solid var(--tx-line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.tx-pcard .tx-pimg{display:block;height:190px;background:#fff;border-bottom:1px solid var(--tx-line)}
.tx-pcard img{width:100%;height:100%;object-fit:contain;padding:14px;mix-blend-mode:multiply;border-radius:22px}
.tx-pcard .tx-pbody{padding:1.1rem 1.2rem .6rem;flex:1}
.tx-pcard h3{font-size:1.05rem;margin:0 0 .3rem;letter-spacing:-.02em}
.tx-pcard h3 a{color:var(--tx-fg);text-decoration:none}
.tx-pcard h3 a:hover{color:var(--tx-accent)}
.tx-pcard p{margin:0;color:var(--tx-mute);font-size:.9rem;line-height:1.55}
.tx-pcard .tx-pact{display:flex;gap:.5rem;padding:.8rem 1.2rem 1.1rem}
.tx-pcard .tx-pact a{flex:1;text-align:center;border:1px solid var(--tx-line);border-radius:999px;padding:.4rem .6rem;font-size:.85rem;font-weight:600;color:var(--tx-fg);text-decoration:none}
.tx-pcard .tx-pact a:first-child{background:var(--tx-fg);border-color:var(--tx-fg);color:#fff}
@media (max-width:767px){.tx-roles>div{grid-template-columns:1fr}.tx-cat{padding-top:3rem}}
@media (max-width:767px){.tx{font-size:16px}.tx .tx-hero{padding-top:104px !important;padding-bottom:44px !important}}
`

export default function Tx({ children }: { children: ReactNode }) {
  return (
    <div className="tx">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" precedence="default" />
      <style dangerouslySetInnerHTML={{ __html: txCss }} />
      {children}
    </div>
  )
}
