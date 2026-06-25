import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Check,
  ExternalLink,
  Sparkles,
  Phone,
  Globe,
  MapPin,
  ArrowLeft,
  FileDown,
  Sparkle,
  BookOpen,
} from 'lucide-react';
import { COMPLAINT_CARDS, CATEGORIES } from './data';
import { ComplaintCard, SavedChecklist } from './types';

const SANJAE_REHAB_GUIDE_URL = 'https://comwel-sanjae-rehab-guide.vercel.app';

const getOnlineLink = (card: ComplaintCard) => {
  if (card.category === '복지·지원 사업') {
    return 'https://welfare.comwel.or.kr/';
  }
  if (card.onlineUrlLabel.includes('정부24')) {
    return 'https://www.gov.kr/';
  }
  return 'https://www.comwel.or.kr/comwel/info/data/papr/papr_lst.jsp';
};

const getFormLink = (card: ComplaintCard) => {
  return 'https://www.comwel.or.kr/comwel/info/data/papr/papr_lst.jsp';
};

const GLOSSARY_ITEMS = [
  {
    term: '피보험자격',
    spec: '(상용·일용 근로 자격 상태)',
    definition:
      '고용·산재보험에 정식 가입되어 행정적 혜택을 수령할 자격입니다. 원활한 전산 대조를 위해 입사 시 취득, 퇴사 시 상실 신고가 완수되어야 합니다.',
  },
  {
    term: '보수총액',
    spec: '(세전 소득 실제 결산액)',
    definition:
      '전년도 1년간 모든 재직·중도퇴사 사원에게 귀속된 비과세 제외 세전 임금입니다. 매년 3월 정기 마감 정산하여 보험료 차감 또는 추징을 결정합니다.',
  },
  {
    term: '요양급여',
    spec: '(산재 치료비 지원)',
    definition:
      '업무상 사유로 부상 또는 질병이 발생하여 4일 이상 치료 및 요양이 필요한 경우, 공단의 심사를 거쳐 규정된 산재보험 범위 내의 요양비(치료비)를 지원합니다.',
  },
  {
    term: '휴업급여',
    spec: '(치료 기간 중 휴업급여 지급)',
    definition:
      '업무상 부상 또는 질병으로 요양하느라 취업하지 못한 기간에 대하여, 생계 안정을 지원하기 위해 1일당 평균임금의 70% 상당액을 지출/지급해 주는 제도입니다.',
  },
  {
    term: '장해급여',
    spec: '(치료 종료 후 영구 후유증 등 보상)',
    definition:
      '의학적 치료가 종결되었으나 신체 장해가 남은 경우, 법정 장해 등급에 따라 연금 또는 일시금 형태로 지급되는 보상 제도입니다.',
  },
  {
    term: '이직확인서',
    spec: '(퇴사 근로일수 및 평균임금 확인)',
    definition:
      '근로자 퇴사 사실과 정당 이직 사유를 대외 증명하는 문서입니다. 구직급여 심사에 필요한 근로일수와 평균임금 확인에 활용됩니다.',
  },
  {
    term: '소급가입',
    spec: '(가입 누락 기간의 소급 취득)',
    definition:
      '과거에 고용보험 또는 산재보험 가입이 누락된 기간에 대해 근무 사실과 임금 지급 자료 등을 확인하여 소급 적용을 검토하는 절차입니다.',
  },
  {
    term: '개산·확정보험료',
    spec: '(보험료 선납·정산 구조)',
    definition:
      '개산보험료는 예상 보수총액을 기준으로 먼저 신고·납부하는 보험료이고, 확정보험료는 실제 보수총액을 기준으로 정산하는 보험료입니다.',
  },
];

