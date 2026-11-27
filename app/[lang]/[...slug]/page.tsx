import { notFound } from 'next/navigation'

// 정의되지 않은 /{lang}/* 경로를 app/[lang]/not-found.tsx(사이트 내 이동 링크 포함)로 연결
export default function CatchAll() {
  notFound()
}
