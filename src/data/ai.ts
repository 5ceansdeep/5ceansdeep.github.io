// AI 활용 사례. 공고가 AI 활용 위주 서술을 권장해서 섹션으로 따로 뺌
// 현장실습 건은 회사 코드·화면·수치 없이 작업 방식만 글로 적음
export type AiCase = {
  where: string // 어디서
  title: string
  points: string[] // 한 줄씩, 한 일만
  tools: string[]
}

export const aiLede = 'AI로 일할 때 가장 신경 쓰는 건 컨텍스트 관리입니다.'

export const aiCases: AiCase[] = [
  {
    where: '현장실습',
    title: '컨텍스트를 규칙으로 관리',
    points: [
      '코드가 방대해 작업할수록 맥락과 예외 케이스가 늘어나서, 규칙에 따라 컨텍스트를 정리하는 Claude Code 스킬(/refresh)을 직접 만듦',
      '작업하면서 마크다운 문서를 보강하고, 프롬프트를 다듬고, 규칙과 훅을 계속 추가',
      '이 방식을 프롬프트로 정리해 동료와 공유',
    ],
    tools: ['Claude Code', '스킬 · 룰 · 훅'],
  },
  {
    where: '현장실습',
    title: '만드는 AI와 검토하는 AI를 분리',
    points: [
      '코드를 짜는 AI와 검토하는 AI를 서브에이전트로 나눠 검토를 맡김',
      '화면 흐름은 Playwright로 먼저 자동 검증하고, 실제 사용자 흐름은 직접 확인',
      'AI가 한 줄이면 될 수정을 여러 파일에 걸쳐 고치지 않게 도구로 막음',
    ],
    tools: ['서브에이전트', 'Playwright', 'ponytail'],
  },
  {
    where: '현장실습',
    title: 'AI 없이도 다룰 수 있게',
    points: [
      '폐쇄망에서 코드를 직접 반영해야 할 상황에 대비해, AI가 짠 코드로 문제를 내 주는 도구를 직접 만듦',
    ],
    tools: ['자체 제작 도구'],
  },
  {
    where: 'CABINET',
    title: '서비스 안에 LLM 넣기',
    points: [
      'Gemini로 편지를 곡 설명 형식으로 풀어 쓰고 임베딩해 861곡 중 30곡을 고른 뒤, LLM으로 재정렬',
      '평가 세트로 재현율을 재며 개선하고, 수치가 떨어진 시도 3건은 되돌림 (곡 풀 평균 보정 43% → 68%)',
    ],
    tools: ['Gemini API', '임베딩', 'LLM 재정렬'],
  },
]
