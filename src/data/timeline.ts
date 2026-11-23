// 이력서 문서(오수현 이력서 프론트엔드) 기준. 공개 사이트라 회사명·고객사·연락처는 넣지 않음
// date가 빈 항목은 화면에 안 나옴 → 기간 확인되면 채우기
export type Event = {
  date: string
  title: string
  desc?: string
}

export const timeline: Event[] = [
  { date: '2027.02', title: '인천대학교 정보통신공학과 졸업 예정' },
  { date: '2026.12', title: '정보처리기사', desc: '실기 응시 완료, 12.18 발표 예정' },
  { date: '2026.10', title: 'RedTeam Orchestrator · 해커톤', desc: '해커톤 참가 · 프론트엔드 담당' },
  { date: '2026.08 —', title: '일학습병행 현장실습 · SI 개발', desc: '건설 PMIS 기능 확장, React 회의실 예약 서비스 PRD·디자인 시스템·화면 개발' },
  { date: '2026.07', title: 'TOEIC Speaking IH' },
  { date: '2026.03 — 11', title: 'CABINET · 졸업작품', desc: '문장으로 찾는 음악 추천 웹 서비스, 기획부터 베타 운영까지 개인 진행' },
  { date: '2025', title: '제9기 INU Startup Frontier', desc: '싱가포르 연수 (SWITCH 2025 등 참관)' },
  { date: '', title: '창업동아리 멋진으른', desc: '띠링인캠퍼스 프론트엔드, 사업계획서 작성' },
  { date: '2025.07', title: '웹 개발 동아리 ComWith 프론트엔드팀', desc: 'Saymary 프론트엔드 개발' },
  { date: '', title: '제21대 정보기술대학 학생회 홍보부' },
  { date: '2023.03', title: '인천대학교 정보통신공학과 입학' },
]
