// 사이트 공통 연락처. 카카오톡 문의 링크는 주소가 정해지면 KAKAO_URL만 채우면 모든 위치에 버튼이 나타난다.
export const PHONE_DISPLAY = '010-8939-0284'
export const PHONE_TEL = 'tel:+821089390284'
export const SMARTSTORE_URL = 'https://smartstore.naver.com/kconstrade/'
export const KAKAO_URL = '' // 예: 'https://pf.kakao.com/_xxxxxx' 또는 'https://open.kakao.com/o/xxxxxx'
export const MAP_URL = 'https://www.google.com/maps?q=37.478626,127.1192753'

export const ADDRESS = {
  ko: '서울특별시 송파구 충민로 10 가든파이브툴 4-A19',
  en: '10 Chungmin-ro, Songpa-gu, Seoul, Korea (Garden Five Tools 4-A19)',
}

export const CONTACT_TEXT = {
  ko: { call: '전화 문의', kakao: '카카오톡 문의', store: '스마트스토어(소량 구매)', directions: '오시는 길 지도 보기', addr: '주소', tel: '전화', retail: '소량·개인 구매는 네이버 스마트스토어에서 바로 주문하실 수 있습니다.' },
  en: { call: 'Call us', kakao: 'KakaoTalk', store: 'Naver Smart Store (small orders)', directions: 'View map', addr: 'Address', tel: 'Phone', retail: 'Small orders can be placed on our Naver Smart Store.' },
  ja: { call: 'お電話', kakao: 'KakaoTalk', store: 'Naverスマートストア(少量購入)', directions: '地図を見る', addr: '住所', tel: '電話', retail: '少量のご注文はNaverスマートストアをご利用ください。' },
} as const
