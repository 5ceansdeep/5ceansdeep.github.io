// LinkedIn은 프로필 정리되면 links에 추가
export const profile = {
  firstName: 'OH',
  lastName: 'SOOHYUN',
  role: ['frontend', 'developer'],
  photo: '/profile.jpg', // public/profile.jpg
  email: 'su5653@naver.com', // 맨 아래 Contact 줄
  github: '5ceansdeep', // GitHub 활동 패널이 이 계정을 불러옴
  links: [
    { label: 'GitHub', href: 'https://github.com/5ceansdeep' },
    { label: 'Blog', href: 'https://velog.io/@5ceansdeep/posts' },
  ],
  // 사원증 뒷면. 공개 사이트라 연락처·회사명은 넣지 않음
  back: {
    fields: [
      { label: 'ROLE', value: 'Frontend Developer' },
      { label: 'BASED IN', value: 'Seoul, KR' },
      { label: 'STACK', value: 'React · TypeScript · R3F' },
      { label: 'AVAILABLE', value: '2027.01 —' },
    ],
    returnTo: '5ceansdeep.github.io',
  },
}