export default function App() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isHospitalExpanded, setIsHospitalExpanded] = useState<boolean>(false);
  const [activeGlossaryIdx, setActiveGlossaryIdx] = useState<number | null>(null);

  const [checklist, setChecklist] = useState<SavedChecklist>(() => {
    try {
      const saved = localStorage.getItem('qr-guide-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [preChecklistState, setPreChecklistState] = useState<{ [key: string]: { [idx: number]: boolean } }>(() => {
    try {
      const saved = localStorage.getItem('qr-guide-pre-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('qr-guide-checklist', JSON.stringify(checklist));
    } catch (e) {
      console.warn('LocalStorage 동기화 실패', e);
    }
  }, [checklist]);

  useEffect(() => {
    try {
      localStorage.setItem('qr-guide-pre-checklist', JSON.stringify(preChecklistState));
    } catch (e) {
      console.warn('LocalStorage 동기화 실패 (사전체크)', e);
    }
  }, [preChecklistState]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleDocChecked = (cardId: string, index: number) => {
    setChecklist(prev => {
      const cardChecked = prev[cardId] ? { ...prev[cardId] } : {};
      cardChecked[index] = !cardChecked[index];
      return { ...prev, [cardId]: cardChecked };
    });
  };

  const togglePreChecked = (cardId: string, index: number) => {
    setPreChecklistState(prev => {
      const cardChecked = prev[cardId] ? { ...prev[cardId] } : {};
      cardChecked[index] = !cardChecked[index];
      return { ...prev, [cardId]: cardChecked };
    });
  };

  const resetCardChecklist = (cardId: string) => {
    setChecklist(prev => {
      const updated = { ...prev };
      delete updated[cardId];
      return updated;
    });
    setPreChecklistState(prev => {
      const updated = { ...prev };
      delete updated[cardId];
      return updated;
    });
    triggerToast('해당 민원의 준비 서류 및 자가 자격 체크 이력을 초기화했습니다.');
  };

  const getPreparedStatus = (card: ComplaintCard) => {
    const cardChecked = checklist[card.id] || {};
    const total = card.requiredDocs.length;
    const checkedCount = Object.values(cardChecked).filter(Boolean).length;
    return {
      total,
      checkedCount,
      percentage: total > 0 ? Math.round((checkedCount / total) * 100) : 0,
      isAllDone: checkedCount === total && total > 0,
    };
  };

  const getPreCheckStatus = (card: ComplaintCard) => {
    const cardChecked = preChecklistState[card.id] || {};
    const total = card.preChecklist.length;
    const checkedCount = Object.values(cardChecked).filter(Boolean).length;
    return {
      total,
      checkedCount,
      percentage: total > 0 ? Math.round((checkedCount / total) * 100) : 0,
      isAllDone: checkedCount === total && total > 0,
    };
  };

  const findCardByCategoryAndIndex = (category: string, relativeIndex: number) => {
    const filtered = COMPLAINT_CARDS.filter(c => c.category === category);
    return filtered[relativeIndex] || null;
  };

  const activeCard = useMemo(() => {
    if (!selectedCardId) return null;
    return COMPLAINT_CARDS.find(c => c.id === selectedCardId) || null;
  }, [selectedCardId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenDetail = (id: string) => {
    setSelectedCardId(id);
    scrollToTop();
  };

  const handleBackToList = () => {
    setSelectedCardId(null);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] selection:bg-[#D0E2FF] selection:text-[#0F294A] flex flex-col font-sans transition-all duration-300 antialiased">

      {/* 상단 글로벌 네비게이션 */}
      <nav className="sticky top-0 z-40 w-full border-b border-[#DDE7F0] bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-[#0F62FE] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-[#0F294A] leading-none">
                방문 전 QR 길잡이
              </h1>
              <span className="text-[10px] font-bold text-[#0F62FE] tracking-tight block mt-1">
                방문 전 신뢰 가이드 서비스
              </span>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF5FF] px-2.5 py-1.5 text-[10px] sm:text-xs font-black text-[#0F62FE] border border-[#D0E2FF] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0E7490] shrink-0" />
              고객용 방문 안내
            </span>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!activeCard ? (
          <motion.div
            key="list-layout-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col"
          >
            {/* 첫 화면 히어로 */}
            <header className="px-4 pt-6 pb-6 text-center sm:px-6 shrink-0 max-w-4xl mx-auto w-full">
              <div className="bg-gradient-to-br from-[#123C69] via-[#0F5E9C] to-[#0E7490] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 text-center text-white shadow-lg relative overflow-hidden flex flex-col items-center justify-center border border-[#B8D7F3]/30">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35),transparent_65%)] pointer-events-none" />
                <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/12 backdrop-blur-md px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white border border-white/20 mb-5 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#FDDC69] shrink-0" />
                  고객용 방문 전 안내 서비스
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight select-none">
                  방문 전 QR 길잡이
                </h2>

                <div className="inline-flex items-start sm:items-center gap-1.5 rounded-2xl bg-white/12 backdrop-blur-md px-4 py-3 text-xs sm:text-sm font-bold text-[#F8FAFC] border border-white/16 mb-5 max-w-xl mx-auto text-left sm:text-center leading-relaxed">
                  <Sparkles className="h-4.5 w-4.5 text-[#FDDC69] shrink-0 mt-0.5 sm:mt-0" />
                  <span>방문 전에 준비서류 · 신청방법 · 확인사항을 미리 확인할 수 있는 안내 서비스</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-white bg-white/10 border border-white/15 px-4.5 py-2.5 rounded-xl shadow-3xs">
                  <span>💡</span>
                  <span>방문 전 준비하면 시간이 절약됩니다!</span>
                </div>

                {/* 산재보상·재활 안내 연결 카드 */}
                <a
                  href={SANJAE_REHAB_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerToast('산재보상·재활 안내 페이지로 이동합니다.')}
                  className="mt-5 block w-full max-w-xl rounded-2xl border border-[#D0E2FF] bg-white/92 p-4 text-left shadow-sm transition hover:border-[#0F62FE] hover:bg-white no-underline"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F62FE] text-white shadow-sm">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wide text-[#0F62FE]">
                        산재보상·재활 확장 안내
                      </p>
                      <h3 className="mt-1 text-sm font-black text-[#0F294A]">
                        산재보상·재활 안내
                      </h3>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-[#4B5563]">
                        산재 발생 후 요양 절차, 보험급여, 재활지원, 직업복귀 정보를 한눈에 확인합니다.
                      </p>
                      <span className="mt-3 inline-flex rounded-full bg-[#EDF5FF] px-3 py-1 text-[11px] font-black text-[#0F62FE] ring-1 ring-[#D0E2FF]">
                        안내 바로가기 →
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </header>

            <main className="mx-auto w-full max-w-4xl px-4 pb-14 flex-1">

              {/* 민원 안내판 */}
              <div className="bg-white border border-[#DDE7F0] rounded-[24px] p-4.5 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-[18px] left-[18px] text-[#9AAFC4] text-xs font-serif select-none hidden sm:block">
                  COMWEL
                </div>
                <div className="absolute top-[18px] right-[18px] text-[#9AAFC4] text-xs font-serif select-none hidden sm:block">
                  방문 전 안내판
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-left">

                    {/* LEFT COLUMN */}
                    <div className="space-y-8">

                      {/* 1) 자주 찾는 민원 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            1
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            자주 찾는 민원
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Most Requested Services
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[0, 1, 2, 3].map(index => {
                            const card = findCardByCategoryAndIndex('자주 찾는 민원', index);
                            if (!card) return null;
                            const prep = getPreparedStatus(card);
                            return (
                              <button
                                key={card.id}
                                onClick={() => handleOpenDetail(card.id)}
                                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#D0E2FF] hover:bg-[#F6FAFF] transition-all group flex items-start gap-2.5"
                              >
                                <div className="h-6 w-6 rounded-full border border-[#D0E2FF] flex items-center justify-center text-xs font-bold text-[#0F62FE] shrink-0 bg-[#F8FBFF] group-hover:bg-[#0F62FE] group-hover:text-white transition-colors">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F294A] group-hover:text-[#0F62FE] transition-colors truncate">
                                      {card.title}
                                    </h4>
                                    <span className={`text-[10px] font-black shrink-0 ${card.target === '사업주' ? 'text-[#15803D]' : 'text-[#0F62FE]'}`}>
                                      [{card.target}]
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B7A90] leading-relaxed truncate">
                                    {card.tagLine}
                                  </p>
                                </div>
                                {prep.checkedCount > 0 && (
                                  <span className="bg-[#EDF5FF] text-[#0F62FE] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#D0E2FF] shrink-0 self-center">
                                    ✓ {prep.checkedCount}/{prep.total}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2) 재활보상 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            2
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            재활보상
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Rehabilitation & Compensation
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[0, 1, 2, 3].map(index => {
                            const card = findCardByCategoryAndIndex('재활보상', index);
                            if (!card) return null;
                            const prep = getPreparedStatus(card);
                            return (
                              <button
                                key={card.id}
                                onClick={() => handleOpenDetail(card.id)}
                                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#D0E2FF] hover:bg-[#F6FAFF] transition-all group flex items-start gap-2.5"
                              >
                                <div className="h-6 w-6 rounded-full border border-[#D0E2FF] flex items-center justify-center text-xs font-bold text-[#0F62FE] shrink-0 bg-[#F8FBFF] group-hover:bg-[#0F62FE] group-hover:text-white transition-colors">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F294A] group-hover:text-[#0F62FE] transition-colors truncate">
                                      {card.title}
                                    </h4>
                                    <span className={`text-[10px] font-black shrink-0 ${card.target === '유족' ? 'text-purple-700' : 'text-[#0F62FE]'}`}>
                                      [{card.target}]
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B7A90] leading-relaxed truncate">
                                    {card.tagLine}
                                  </p>
                                </div>
                                {prep.checkedCount > 0 && (
                                  <span className="bg-[#EDF5FF] text-[#0F62FE] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#D0E2FF] shrink-0 self-center">
                                    ✓ {prep.checkedCount}/{prep.total}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3) 복지·지원 사업 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            3
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            복지·지원 사업
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Welfare Support
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[0, 1, 2].map(index => {
                            const card = findCardByCategoryAndIndex('복지·지원 사업', index);
                            if (!card) return null;
                            const prep = getPreparedStatus(card);
                            return (
                              <button
                                key={card.id}
                                onClick={() => handleOpenDetail(card.id)}
                                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#D0E2FF] hover:bg-[#F6FAFF] transition-all group flex items-start gap-2.5"
                              >
                                <div className="h-6 w-6 rounded-full border border-[#D0E2FF] flex items-center justify-center text-xs font-bold text-[#0F62FE] shrink-0 bg-[#F8FBFF] group-hover:bg-[#0F62FE] group-hover:text-white transition-colors">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F294A] group-hover:text-[#0F62FE] transition-colors truncate">
                                      {card.title}
                                    </h4>
                                    <span className="text-[10px] font-black text-[#0F62FE] shrink-0">
                                      [{card.target}]
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B7A90] leading-relaxed truncate">
                                    {card.tagLine}
                                  </p>
                                </div>
                                {prep.checkedCount > 0 && (
                                  <span className="bg-[#EDF5FF] text-[#0F62FE] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#D0E2FF] shrink-0 self-center">
                                    ✓ {prep.checkedCount}/{prep.total}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">

                      {/* 4) 가입지원 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            4
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            가입지원
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Enrollment Support
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[0, 1, 2, 3].map(index => {
                            const card = findCardByCategoryAndIndex('가입지원', index);
                            if (!card) return null;
                            const prep = getPreparedStatus(card);
                            return (
                              <button
                                key={card.id}
                                onClick={() => handleOpenDetail(card.id)}
                                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-[#D0E2FF] hover:bg-[#F6FAFF] transition-all group flex items-start gap-2.5"
                              >
                                <div className="h-6 w-6 rounded-full border border-[#D0E2FF] flex items-center justify-center text-xs font-bold text-[#0F62FE] shrink-0 bg-[#F8FBFF] group-hover:bg-[#0F62FE] group-hover:text-white transition-colors">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F294A] group-hover:text-[#0F62FE] transition-colors truncate">
                                      {card.title}
                                    </h4>
                                    <span className="text-[10px] font-black text-[#15803D] shrink-0">
                                      [{card.target}]
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B7A90] leading-relaxed truncate">
                                    {card.tagLine}
                                  </p>
                                </div>
                                {prep.checkedCount > 0 && (
                                  <span className="bg-[#EDF5FF] text-[#0F62FE] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#D0E2FF] shrink-0 self-center">
                                    ✓ {prep.checkedCount}/{prep.total}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 5) 민원 처리 안내 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            5
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            민원 처리 안내
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Service Process
                          </span>
                        </div>

                        <div className="bg-[#F8FBFF] border border-[#DDE7F0] rounded-2xl p-4.5 space-y-4 relative overflow-hidden">
                          <div className="absolute top-[28px] bottom-[32px] left-[25px] w-[1px] border-l border-dashed border-[#B8D7F3]" />
                          {[
                            { label: '서비스 접속', sub: '사전 준비를 위한 자가 진단 서비스 접속' },
                            { label: '민원 선택', sub: '원하는 업무를 선택하여 확인' },
                            { label: '준비서류 확인', sub: '필요 서류와 처리 대상을 사전 점검' },
                            { label: '창구 상담', sub: '준비 후 방문하여 신속하게 상담' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start relative z-10">
                              <div className="h-6 w-6 rounded-full bg-white border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-bold text-[#0F62FE] shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="text-left leading-normal">
                                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F294A]">
                                  {item.label}
                                </h4>
                                <p className="text-[11px] text-[#6B7A90] font-medium">
                                  {item.sub}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 6) 안내 메모 */}
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-1.5">
                          <span className="h-5.5 w-5.5 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center text-xs font-serif font-black">
                            6
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0F294A] font-serif">
                            안내 메모
                          </h3>
                          <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide">
                            Quick Notes
                          </span>
                        </div>

                        <div className="bg-[#F8FBFF] border border-[#DDE7F0] rounded-2xl p-4.5 text-left leading-normal">
                          <ul className="space-y-2.5 text-xs font-semibold text-[#374151]">
                            <li className="flex gap-2 items-start">
                              <span className="text-[10px] text-[#0F62FE] mt-0.5 select-none">•</span>
                              <span>세부 준비서류는 업무별로 달라질 수 있습니다.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                              <span className="text-[10px] text-[#0F62FE] mt-0.5 select-none">•</span>
                              <span>온라인 신고 가능 업무는 토탈서비스를 이용하세요.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                              <span className="text-[10px] text-[#0F62FE] mt-0.5 select-none">•</span>
                              <span>방문 전 최신 안내를 반드시 확인하세요.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#DDE7F0] flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2 text-[#9AAFC4] text-xs">
                      <span className="text-[10px]">◆</span>
                      <span className="font-serif">문의 및 상세안내: 근로복지공단 공식 안내채널 참고</span>
                      <span className="text-[10px]">◆</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 공단 핵심 용어 정리 */}
              <section className="bg-white border border-[#DDE7F0] rounded-[24px] p-5.5 sm:p-7 shadow-sm text-left mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-28 w-28 bg-[radial-gradient(circle_at_top_right,rgba(15,98,254,0.06),transparent_60%)] pointer-events-none" />
                <div className="flex items-center gap-2 border-b border-[#DDE7F0] pb-3 mb-4.5">
                  <div className="h-6 w-6 rounded-md bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF] flex items-center justify-center">
                    <BookOpen className="h-4 w-4 shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0F294A] font-serif flex items-center gap-1.5">
                      공단 핵심 행정 용어 정리
                    </h3>
                    <p className="text-[10px] text-[#6B7A90] font-bold mt-0.5">
                      괄호 안 핵심 용어를 터치하여 간결한 세부 의미를 확인해보세요.
                    </p>
                  </div>
                  <span className="text-[10px] text-[#6B7A90] font-serif italic ml-auto uppercase tracking-wide hidden sm:inline">
                    comwel glossary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GLOSSARY_ITEMS.map((item, idx) => {
                    const isOpen = activeGlossaryIdx === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'bg-[#F8FBFF] border-[#D0E2FF] shadow-3xs'
                            : 'bg-[#FCFEFF] border-[#DDE7F0] hover:bg-[#F6FAFF] hover:border-[#D0E2FF]'
                        }`}
                      >
                        <button
                          onClick={() => setActiveGlossaryIdx(isOpen ? null : idx)}
                          className="w-full text-left p-3.5 flex items-center justify-between gap-2.5 cursor-pointer"
                        >
                          <div className="min-w-0 pr-1">
                            <span className="text-xs font-black text-[#0F294A] hover:text-[#0F62FE] transition-colors block sm:inline mr-1.5">
                              {item.term}
                            </span>
                            <span className="text-[10.5px] font-bold text-[#0F62FE] italic leading-none inline-block">
                              {item.spec}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#6B7A90] shrink-0 bg-white border border-[#DDE7F0] px-1.5 py-0.5 rounded-md shadow-3xs select-none">
                            {isOpen ? '닫기 ▲' : '열기 ▼'}
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 border-t border-dashed border-[#DDE7F0] text-[11px] font-semibold text-[#374151] leading-relaxed">
                                {item.definition}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 이용 유의사항 및 안내 박스 */}
              <section className="rounded-2xl border border-[#F4C7C7] bg-[#FFF7F7] overflow-hidden shadow-3xs text-left mt-6">
                <div className="bg-[#C45E5E] text-white px-4 py-2.5 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-black tracking-tight">
                    이용 유의사항 및 법적 면책고지
                  </h4>
                </div>
                <div className="p-4 space-y-2.5 text-[11px] sm:text-xs text-[#374151] font-semibold leading-relaxed">
                  <p className="text-[#B42318] font-black">
                    • [비공식 안내 서비스] 본 플랫폼은 근로복지공단 공식 웹사이트가 아닌 비공식 정보 제공 도우미이며, 정부 및 공공기관을 대변하지 않습니다.
                  </p>
                  <p>
                    • [참고용 자가진단] 제공되는 정보 및 체크리스트는 행정 편의를 돕는 참고용 자료입니다. 실제 소관 지사 담당자 심사 기준과 서류 요구 요건에 따라 결과가 달라질 수 있으므로 정확한 내용은 반드시 공식 창구에서 확인하시기 바랍니다.
                  </p>
                  <p className="text-[#B42318] font-black">
                    🚨 개인정보 보호 안내: 본 서비스는 휴대폰 번호, 주민등록번호, 계좌 정보 등 개인정보를 수집하거나 서버에 저장하지 않는 자가 확인 시스템입니다.
                  </p>
                </div>
              </section>

              {/* 하단 통합 포털 허브 */}
              <section className="space-y-3.5 pt-6 text-left">
                <div className="flex items-center justify-between border-b border-[#DDE7F0] pb-1.5">
                  <span className="text-[9px] font-black text-[#6B7A90] tracking-wider font-serif">
                    OFFICIAL DIRECTORY
                  </span>
                  <span className="text-[10px] font-extrabold text-[#0F62FE]">
                    원 터치 간편 연결
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 text-center font-bold">
                  <a
                    href="https://www.comwel.or.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast('근로복지공단 공식 홈페이지로 이동합니다.')}
                    className="p-2.5 bg-white border border-[#DDE7F0] rounded-xl hover:border-[#0F62FE] transition-colors shadow-3xs group cursor-pointer block no-underline"
                  >
                    <span className="text-xs font-black text-[#0F294A] block group-hover:text-[#0F62FE]">
                      근로복지공단
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#6B7A90] font-bold block mt-0.5">
                      공식포털
                    </span>
                  </a>

                  <a
                    href="https://www.comwel.or.kr/comwel/info/data/papr/papr_lst.jsp"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast('고용산재보험 토탈서식 페이지로 이동합니다.')}
                    className="p-2.5 bg-white border border-[#DDE7F0] rounded-xl hover:border-[#0F62FE] transition-colors shadow-3xs group cursor-pointer block no-underline"
                  >
                    <span className="text-xs font-black text-[#0F294A] block group-hover:text-[#0F62FE]">
                      고용산재토탈
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#6B7A90] font-bold block mt-0.5">
                      민원전산접수
                    </span>
                  </a>

                  <a
                    href="https://www.gov.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast('정부24 공식 홈페이지로 이동합니다.')}
                    className="p-2.5 bg-white border border-[#DDE7F0] rounded-xl hover:border-[#0F62FE] transition-colors shadow-3xs group cursor-pointer block no-underline"
                  >
                    <span className="text-xs font-black text-[#0F294A] block group-hover:text-[#0F62FE]">
                      정부24
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#6B7A90] font-bold block mt-0.5">
                      인터넷증명서
                    </span>
                  </a>

                  <a
                    href="https://www.ips.go.kr/cht/ptl/main.ndo"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast('국민비서 구삐 공식 서비스 홈페이지로 이동합니다.')}
                    className="p-2.5 bg-[#F8FBFF] border border-[#D0E2FF] rounded-xl hover:border-[#0F62FE] transition-colors shadow-3xs group cursor-pointer block no-underline"
                  >
                    <span className="text-xs font-black text-[#0F294A] block group-hover:text-[#0F62FE] flex items-center justify-center gap-0.5">
                      <span className="text-[10px]">🤖</span>국민비서 구삐
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#0F62FE] font-black block mt-0.5">
                      알림서비스
                    </span>
                  </a>

                  <a
                    href="https://www.moel.go.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast('고용노동부 공식 홈페이지로 이동합니다.')}
                    className="p-2.5 bg-white border border-[#DDE7F0] rounded-xl hover:border-[#0F62FE] transition-colors shadow-3xs group cursor-pointer block no-underline"
                  >
                    <span className="text-xs font-black text-[#0F294A] block group-hover:text-[#0F62FE]">
                      고용노동부
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#6B7A90] font-bold block mt-0.5">
                      행정주무부처
                    </span>
                  </a>

                  <a
                    href="tel:1588-0075"
                    onClick={() => triggerToast('통합 문의 안내센터(1588-0075)로 전화를 연결합니다.')}
                    className="col-span-2 sm:col-span-1 p-2.5 bg-[#EDF5FF] border border-[#D0E2FF] rounded-xl hover:bg-white transition-colors shadow-3xs text-center block no-underline cursor-pointer"
                  >
                    <span className="text-xs font-black text-[#0F62FE] block">
                      대표 전용망
                    </span>
                    <span className="text-[9px] text-[#6B7A90] font-extrabold block mt-0.5">
                      1588-0075
                    </span>
                  </a>
                </div>
              </section>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="detail-layout-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.12 }}
            className="flex-1 flex flex-col"
          >
            <header className="bg-white border-b border-[#DDE7F0] text-[#0F294A] py-3.5 px-4 sm:px-6 sticky top-[58px] z-30 shadow-2xs">
              <div className="mx-auto max-w-2xl flex items-center justify-between">
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#F8FBFF] hover:bg-[#EDF5FF] border border-[#DDE7F0] px-3.5 py-2 rounded-xl active:scale-97 transition-all cursor-pointer select-none text-[#0F294A]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  전체 민원 목록으로 가기
                </button>
                <div className="text-[11px] font-black text-[#0F62FE] font-serif">
                  {activeCard.category} 안내서 확인 중
                </div>
              </div>
            </header>

            <main className="mx-auto w-full max-w-2xl px-4 py-6 flex-1 space-y-6">

              <section className="bg-white border border-[#DDE7F0] rounded-2xl p-5 shadow-2xs space-y-3.5 text-left">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-[#F8FBFF] px-2.5 py-0.5 text-[10px] font-black text-[#0F294A] border border-[#DDE7F0]">
                    영역: {activeCard.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#EDF5FF] text-[#0F62FE] px-2.5 py-0.5 text-[10px] font-black border border-[#D0E2FF]">
                    업무대상: {activeCard.target}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F294A] tracking-tight leading-tight font-serif">
                    {activeCard.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7A90] font-semibold leading-relaxed">
                    {activeCard.tagLine}
                  </p>
                </div>
                <div className="bg-[#F8FBFF] border border-[#DDE7F0] rounded-xl p-3 flex gap-2.5 items-start text-xs font-bold text-[#374151]">
                  <Sparkle className="h-4 w-4 text-[#0F62FE] shrink-0 mt-0.5" />
                  <span>체크리스트 항목을 터치하여 방문 전 준비 이력을 기록할 수 있습니다. 기록은 현재 브라우저에 임시 저장됩니다.</span>
                </div>
              </section>

              <section className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-[#6B7A90] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F62FE]" />
                  이 민원은 무엇인가요?
                </h4>
                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4.5 shadow-2xs">
                  <p className="text-xs sm:text-sm font-semibold text-[#374151] leading-relaxed">
                    {activeCard.whatIsThis}
                  </p>
                </div>
              </section>

              <section className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-[#6B7A90] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F62FE]" />
                  누가 신청하나요?
                </h4>
                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4.5 shadow-2xs">
                  <p className="text-xs sm:text-sm font-semibold text-[#374151] leading-relaxed">
                    {activeCard.whoApplies}
                  </p>
                </div>
              </section>

              <section className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-[#6B7A90] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F62FE]" />
                  청구 대표사례
                </h4>
                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4.5 shadow-2xs">
                  <ul className="space-y-4">
                    {activeCard.cases.map((cs, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-[#374151] font-semibold leading-normal">
                        <span className="h-5 px-1.5 rounded-md bg-[#EDF5FF] text-[9px] font-black text-[#0F62FE] flex items-center justify-center shrink-0 mt-0.5 select-none font-serif border border-[#D0E2FF]">
                          사례 {idx + 1}
                        </span>
                        <span>{cs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-2 text-left">
                <div className="flex items-center justify-between border-b border-[#DDE7F0] pb-1.5">
                  <h4 className="text-xs font-bold text-[#6B7A90] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0F62FE]" />
                    준비 및 자격 자가체크
                  </h4>
                  {(() => {
                    const { checkedCount, total } = getPreCheckStatus(activeCard);
                    return <span className="text-sm font-serif italic text-[#6B7A90] font-medium">진행 {checkedCount}/{total}</span>;
                  })()}
                </div>

                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="space-y-2">
                    {activeCard.preChecklist.map((item, idx) => {
                      const isPreChecked = !!preChecklistState[activeCard.id]?.[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => togglePreChecked(activeCard.id, idx)}
                          className={`w-full flex items-center justify-between p-3.5 text-left rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isPreChecked
                              ? 'bg-[#EDF5FF] border-[#D0E2FF] text-[#0F294A] shadow-2xs font-bold'
                              : 'bg-[#F8FBFF] border-[#DDE7F0] text-[#374151] hover:bg-[#EDF5FF]'
                          }`}
                        >
                          <span className={isPreChecked ? 'text-[#0F294A] font-extrabold pr-2' : 'text-[#374151] pr-2'}>
                            {item}
                          </span>
                          <div className={`h-[22px] w-[22px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isPreChecked
                              ? 'bg-[#0F62FE] border-[#0F62FE] text-white'
                              : 'border-[#B8D7F3] bg-white hover:border-[#0F62FE]'
                          }`}
                          >
                            {isPreChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const { checkedCount, total, percentage } = getPreCheckStatus(activeCard);
                    return (
                      <div className="pt-2 flex flex-col gap-1.5 text-[10px] border-t border-[#DDE7F0]/70 mt-1">
                        <div className="flex-1 bg-[#EDF5FF] h-[5px] rounded-full overflow-hidden">
                          <div className="bg-[#0F62FE] h-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[#6B7A90] font-bold">
                          <span>자가자격 확인율</span>
                          <span className="font-serif">{percentage}% ({checkedCount}/{total})</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>

              <section className="space-y-2 text-left">
                <div className="flex items-center justify-between border-b border-[#DDE7F0] pb-1.5">
                  <h4 className="text-xs font-bold text-[#C45E5E] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C45E5E]" />
                    필수 지참 서류 ★
                  </h4>
                  <span className="text-[10px] font-black text-[#C45E5E] bg-red-50 px-2 py-0.5 rounded border border-[#FADCDD]">
                    지사 내방 필수 구비
                  </span>
                </div>

                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="space-y-2">
                    {activeCard.requiredDocs.map((doc, idx) => {
                      const isChecked = !!checklist[activeCard.id]?.[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleDocChecked(activeCard.id, idx)}
                          className={`w-full flex items-center justify-between p-3.5 text-left rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/50 border-emerald-200/70 text-[#15803D] shadow-2xs'
                              : 'bg-[#F8FBFF] border-[#DDE7F0] text-[#374151] hover:bg-[#EDF5FF]'
                          }`}
                        >
                          <span className={isChecked ? 'line-through text-slate-400 font-medium' : 'text-[#0F294A] font-extrabold'}>
                            <span className="text-[#C45E5E] font-black mr-1 text-xs">★</span>{doc}
                          </span>
                          <div className={`h-[22px] w-[22px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#15803D] border-[#15803D] text-white'
                              : 'border-[#B8D7F3] bg-white hover:border-[#0F62FE]'
                          }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const { checkedCount, total, percentage } = getPreparedStatus(activeCard);
                    return (
                      <div className="pt-2 flex flex-col gap-1.5 text-[10px] border-t border-[#DDE7F0]/70 mt-1">
                        <div className="flex-1 bg-[#EAF7EF] h-[5px] rounded-full overflow-hidden">
                          <div className="bg-[#15803D] h-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[#6B7A90] font-bold">
                          <span>지참 서류 완성도</span>
                          <span className="text-[#15803D] font-serif">{percentage}% ({checkedCount}/{total})</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>

              {activeCard.helpfulDocs.length > 0 && (
                <section className="space-y-1.5 text-left">
                  <h4 className="text-xs font-bold text-[#695D75] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#695D75]" />
                    가져오면 빠른 대안 서류 🔹
                  </h4>
                  <div className="bg-white border border-[#DDE7F0] rounded-2xl p-4.5 shadow-2xs">
                    <ul className="space-y-2.5">
                      {activeCard.helpfulDocs.map((doc, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-[#374151] font-medium leading-normal">
                          <span className="text-[#695D75] text-xs mt-0.5 select-none">🔹</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              <section className="space-y-2 text-left">
                <div className="flex items-center justify-between border-b border-[#DDE7F0] pb-1.5">
                  <h4 className="text-xs font-bold text-[#0F294A] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0F294A]" />
                    민원 심사 및 처리절차
                  </h4>
                  <span className="text-xs font-serif italic text-[#6B7A90] font-medium">
                    Service Process Timeline
                  </span>
                </div>

                <div className="bg-white border border-[#DDE7F0] rounded-2xl p-5 shadow-2xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-[34px] bottom-[34px] left-[29px] w-[2px] bg-[#DDE7F0]" />
                  {activeCard.procedures.map((proc, idx) => {
                    const isDone = idx < 2;
                    const isCurrent = idx === 2;
                    return (
                      <div key={idx} className="flex gap-4 items-start text-xs sm:text-sm leading-relaxed relative z-10 font-bold">
                        <div className={`h-[24px] w-[24px] rounded-full text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 select-none border transition-all ${
                          isDone
                            ? 'bg-[#0F62FE] border-[#0F62FE] text-white shadow-3xs'
                            : isCurrent
                            ? 'bg-[#EDF5FF] border-[#0F62FE] text-[#0F62FE]'
                            : 'bg-white border-[#DDE7F0] text-slate-400'
                        }`}
                        >
                          {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black ${isDone ? 'text-[#6B7A90]' : 'text-[#0F294A]'}`}>
                              {idx + 1}단계
                            </span>
                            <span className={`inline-block text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded ${
                              isDone
                                ? 'bg-[#EDF5FF] text-[#0F62FE] border border-[#D0E2FF]'
                                : isCurrent
                                ? 'bg-[#FFF4DE] text-[#B7791F] border border-[#FDE2A7]'
                                : 'bg-[#F8FBFF] text-slate-450 border border-[#DDE7F0]'
                            }`}
                            >
                              {isDone ? '완성' : isCurrent ? '현 단계' : '대기'}
                            </span>
                          </div>
                          <p className={`${isDone ? 'text-[#6B7A90] font-medium' : isCurrent ? 'text-[#0F294A] font-extrabold' : 'text-[#374151] font-semibold'}`}>
                            {proc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-[#0F294A] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F62FE]" />
                  비대면 온라인 신청 안내
                </h4>
                <div className="bg-[#F8FBFF] border border-[#DDE7F0] rounded-2xl p-4.5 shadow-2xs space-y-2 text-xs sm:text-sm font-extrabold text-[#0F294A] leading-relaxed">
                  <p>{activeCard.onlineGuidance}</p>
                  <p className="text-[10px] sm:text-xs text-[#6B7A90] font-semibold leading-normal">
                    💡 방문 전 온라인 신청 가능 여부를 먼저 확인하면 대기시간을 줄일 수 있습니다. 실제 신청 가능 여부는 공식 시스템에서 최종 확인하시기 바랍니다.
                  </p>
                </div>
              </section>

              <section className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-[#C45E5E] tracking-wide uppercase flex items-center gap-1.5 font-serif">
                  <AlertTriangle className="h-4 w-4 text-[#C45E5E]" />
                  반려 방지 및 사전 주의 조항
                </h4>
                <div className="bg-white border-l-4 border-l-[#C45E5E] border-[#DDE7F0] rounded-r-2xl border-t border-b border-r p-4 shadow-2xs text-xs sm:text-sm font-semibold text-[#374151] leading-relaxed">
                  <p>{activeCard.caution}</p>
                </div>
              </section>

              <section className="space-y-3.5 pt-4">
                <div className="flex items-center justify-between border-b border-[#DDE7F0] pb-1.5">
                  <span className="text-[10px] font-black text-[#6B7A90] font-serif uppercase tracking-widest">
                    OFFICIAL ACTION AREA
                  </span>
                  <span className="text-[10px] font-extrabold text-[#0F294A]">
                    공식 경로 연결
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={getOnlineLink(activeCard)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerToast(`[안내] "${activeCard.onlineUrlLabel}" 관련 페이지로 이동합니다.`)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F62FE] px-5 py-4 text-sm font-black text-white hover:bg-[#0043CE] active:scale-98 transition-all shadow-sm cursor-pointer no-underline text-center"
                  >
                    <ExternalLink className="h-5 w-5 shrink-0" />
                    {activeCard.onlineUrlLabel} 바로가기
                  </a>

                  <div className="grid grid-cols-3 gap-2.5 font-bold">
                    <a
                      href="tel:1588-0075"
                      onClick={() => triggerToast('대표전화 안내 서비스: 1588-0075로 전화 연결이 준비되었습니다.')}
                      className="inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#DDE7F0] px-3 py-3.5 text-xs text-[#0F294A] hover:bg-[#F8FBFF] active:scale-97 transition-all shadow-3xs cursor-pointer no-underline text-center"
                    >
                      <Phone className="h-5 w-5 text-[#0F62FE] shrink-0" />
                      <span className="text-[11px] font-black">1588-0075</span>
                    </a>

                    <a
                      href="https://www.comwel.or.kr/comwel/info/data/papr/papr_lst.jsp"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerToast('[안내] 온라인 민원 및 서식 다운로드 페이지로 연결됩니다.')}
                      className="inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#DDE7F0] px-3 py-3.5 text-xs text-[#0F294A] hover:bg-[#F8FBFF] active:scale-97 transition-all shadow-3xs cursor-pointer no-underline text-center"
                    >
                      <Globe className="h-5 w-5 text-[#15803D] shrink-0" />
                      <span className="text-[11px] font-black">토탈서비스</span>
                    </a>

                    <a
                      href="https://www.comwel.or.kr/comwel/intr/orgn/find.jsp"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerToast('[안내] 근로복지공단 공식 지사 찾기 페이지로 이동합니다.')}
                      className="inline-flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#DDE7F0] px-3 py-3.5 text-xs text-[#0F294A] hover:bg-[#F8FBFF] active:scale-97 transition-all shadow-3xs cursor-pointer no-underline text-center"
                    >
                      <MapPin className="h-5 w-5 text-[#0E7490] shrink-0" />
                      <span className="text-[11px] font-black">관할지사</span>
                    </a>
                  </div>

                  <div className="pt-1 font-bold">
                    <a
                      href={getFormLink(activeCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerToast('[안내] 공식 홈페이지 서식 다운로드 코너로 이동합니다.')}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#DDE7F0] px-4 py-3.5 text-xs text-[#0F294A] hover:bg-[#F8FBFF] active:scale-97 transition-all shadow-3xs cursor-pointer no-underline text-center"
                    >
                      <FileDown className="h-4 w-4 text-[#15803D] shrink-0" />
                      공식 서식 다운
                    </a>
                  </div>

                  <button
                    onClick={() => resetCardChecklist(activeCard.id)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#6B7A90] hover:text-rose-700 border border-dashed border-[#DDE7F0] py-2.5 rounded-xl bg-[#F8FBFF] hover:bg-rose-50/50 transition-colors cursor-pointer mt-1"
                  >
                    이 민원에 체크된 자가 기록 초기화하기
                  </button>
                </div>
              </section>

              <div className="pt-6 text-center font-bold">
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-1 text-xs text-[#0F62FE] hover:underline cursor-pointer"
                >
                  ← 전체 안내판으로 돌아가기
                </button>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 푸터 */}
      <footer className="w-full bg-[#0F294A] text-white pt-12 pb-10 px-4 sm:px-6 relative overflow-hidden shrink-0 mt-auto border-t border-[#0B1F38]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(15,98,254,0.18),transparent_40%)] pointer-events-none" />
        <div className="mx-auto max-w-4xl space-y-6 text-center relative z-10">
          <div className="bg-white/8 rounded-2xl py-4.5 px-4 border border-white/10 max-w-lg mx-auto shadow-sm">
            <p className="text-xs sm:text-sm font-bold tracking-tight text-white leading-relaxed">
              ✨ <span className="text-[#78A9FF] font-black">방문 전 사전 체크가</span> 대기시간을 줄이는 첫 단계입니다.
            </p>
          </div>

          <p className="text-[10px] sm:text-[11.5px] text-white/75 leading-relaxed max-w-xl mx-auto font-medium">
            본 서비스는 근로복지공단 지사를 방문하기 전 필요 서류를 자가 확인하도록 돕는 <span className="text-[#78A9FF] font-black">비공식 길잡이 도구</span>입니다. 정부, 고용노동부, 근로복지공단 등의 공식 국가 기관 및 공공부처를 대변하거나 대리하지 않습니다.
          </p>

          <p className="text-[9.5px] sm:text-[10.5px] text-[#FDDC69] leading-relaxed max-w-xl mx-auto font-semibold border-t border-white/10 pt-3">
            ※ [법적 면책고지] 본 가이드가 제시하는 정보의 최신성, 완전성 및 법적 효력을 보장하지 않습니다. 정확한 판단과 조치는 반드시 공식 정보망과 담당자 안내를 확인하시기 바랍니다.
          </p>

          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/45 font-bold max-w-3xl mx-auto">
            <span>© 2026 방문 전 안심 길잡이. All rights reserved.</span>
            <span>고객 전용 자가진단 편의 시스템</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F294A] text-white rounded-xl py-3.5 px-5 shadow-xl border border-[#1C4E80] flex items-center gap-2.5 min-w-[280px] sm:min-w-[340px] max-w-[90vw]"
          >
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#78A9FF]" />
            <span className="text-xs font-bold leading-snug text-left">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}