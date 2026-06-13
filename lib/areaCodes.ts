// KorService2 uses lDongRegnCd (행정표준코드), not legacy areaCode.
// Most regions use the 2-digit 광역 prefix, but two are special-cased:
//   세종 = 36110 — 단층 특별자치시, data carries the full 5-digit code, not '36'
//   전북 = 52    — 전북특별자치도 전환으로 '45'에서 변경됨
export const AREA_CODES = [
  { code: '', name: '전국' },
  { code: '11', name: '서울' },
  { code: '28', name: '인천' },
  { code: '30', name: '대전' },
  { code: '27', name: '대구' },
  { code: '29', name: '광주' },
  { code: '26', name: '부산' },
  { code: '31', name: '울산' },
  { code: '36110', name: '세종' },
  { code: '41', name: '경기' },
  { code: '51', name: '강원' },
  { code: '43', name: '충북' },
  { code: '44', name: '충남' },
  { code: '47', name: '경북' },
  { code: '48', name: '경남' },
  { code: '52', name: '전북' },
  { code: '46', name: '전남' },
  { code: '50', name: '제주' },
]
