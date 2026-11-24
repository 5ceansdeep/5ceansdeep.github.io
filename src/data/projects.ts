// 대표 프로젝트만. 새 프로젝트는 배열에 추가하면 카드가 하나 더 생김
export type Case = {
  title: string
  problem: string
  solution: string
  result: string // 수치가 있으면 수치로
}

// 주요 구현 한 줄 + 거기에 쓴 기술. 기술 태그를 누르면 그 기술이 쓰인 줄만 강조됨
export type Highlight = { text: string; uses: string[] }

export type Project = {
  name: string
  summary: string
  period: string
  role: string
  stack: string[] // 중요한 순서로
  thumbnail?: string // public/ 기준 경로
  github?: string
  live?: string
  highlights: Highlight[]
  cases: Case[] // 문제 → 해결 → 결과 (1~2개)
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
      { text: '상황·기분을 적은 편지를 받아 곡 10개를 3D 디스크로 돌려줌', uses: ['Next.js', 'React', 'TypeScript'] },
      { text: 'Gemini 임베딩으로 861곡 중 30곡을 고르고 LLM으로 재정렬하는 2단계 추천', uses: ['Gemini API', 'NestJS', 'Prisma', 'PostgreSQL'] },
      { text: '디스크를 누르면 30초 미리듣기, 위로 던지면 제외하는 3D 조작', uses: ['React Three Fiber', 'React'] },
      { text: '3D 화면은 클라이언트에서만, 공유 페이지와 카드 이미지는 서버에서 생성', uses: ['Next.js'] },
      { text: 'main에 푸시하면 프론트·백엔드 자동 배포', uses: ['Vercel', 'Railway'] },
      { text: '10일 베타 운영: 서버 로그 기준 편지 118건, 재생 926회 분석', uses: ['PostgreSQL'] },
    ],
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
]
