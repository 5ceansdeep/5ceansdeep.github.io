// 이력서 문서(오수현 이력서 프론트엔드) 기준. 공개 사이트라 회사명·고객사·연락처는 넣지 않음
// 굵직한 경험 4개만. 학력·자격은 아래 credentials 한 줄로
export type Event = {
  date: string
  title: string // 역할 · 맥락
  org: string
  desc: string
}

export const timeline: Event[] = [
  {
    date: '2026.08 — 현재',
    title: 'SI Developer · 일학습병행',
    org: 'IT 서비스 기업 현장실습',
    desc: '운영 중인 건설사업관리시스템(PMIS)에 전자기록 점검 기능을 더해 50여 개 화면으로 확장. 요구사항을 규칙으로 정리해 AI 코딩 도구로 구현하고, Playwright 화면 테스트로 검증해 QA 서버까지 반영',
  },
  {
    date: '2026.10',
    title: 'Hackathon · Frontend Prototype',
    org: 'Adaptive Red Team',
    desc: '여러 AI가 보안 점검을 나눠 맡는 아이디어를 보여주기 위한 시연용 프론트엔드 화면 구성',
  },
  {
    date: '2025.04 — 2026.01',
    title: 'Startup Track · Product & Frontend',
    org: '창업동아리 멋진으른 · 제9기 INU Startup Frontier',
    desc: '학내 공지 통합 플랫폼 띠링인캠퍼스 기획·프론트엔드. 설문·페르소나로 MVP 우선순위를 정하고, 싱가포르 연수에서 유학생 대상 다국어 확장 검토',
  },
  {
    date: '2025.07 — 2025.09',
    title: 'Frontend Team · 소규모 프로젝트 최우수',
    org: '웹 개발 동아리 ComWith',
    desc: '소모임 토이 프로젝트 Saymary(AI 음성 요약) 프론트엔드 개발, 소규모 프로젝트 최우수 선정',
  },
]

export const credentials = [
  '인천대학교 정보통신공학과 (2027.02 졸업 예정)',
  '정보처리기사 (2026.12 발표 예정)',
  'TOEIC Speaking IH',
]
