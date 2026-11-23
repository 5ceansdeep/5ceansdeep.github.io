// 새 프로젝트는 배열에 추가만 하면 카드·필터에 반영됨
export type Case = {
  title: string
  problem: string
  solution: string
  result: string // 수치가 있으면 수치로
}

export type Project = {
  name: string
  summary: string
  period: string
  role: string
  stack: string[] // 중요한 순서로. 카드엔 앞 4개만, 상세 보기엔 전부
  thumbnail?: string // public/ 기준 경로
  github?: string
  live?: string
  highlights: string[] // 상세 보기: 주요 구현 한 줄씩
  cases: Case[] // 상세 보기: 문제 → 해결 → 결과 (1~2개)
}

export const projects: Project[] = [
  {
    name: 'CABINET',
    summary: '문장으로 찾는 음악 추천 웹 서비스',
    period: '2026.03 — 2026.11',
    role: '졸업작품 · 개인',
    stack: ['Next.js', 'React Three Fiber', 'NestJS', 'TypeScript', 'React', 'Zustand', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Gemini API', 'Vercel', 'Railway'],
    github: 'https://github.com/5ceansdeep/cabinet',
    // live: 'https://cabinet-flame-zeta.vercel.app', // 서버 다시 켜면 주석 해제
    highlights: [
      '상황·기분을 적은 편지를 받아 곡 10개를 3D 디스크로 돌려줌',
      'Gemini 임베딩으로 861곡 중 30곡을 고르고 LLM으로 재정렬하는 2단계 추천',
      '디스크를 누르면 30초 미리듣기, 위로 던지면 제외하는 3D 조작',
      '10일 베타 운영: 서버 로그 기준 편지 118건, 재생 926회 분석',
    ],
    // 초안: 이력서 수치 기준. 문제 문장은 실제 상황에 맞게 다듬기
    cases: [
      {
        title: '추천 정확도 개선',
        problem: '정답 곡이 추천 상위 5곡 안에 드는 비율(재현율)이 낮았다.',
        solution: '평가 세트를 만들어 시도마다 재현율을 재고, 곡 풀 평균 보정·LLM 재정렬·편지 해석 개선을 차례로 적용. 수치가 떨어진 시도 3건은 되돌림.',
        result: '곡 풀 평균 보정 43% → 68%',
      },
      {
        title: '3D 화면과 링크 미리보기 분리',
        problem: '3D 화면은 브라우저에서만 그릴 수 있는데, 공유 링크는 미리보기 이미지가 필요했다.',
        solution: 'Next.js App Router에서 3D 화면은 클라이언트 전용으로, 공유 페이지와 카드 이미지는 서버에서 생성.',
        result: '공유 링크에 카드 미리보기 표시',
      },
    ],
  },
  {
    name: 'Saymary',
    summary: 'AI 음성 요약 서비스',
    period: '2025.07 — 2025.09', // GitHub 레포 커밋 기간 기준
    role: 'Frontend · ComWith 소모임',
    stack: ['React', 'JavaScript', 'Create React App', 'Vercel'],
    github: 'https://github.com/5ceansdeep/saymary_frontend',
    highlights: [],
    cases: [],
  },
  {
    name: '회의실 예약 사이트',
    summary: '로그인 없이 외부인이 신청하고 관리자가 승인하는 공개 예약 서비스',
    period: '2026.11 — 진행 중',
    role: 'Frontend · 기획 · 2인 개발',
    stack: ['React', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'Figma'], // 본인 담당(프론트·디자인)만. 백엔드는 팀원
    // 레포 비공개 → 링크 없음. 회사·고객사 이름은 넣지 않음
    highlights: [
      '외부인·관리자 두 사용자를 나눠 PRD 공동 작성, 예약 중복·동시 신청·승인/거절·알림 실패까지 29개 수용 기준으로 정의',
      '디자인 시스템과 Figma 프로토타입 제작, API 명세 응답 본문 설계와 ERD 검토',
      '날짜별 예약 현황, 겹치는 시간대 선택 차단, 신청 폼 검증, 관리자 승인·거절 화면 개발',
      '로그인 없는 공개 신청이라 봇·매크로 방지용 캡차 도입 검토',
    ],
    cases: [],
  },
  {
    name: '띠링인캠퍼스',
    summary: '흩어진 교내 공지를 한곳에서 보는 학내 공지 통합 플랫폼',
    period: '2025', // 확인 필요: INU Startup Frontier(2025) 기준 추정
    role: 'Frontend · 기획 · 창업동아리 멋진으른',
    stack: ['React', 'Figma'],
    highlights: [
      '여러 기관 사이트의 공지를 한곳에서 조회·필터·알림',
      '사용자 설문과 페르소나로 MVP 기능 우선순위 결정, DAU·MAU·리텐션 지표 설계',
      'Figma UI 설계와 React 프론트엔드 개발, 백엔드 팀원과 API 협업',
      '제9기 INU Startup Frontier 참여, 싱가포르 연수에서 유학생 대상 다국어 확장 검토',
      'MVP까지 구현, 팀 해체로 배포 전 중단',
    ],
    cases: [],
  },
]
