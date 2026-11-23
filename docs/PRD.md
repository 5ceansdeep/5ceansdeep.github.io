# PRD - 개발자 포트폴리오 사이트

- 문서 버전: v1.0
- 작성일: 2026-11-02
- 작성자: 오수현
- 디자인: [Figma - NO AI portfolio Site](https://www.figma.com/design/AswB851cIzbgjo8R0C2Akd/NO-AI-portfolio-Site)

## 1. 개요

### 배경
이력서 작성 전 개발 경험, 프로젝트, 기술 스택, 대외활동을 정리할 필요가 있다. 현재 이력이 GitHub, 기술 블로그, SNS 등에 분산되어 한눈에 보기 어렵다.

### 목적
이력, 프로젝트, 기술 스택, 개발 기록, 외부 활동을 하나의 웹사이트에서 제공하는 개인 프로필 사이트. 방문자는 URL 하나로 역량과 활동을 확인하고, 관리자는 경험과 성과를 계속 기록·관리한다.

### 기대 효과
- 개발 경험과 이력 아카이빙
- 이력서·포트폴리오 작성 자료 확보
- 프로젝트 경험과 기술 역량 전달
- GitHub, 블로그 등 외부 플랫폼을 한 사이트로 연결

## 2. 타겟

| 대상 | 문제 | 해결 |
|---|---|---|
| 방문자 (채용 담당자, 동료 개발자, 협업 관계자) | 역량 확인하려면 여러 플랫폼 방문 필요 | 프로필, 스택, 프로젝트, 기록, 외부 링크를 한 사이트에서 제공 |
| 관리자 (오수현) | 기록이 분산되어 정리·관리 어려움 | 일정한 형식으로 등록·업데이트하는 개인 아카이브 |

## 3. 핵심 기능 (MVP)

### 3.1 개인 프로필 패널 (랜딩)
실제 사원증처럼 필수 개인정보만 카드에 담는다.
- 사원증 카드: 프로필 이미지, 이름, 직무(frontend developer)
- 카드 안 링크: GitHub, LinkedIn, 기술 블로그 — 클릭 시 새 탭 이동
- 배경 대형 타이포: OH / SOOHYUN
- **인터랙션:** 사원증을 커서로 잡아당길 수 있음 (3D 물리, 끈 그림자·꼬임 포함)
- 드래그는 3D 카드가, 클릭은 카드 위 링크(DOM)가 받음

### 3.2 프로젝트 패널
- 프로젝트 목록 카드 (사원증 모티프, 계단식 배치)
- 프로젝트명, 설명, 이미지, 개발 기간, 담당 역할
- 기술 스택 태그
- 기술 스택별 필터링
- 프로젝트 상세 정보
- GitHub 저장소 및 배포 사이트 링크

### 3.3 GitHub 활동 패널
- GitHub Contributions 그래프
- GitHub 프로필 바로가기
- 외부 데이터 로딩 실패 시 대체 화면

## 4. 사용자 흐름
1. 사이트 접속 → 프로필 확인 (랜딩)
2. 프로젝트 탐색
3. GitHub 활동 확인

## 5. 기술 스택

| 항목 | 선택 |
|---|---|
| 빌드 | Vite |
| UI | React + TypeScript |
| 스타일 | CSS Modules |
| 3D / 물리 | three.js + React Three Fiber + drei, `@react-three/rapier` (끈 = rope joint 체인, 카드 = 강체) |
| 데이터 | `src/data/*.ts` 정적 파일 (백엔드 없음) |
| 배포 | GitHub Pages (GitHub Actions) |

```
src/
  App.tsx
  sections/Landing.tsx    # 프로필 + 사원증
  sections/Projects.tsx   # 프로젝트 카드 + 스택 필터
  sections/Github.tsx     # Contributions + 프로필 링크
  sections/Lanyard.tsx    # 3D 사원증 씬 (R3F + rapier)
  data/profile.ts
  data/projects.ts
```

## 6. 개발 순서
1. 와이어프레임 (Figma) — 진행 중, GITHUB 프레임 미완성
2. 백엔드 — 정적 사이트라 불필요
3. 프론트엔드
4. 로컬 테스트
5. GitHub Pages 배포

## 7. 제외 범위 (Out of Scope)
1. 사이트 내 마크다운 게시글 직접 작성 (게시글은 로컬 코드 수정으로)
2. IT 뉴스 스크랩
3. 이메일 및 외부 연락 기능
4. 이력서 PDF 다운로드
5. 브라우저에서 패널 단위 UI 커스터마이징

## 8. 성공 요건
1. 패널별 요구사항 충족
2. GitHub Pages에서 문제없이 표시

## 9. 미결 사항
- 자기소개 문구, 기술 스택 목록(PRD 원안 항목)은 사원증에서 제외 → 넣을 위치 미정
- GitHub REST API는 Contributions 데이터를 제공하지 않음 (GraphQL은 토큰 필요, 정적 사이트에 토큰 노출 불가) → 공개 Contributions 이미지/API 사용 + `onError` 시 대체 화면
- 폰트 (세리프 장체 계열) 확정
