
# 🏥 방문 전 QR 길잡이 (COMWEL Visit Guide)

<div align="center">

![COMWEL QR Guide](https://img.shields.io/badge/COMWEL-방문전%20QR%20길잡이-005BAC?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-Personal%20Dev-A66E38?style=for-the-badge)

**근로복지공단 방문 전 민원 준비 자가진단 서비스**  
QR 한 번으로 민원유형 확인 · 준비서류 점검 · 공식 신청 경로 연결까지

🔗 **[라이브 서비스 바로가기](https://comwel-qr-fn4l.vercel.app)**

</div>

---

## 📌 서비스 개요

근로복지공단 지사를 방문하기 전, 민원 유형별 **필수 준비서류**와 **자격 요건**을 스스로 점검할 수 있는 모바일 최적화 웹 서비스입니다.

- 별도 앱 설치 없이 **QR 스캔 한 번**으로 즉시 접속
- 방문 전 서류 누락을 방지하여 **재방문 횟수 감소**
- 체크리스트 결과가 브라우저에 임시 저장되어 **내방 당일까지 유지**
- 개인정보를 수집하지 않는 **완전 정적 안심 서비스**

---

## 🗂️ 지원 민원 카테고리

| 카테고리 | 주요 민원 | 대상 |
|--------|---------|------|
| 자주 찾는 민원 | 요양급여, 휴업급여, 이직확인서, 보수총액 신고 등 | 근로자 / 사업주 |
| 재활보상 | 장해급여, 유족급여, 간병급여 등 | 근로자 / 유족 |
| 가입지원 | 피보험자격 취득·상실, 소급가입, 개산확정보험료 등 | 사업주 |
| 복지·지원 사업 | 생활안정자금, 직업훈련생계비 대부 등 | 근로자 |

---

## ⚙️ 주요 기능

### ✅ 민원별 체크리스트
- **필수 지참 서류** 체크 (★ 표시, 완료 시 취소선 처리)
- **자가 자격 자가진단** 체크 (방문 적합 여부 사전 확인)
- 진척률 게이지 바 (0~100%) 실시간 표시

### 📖 공단 핵심 행정 용어 정리
- 피보험자격, 보수총액, 요양급여 등 8개 주요 용어
- 아코디언 UI로 간결하게 확인

### 🔗 공식 포털 원터치 연결
- 근로복지공단 공식 홈페이지
- 고용산재보험 토탈서비스
- 정부24, 고용노동부, 국민비서 구삐
- 대표전화 1588-0075 바로 연결

---

## 🛠️ 기술 스택

```
Frontend   React + TypeScript
Styling    Tailwind CSS
Animation  Framer Motion (motion/react)
Icons      Lucide React
Deploy     Vercel (GitHub 연동 자동 배포)
Storage    LocalStorage (서버 미사용, 개인정보 미수집)
```

---

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 📁 프로젝트 구조

```
comwel-qr/
├── src/
│   ├── App.tsx        # 메인 앱 컴포넌트 (목록 + 상세 뷰)
│   ├── data.ts        # 민원 카드 데이터 (카테고리별)
│   └── types.ts       # TypeScript 타입 정의
├── public/
└── README.md
```

---

## ⚠️ 법적 면책고지

본 서비스는 근로복지공단의 **공식 웹사이트가 아닌 비공식 정보 안내 도우미**입니다.  
제공되는 정보 및 체크리스트는 참고용이며 법적 효력을 가지지 않습니다.  
정확한 내용은 반드시 **[근로복지공단 공식 채널](https://www.comwel.or.kr)** 을 통해 확인하시기 바랍니다.

> 🔒 본 서비스는 어떠한 개인정보도 수집하거나 서버에 저장하지 않습니다.

---

## 👤 개발자 정보

- **개발자**: nurioni4188
- **개발 목적**: 개인 개발 후 근로복지공단 지사 업무 제안 목적
- **저작권**: 본 소프트웨어의 저작권은 개발자에게 있으며, 저작권 등록 진행 중입니다.

---

<div align="center">

© 2026 방문 전 안심 길잡이 (비공식 도우미). All rights reserved.

</div>
