// 홈페이지 전용 .tx 확장 스타일 — Pretendard · 1360px 폭 · 헤어라인 그리드 · 다크 히어로(#0C0D0F) · 보라 포인트(#5b49e6 / #8B7CFF)
export const homeCss = `
.tx .th-arw{width:18px;height:18px;flex:none;transition:transform .25s cubic-bezier(.2,.7,.1,1)}

/* ① 다크 풀블리드 히어로 */
.tx .th-hero{position:relative;overflow:hidden;background:#0C0D0F !important;color:#EDEDED;min-height:clamp(540px,76vh,800px);display:flex;align-items:flex-end;padding-top:clamp(124px,16vh,168px);padding-bottom:clamp(52px,7vw,92px)}
.tx .th-hero-media{position:absolute;inset:0;z-index:0;overflow:hidden}
.tx .th-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 38%;opacity:.42;transform:scale(1.01)}
.tx .th-hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,13,15,.68) 0%,rgba(12,13,15,.46) 40%,rgba(12,13,15,.92) 100%),radial-gradient(60% 60% at 80% 18%,rgba(139,124,255,.16),transparent 70%)}
.tx .th-hero-in{position:relative;z-index:1;width:100%}
.tx .th-hero-eyebrow{display:inline-flex;align-items:center;gap:.75rem;font-size:.82rem;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:#C4C8CC;margin:0 0 1.4rem}
.tx .th-hero-eyebrow::before{content:"";width:28px;height:1px;background:#8B7CFF;flex:none}
.tx .th-hero h1{color:#FFFFFF !important;font-weight:650;letter-spacing:-.042em;line-height:1.12;font-size:clamp(2rem,4.5vw,4.15rem) !important;margin:0 0 clamp(1.75rem,3.5vw,2.75rem);max-width:22ch;text-wrap:balance}
.tx .th-hero h1 .tx-light{display:block;font-weight:300;color:#C9CDD1;margin-top:.25em;font-size:.76em;letter-spacing:-.03em}
.tx .th-hero-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.5rem 2.5rem;padding-top:1.75rem;border-top:1px solid rgba(237,237,237,.16)}
.tx .th-hero-copy{max-width:40rem;margin:0;color:#D5D8DB;font-size:clamp(.98rem,1.15vw,1.1rem);line-height:1.78;text-wrap:pretty}
.tx .th-hero-copy span{display:block;color:#A8AEB5;font-size:.94em;margin-top:.35rem}
.tx .th-hero-cta{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}
.tx .th-btn-light{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:.75rem 1.6rem;border-radius:999px;background:#EDEDED;color:#0C0D0F !important;font-weight:650;font-size:.96rem;text-decoration:none;border:1px solid #EDEDED;transition:background .2s,transform .2s}
.tx .th-btn-light:hover{background:#FFFFFF;color:#0C0D0F !important}
.tx .th-btn-light:hover .th-arw{transform:translateX(4px)}
.tx .th-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:.75rem 1.5rem;border-radius:999px;background:rgba(255,255,255,.04);color:#EDEDED !important;font-weight:600;font-size:.96rem;text-decoration:none;border:1px solid rgba(237,237,237,.34);transition:border-color .2s,background .2s}
.tx .th-btn-ghost:hover{border-color:#FFFFFF;background:rgba(255,255,255,.1)}
.tx .th-btn-dark{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:.75rem 1.6rem;border-radius:999px;background:var(--tx-fg);color:#FFFFFF !important;font-weight:650;font-size:.96rem;text-decoration:none;border:1px solid var(--tx-fg);transition:background .2s,border-color .2s}
.tx .th-btn-dark:hover{background:#2a2d34;border-color:#2a2d34;color:#FFFFFF !important}
.tx .th-btn-dark:hover .th-arw{transform:translateX(4px)}
.tx .th-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:48px;padding:.75rem 1.5rem;border-radius:999px;background:transparent;color:var(--tx-fg) !important;font-weight:600;font-size:.96rem;text-decoration:none;border:1px solid var(--tx-line);transition:border-color .2s,color .2s,background .2s}
.tx .th-btn-outline:hover{border-color:var(--tx-fg);background:rgba(22,24,28,.04)}

/* 공통 섹션 리듬 */
.tx .th-sec{padding:clamp(60px,6.8vw,104px) 0;border-top:1px solid var(--tx-line)}
.tx .th-sec-white{background:#FFFFFF}
.tx .th-sec-tint{background:var(--tx-bg)}
.tx .th-sec-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1.25rem 2rem;margin-bottom:clamp(2rem,3.6vw,3.25rem)}
.tx .th-sec-head-text{max-width:44rem}
.tx .th-sec-head .tx-eyebrow{color:var(--tx-mute) !important;margin-bottom:.75rem}
.tx .th-sec-head .tx-eyebrow::before{background:var(--tx-accent)}
.tx .th-sec-head h2{font-size:clamp(1.75rem,3.2vw,2.85rem);letter-spacing:-.035em;line-height:1.18;margin:0 0 .65rem;text-wrap:balance;color:var(--tx-fg)}
.tx .th-sec-head p{margin:0;color:var(--tx-mute);font-size:clamp(.96rem,1.1vw,1.05rem);line-height:1.72;text-wrap:pretty}
.tx .th-tlink{display:inline-flex;align-items:center;gap:.55rem;min-height:44px;font-weight:600;font-size:.95rem;color:var(--tx-fg);text-decoration:none;border-bottom:1px solid rgba(22,24,28,.28);padding:.4rem 0;transition:border-color .2s,color .2s}
.tx .th-tlink:hover{color:var(--tx-accent);border-color:var(--tx-accent)}
.tx .th-tlink:hover .th-arw{transform:translateX(4px)}

/* ② 핵심 수치/신뢰 띠 */
.tx .th-metrics-sec{background:#FFFFFF;padding:clamp(40px,4.5vw,64px) 0 clamp(28px,3.2vw,44px)}
.tx .th-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.5rem 2rem}
.tx .th-metric{border-top:1px solid var(--tx-line);padding-top:1.25rem}
.tx .th-metric-val{display:flex;align-items:baseline;gap:.25rem;font-variant-numeric:tabular-nums;font-size:clamp(2rem,3.4vw,3.15rem);font-weight:700;letter-spacing:-.04em;line-height:1.05;color:var(--tx-fg)}
.tx .th-metric-val small{font-size:.38em;font-weight:600;color:var(--tx-accent);letter-spacing:0}
.tx .th-metric p{margin:.65rem 0 0;font-size:.9rem;line-height:1.55;color:var(--tx-mute);text-wrap:pretty}
.tx .th-trust-strip{margin-top:clamp(28px,3.5vw,44px);padding-top:1.25rem;border-top:1px solid var(--tx-line);display:flex;flex-wrap:wrap;gap:.75rem 2rem;align-items:center;justify-content:space-between}
.tx .th-trust-item{display:inline-flex;align-items:center;gap:.5rem;font-size:.88rem;color:var(--tx-mute);font-weight:500}
.tx .th-trust-item i{color:var(--tx-accent);font-size:.95rem}

/* ③ 제품군별 솔루션 블록 (번호·헤어라인 리스트) */
.tx .th-slist{border-top:1px solid rgba(22,24,28,.2)}
.tx .th-srow{display:grid;grid-template-columns:48px minmax(0,1fr) minmax(0,1.45fr) 48px;gap:1rem 2rem;align-items:center;padding:clamp(1.25rem,2vw,1.75rem) 0;border-bottom:1px solid var(--tx-line);text-decoration:none;color:var(--tx-fg);transition:background .2s}
.tx .th-srow:hover .th-srow-title{color:var(--tx-accent)}
.tx .th-srow:hover .th-srow-go{background:var(--tx-fg);color:#FFFFFF;border-color:var(--tx-fg)}
.tx .th-srow:hover .th-srow-go .th-arw{transform:translateX(3px)}
.tx .th-srow-no{font-variant-numeric:tabular-nums;font-size:.82rem;font-weight:700;letter-spacing:.06em;color:var(--tx-accent)}
.tx .th-srow-title{font-size:clamp(1.2rem,1.75vw,1.55rem);font-weight:650;letter-spacing:-.03em;line-height:1.25;color:var(--tx-fg);transition:color .2s;display:flex;align-items:baseline;flex-wrap:wrap;gap:.5rem}
.tx .th-srow-count{font-size:.78rem;font-weight:600;color:var(--tx-mute);letter-spacing:.02em;font-variant-numeric:tabular-nums}
.tx .th-srow-eyebrow{display:block;font-size:.82rem;color:var(--tx-mute);margin-top:.3rem;font-weight:500}
.tx .th-srow-desc{margin:0 0 .55rem;color:var(--tx-mute);font-size:.94rem;line-height:1.6}
.tx .th-srow-tags{display:flex;flex-wrap:wrap;gap:.35rem}
.tx .th-tag{display:inline-block;font-size:.78rem;font-weight:500;color:var(--tx-fg);background:#FFFFFF;border:1px solid var(--tx-line);border-radius:999px;padding:.15rem .65rem;line-height:1.5}
.tx .th-srow-go{width:44px;height:44px;border-radius:50%;border:1px solid rgba(22,24,28,.22);display:inline-flex;align-items:center;justify-content:center;color:var(--tx-fg);transition:background .2s,border-color .2s,color .2s;justify-self:end}

/* ④ 대표 제품 카드 8종 */
.tx .th-pgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.25rem}
.tx .th-pcard{background:#FFFFFF;border:1px solid var(--tx-line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s,transform .2s}
.tx .th-pcard:hover{border-color:rgba(91,73,230,.45);transform:translateY(-2px)}
.tx .th-pcard-img{display:flex;align-items:center;justify-content:center;height:184px;background:#FFFFFF;border-bottom:1px solid var(--tx-line);padding:16px}
.tx .th-pcard-img img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;mix-blend-mode:multiply}
.tx .th-pcard-body{padding:1.15rem 1.25rem .75rem;flex:1;display:flex;flex-direction:column}
.tx .th-pcard-cat{font-size:.75rem;font-weight:700;color:var(--tx-accent);letter-spacing:.03em;margin-bottom:.35rem}
.tx .th-pcard-body h3{font-size:1.06rem;margin:0 0 .4rem;letter-spacing:-.02em;line-height:1.35}
.tx .th-pcard-body h3 a{color:var(--tx-fg);text-decoration:none}
.tx .th-pcard-body h3 a:hover{color:var(--tx-accent)}
.tx .th-pcard-body p{margin:0;color:var(--tx-mute);font-size:.88rem;line-height:1.58;flex:1}
.tx .th-pcard-act{display:flex;gap:.5rem;padding:.75rem 1.25rem 1.15rem}
.tx .th-pcard-act a{flex:1;display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:999px;font-size:.85rem;font-weight:600;text-decoration:none;border:1px solid var(--tx-line);color:var(--tx-fg);transition:background .2s,border-color .2s,color .2s}
.tx .th-pcard-act a:first-child{background:var(--tx-fg);border-color:var(--tx-fg);color:#FFFFFF}
.tx .th-pcard-act a:first-child:hover{background:var(--tx-accent);border-color:var(--tx-accent)}
.tx .th-pcard-act a:last-child:hover{border-color:var(--tx-fg)}
.tx .th-prod-foot{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;margin-top:2.25rem}

/* ⑤ 기술정보 허브 6곳 타일 */
.tx .th-tech-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 2.5rem}
.tx .th-tech-card{display:flex;flex-direction:column;border-top:1px solid var(--tx-line);padding:1.6rem 0 2rem;text-decoration:none;color:var(--tx-fg)}
.tx .th-tech-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem}
.tx .th-tech-count{font-size:.8rem;font-weight:600;color:var(--tx-mute);font-variant-numeric:tabular-nums}
.tx .th-tech-card h3{font-size:1.2rem;margin:0 0 .5rem;line-height:1.38;letter-spacing:-.025em;color:var(--tx-fg);transition:color .2s}
.tx .th-tech-card p{margin:0 0 1.1rem;color:var(--tx-mute);font-size:.93rem;line-height:1.65;flex:1}
.tx .th-tech-open{display:inline-flex;align-items:center;gap:.4rem;font-size:.88rem;font-weight:650;color:var(--tx-fg);transition:color .2s}
.tx .th-tech-card:hover h3,.tx .th-tech-card:hover .th-tech-open{color:var(--tx-accent)}
.tx .th-tech-card:hover .th-arw{transform:translateX(4px)}

/* ⑥ 회사/Dow 실리콘 소개 + 지속가능경영 링크 띠 */
.tx .th-company-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:2.5rem 4rem;align-items:start}
.tx .th-dow-lock{display:inline-flex;align-items:center;gap:1rem;padding:.75rem 1.2rem;background:#FFFFFF;border:1px solid var(--tx-line);border-radius:12px;margin-top:1.5rem}
.tx .th-dow-lock img{height:24px;width:auto}
.tx .th-dow-lock span{font-size:.82rem;color:var(--tx-mute);border-left:1px solid var(--tx-line);padding-left:.9rem;line-height:1.35}
.tx .th-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--tx-line)}
.tx .th-pillar h3{font-size:1.05rem;margin:0 0 .4rem;letter-spacing:-.02em}
.tx .th-pillar p{margin:0;color:var(--tx-mute);font-size:.92rem;line-height:1.65}
.tx .th-esg-band{margin-top:clamp(2.5rem,4vw,3.75rem);border-top:1px solid rgba(22,24,28,.22);border-bottom:1px solid rgba(22,24,28,.22);padding:clamp(1.5rem,2.6vw,2.25rem) 0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.5rem 2.5rem;align-items:center}
.tx .th-esg-items{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem 2rem;margin-top:1rem}
.tx .th-esg-items div{border-left:1px solid var(--tx-line);padding-left:1rem}
.tx .th-esg-items div:first-child{border-left:0;padding-left:0}
.tx .th-esg-items b{display:block;font-size:.94rem;color:var(--tx-fg);margin-bottom:.2rem}
.tx .th-esg-items span{display:block;font-size:.85rem;color:var(--tx-mute);line-height:1.5}

/* ⑦ 수출·B2B 문의 CTA + #b2b-form + 오시는 길 */
.tx .th-dark-cta{background:#0C0D0F !important;color:#EDEDED;padding:clamp(56px,6.5vw,96px) 0;position:relative;overflow:hidden}
.tx .th-dark-cta::before{content:"";position:absolute;inset:0;background:radial-gradient(50% 80% at 88% 20%,rgba(139,124,255,.22),transparent 70%);pointer-events:none}
.tx .th-dark-cta-in{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.25fr) auto;gap:2rem 3rem;align-items:end}
.tx .th-dark-cta h2{color:#FFFFFF !important;font-size:clamp(1.85rem,3.4vw,3rem);letter-spacing:-.035em;line-height:1.16;margin:.75rem 0 .85rem;text-wrap:balance}
.tx .th-dark-cta p{color:#C4C8CC;margin:0;max-width:42rem;font-size:1.02rem;line-height:1.75}
.tx .th-dark-cta-actions{display:flex;flex-wrap:wrap;gap:.75rem}

.tx .th-b2b-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:2.5rem 4rem;align-items:start}
.tx .th-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem 1.75rem;margin-top:2rem}
.tx .th-step{border-top:1px solid var(--tx-line);padding-top:1rem}
.tx .th-step-no{font-variant-numeric:tabular-nums;font-size:.78rem;font-weight:700;color:var(--tx-accent);letter-spacing:.06em;display:block;margin-bottom:.35rem}
.tx .th-step h3{font-size:1rem;margin:0 0 .3rem;letter-spacing:-.015em}
.tx .th-step p{margin:0;color:var(--tx-mute);font-size:.88rem;line-height:1.6}
.tx .th-channels{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.75rem}
.tx .th-ch-btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;min-height:44px;padding:.55rem 1.1rem;border-radius:999px;font-size:.88rem;font-weight:600;text-decoration:none;border:1px solid var(--tx-line);background:#FFFFFF;color:var(--tx-fg);transition:border-color .2s,background .2s}
.tx .th-ch-btn:hover{border-color:var(--tx-fg)}
.tx .th-ch-kakao{background:#FEE500;border-color:#FEE500;color:#191919}
.tx .th-ch-kakao:hover{background:#f5dc00;border-color:#f5dc00;color:#191919}

.tx .th-form-box{background:#FFFFFF;border:1px solid var(--tx-line);border-radius:16px;padding:clamp(1.5rem,3vw,2.5rem)}
.tx .th-field{display:flex;flex-direction:column;gap:.35rem;margin-bottom:1.25rem}
.tx .th-field label{font-size:.9rem;font-weight:650;color:var(--tx-fg)}
.tx .th-field label span{color:#b91c1c;margin-left:.2rem}
.tx .th-input,.tx .th-textarea{width:100%;font:inherit;font-size:max(1rem,1em);color:var(--tx-fg);background:#FFFFFF;border:1px solid rgba(22,24,28,.28);border-radius:10px;padding:.75rem .95rem;min-height:48px;box-sizing:border-box;transition:border-color .2s,box-shadow .2s}
.tx .th-textarea{min-height:132px;resize:vertical;line-height:1.6}
.tx .th-input::placeholder,.tx .th-textarea::placeholder{color:#6f767d}
.tx .th-input:focus-visible,.tx .th-textarea:focus-visible{outline:2px solid var(--tx-accent);outline-offset:2px;border-color:var(--tx-accent)}
.tx .th-input:focus:not(:focus-visible),.tx .th-textarea:focus:not(:focus-visible){outline:2px solid transparent;border-color:var(--tx-accent);box-shadow:0 0 0 3px rgba(91,73,230,.18)}
.tx .th-input:user-invalid,.tx .th-textarea:user-invalid{border-color:#b91c1c}
.tx .th-form-hint{font-size:.84rem;color:var(--tx-mute);margin:0 0 1.25rem}
.tx .th-form-submit{width:100%;min-height:52px;border-radius:999px;border:1px solid var(--tx-fg);background:var(--tx-fg);color:#FFFFFF;font:inherit;font-weight:650;font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:.55rem;transition:background .2s,border-color .2s}
.tx .th-form-submit:hover{background:var(--tx-accent);border-color:var(--tx-accent)}
.tx .th-form-note{font-size:.84rem;color:var(--tx-mute);margin:.85rem 0 0;text-align:center}

/* 오시는 길 컴팩트 카드 */
.tx .th-loc-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:1.5rem 2.5rem;align-items:stretch;margin-top:clamp(2.5rem,4vw,3.5rem);padding-top:clamp(2rem,3vw,3rem);border-top:1px solid var(--tx-line)}
.tx .th-map-frame{border:1px solid var(--tx-line);border-radius:14px;overflow:hidden;background:#FFFFFF;min-height:280px}
.tx .th-map-frame iframe{display:block;width:100%;height:100%;min-height:280px;border:0}
.tx .th-loc-info{background:#FFFFFF;border:1px solid var(--tx-line);border-radius:14px;padding:clamp(1.25rem,2.5vw,2rem);display:flex;flex-direction:column;justify-content:space-between;gap:1.25rem}
.tx .th-loc-dl{margin:0;display:grid;gap:.9rem}
.tx .th-loc-dl dt{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--tx-mute);margin-bottom:.15rem}
.tx .th-loc-dl dd{margin:0;font-size:.96rem;color:var(--tx-fg);line-height:1.55}
.tx .th-loc-dl a{color:var(--tx-fg);font-weight:650;text-decoration:none;border-bottom:1px solid var(--tx-line)}
.tx .th-loc-dl a:hover{color:var(--tx-accent);border-color:var(--tx-accent)}

/* ⑧ FAQ 아코디언 (modern-web-guidance accordion 패턴) */
.tx .th-faq-wrap{display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);gap:2rem 4rem;align-items:start}
.tx .th-faq-list{border-bottom:1px solid var(--tx-line)}
.tx .th-faq-item{border-top:1px solid var(--tx-line)}
.tx .th-faq-item summary{list-style:none;display:flex;align-items:center;gap:.85rem;min-height:56px;padding:1.1rem 0;cursor:pointer;font-weight:650;font-size:1.05rem;line-height:1.45;color:var(--tx-fg)}
.tx .th-faq-item summary::-webkit-details-marker{display:none}
.tx .th-faq-item summary::before{content:"";inline-size:1rem;block-size:1rem;flex-shrink:0;background-color:var(--tx-accent);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.2 5.8a.75.75 0 0 1 1.06 0L8 9.54l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L3.2 6.86a.75.75 0 0 1 0-1.06Z'/%3E%3C/svg%3E") no-repeat center/contain;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.2 5.8a.75.75 0 0 1 1.06 0L8 9.54l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L3.2 6.86a.75.75 0 0 1 0-1.06Z'/%3E%3C/svg%3E") no-repeat center/contain;rotate:-90deg}
.tx .th-faq-item[open] > summary::before{rotate:0deg}
.tx .th-faq-item summary:hover{color:var(--tx-accent)}
.tx .th-faq-item::details-content{interpolate-size:allow-keywords;overflow:clip;contain:layout}
.tx .th-faq-item:not([open])::details-content{block-size:0}
.tx .th-faq-body{padding:0 0 1.35rem 1.85rem;margin:0;color:var(--tx-mute);font-size:.97rem;line-height:1.8}
@media (prefers-reduced-motion: no-preference){
  .tx .th-faq-item summary::before{transition:rotate .2s ease}
  .tx .th-faq-item::details-content{transition:block-size .28s ease,content-visibility .28s ease;transition-behavior:allow-discrete}
}

/* 반응형 (태블릿 ~ 모바일 360px) */
@media (max-width:1199px){
  .tx .th-pgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tx .th-tech-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:991px){
  .tx .th-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tx .th-srow{grid-template-columns:40px minmax(0,1fr) 44px;gap:.6rem 1rem}
  .tx .th-srow-right{grid-column:2 / 4}
  .tx .th-srow-go{grid-row:1;grid-column:3}
  .tx .th-company-grid,.tx .th-b2b-grid,.tx .th-faq-wrap,.tx .th-dark-cta-in,.tx .th-loc-grid,.tx .th-esg-band{grid-template-columns:minmax(0,1fr)}
  .tx .th-pillars,.tx .th-esg-items{grid-template-columns:minmax(0,1fr);gap:1.1rem}
  .tx .th-esg-items div{border-left:0;padding-left:0;border-top:1px solid var(--tx-line);padding-top:.85rem}
  .tx .th-esg-items div:first-child{border-top:0;padding-top:0}
}
@media (max-width:639px){
  .tx .th-hero{min-height:auto;padding-top:104px;padding-bottom:48px}
  .tx .th-hero-cta{width:100%}
  .tx .th-hero-cta a{flex:1 1 auto;min-width:150px}
  .tx .th-pgrid,.tx .th-tech-grid,.tx .th-steps{grid-template-columns:minmax(0,1fr)}
  .tx .th-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.1rem 1rem}
  .tx .th-srow{grid-template-columns:minmax(0,1fr) 44px}
  .tx .th-srow-no{grid-column:1}
  .tx .th-srow-head{grid-column:1}
  .tx .th-srow-right{grid-column:1 / -1}
  .tx .th-srow-go{grid-row:1 / 3;grid-column:2}
  .tx .th-faq-body{padding-left:0}
  .tx .th-prod-foot a,.tx .th-dark-cta-actions a{width:100%}
}
@media (pointer:coarse){
  .tx .th-input,.tx .th-textarea{min-height:52px}
}
`;
