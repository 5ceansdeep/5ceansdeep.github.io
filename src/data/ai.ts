// AI 활용 사례. 공고가 AI 활용 위주 서술을 권장해서 섹션으로 따로 뺌
// 현장실습(PMIS) 건은 회사 코드·화면·수치 없이 작업 방식만 글로 적음
export type AiCase = {
  where: string // 어디서
  title: string
  problem: string
  approach: string
  tools: string[]
}

export const aiCases: AiCase[] = [
  {
    where: 'CABINET · 서비스 안의 AI',
    title: 'LLM을 추천 파이프라인의 부품으로',
    problem: '상황·기분을 적은 자유로운 문장(편지)만 보고 861곡 중에서 어울리는 곡을 골라야 했다.',
    approach: 'Gemini가 편지를 곡 설명과 같은 형식으로 다시 쓰게 한 뒤 임베딩하고, 1차로 고른 30곡을 LLM이 다시 재정렬하게 했다. 파이프라인을 바꿀 때마다 평가 세트로 재현율을 재서 오른 변경만 남기고, 떨어진 시도 3건은 되돌렸다.',
    tools: ['Gemini API', '임베딩', 'LLM 재정렬', '평가 세트'],
  },
  {
    where: '현장실습 · 컨텍스트 관리',
    title: '큰 레거시 코드에서 AI가 길을 잃지 않게',
    problem: '코드가 방대해 작업할수록 AI에게 넘겨야 할 맥락과 예외 케이스가 계속 늘어났다.',
    approach: '업무 규칙과 작업 맥락을 마크다운 문서로 정리하고, 규칙에 따라 컨텍스트를 정리해 주는 Claude Code 스킬(/refresh)을 직접 만들었다. 작업하면서 문서를 보강하고 규칙과 훅을 계속 추가했고, 이 방식을 프롬프트로 정리해 동료와 공유했다.',
    tools: ['Claude Code', 'Skills · Rules · Hooks', '마크다운 문서화'],
  },
  {
    where: '현장실습 · 검증',
    title: 'AI가 만든 결과를 그대로 믿지 않기',
    problem: 'AI로 구현한 화면이 맞게 동작하는지 확인해야 했고, AI를 쓸 수 없는 환경에도 대비해야 했다.',
    approach: '화면 흐름은 Playwright로 먼저 자동 검증하고, 실제 사용자 흐름은 직접 확인했다. 폐쇄망처럼 AI 없이 코드를 다뤄야 할 상황에 대비해, AI가 짠 코드를 두고 문제를 내 주는 학습 도구도 만들었다.',
    tools: ['Playwright', '자동 화면 검증', '자체 학습 도구'],
  },
]
