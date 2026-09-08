import { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Building2,
  Tv,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { ProjectMetadata, QuestionAnswer, SurveyPreset } from './types';
import { SURVEY_CATEGORIES, SURVEY_PRESETS } from './data/surveyQuestions';
import { calculateAvParameters } from './utils/avCalculations';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { QuestionCard } from './components/QuestionCard';
import { SmartAvAdvisory } from './components/SmartAvAdvisory';
import { ProjectInfoModal } from './components/ProjectInfoModal';
import { PresetsModal } from './components/PresetsModal';
import { PrintReportView } from './components/PrintReportView';
import { ExportModal } from './components/ExportModal';
import { SavedSurveysDrawer, SavedSurveyRecord } from './components/SavedSurveysDrawer';

const STORAGE_KEY_CURRENT = 'av_survey_current_v1';
const STORAGE_KEY_HISTORY = 'av_survey_history_v1';

const DEFAULT_METADATA: ProjectMetadata = {
  id: 'prj-' + Math.random().toString(36).substring(2, 8),
  customerName: 'Tập Đoàn Công Nghệ & Thương Mại V-Tech',
  projectName: 'Nâng Cấp Hội Nghị Truyền Hình & Smart Meeting Room 2026',
  roomName: 'Phòng Họp Ban Giám Đốc (Boardroom Tầng 10)',
  roomType: 'medium',
  address: 'Tòa nhà Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
  contactPerson: 'Nguyễn Văn Minh (Trưởng phòng IT)',
  contactPhone: '0988.123.456',
  contactEmail: 'minh.nv@vtech-corp.vn',
  surveyorName: 'Trần Kỹ Sư AV (Chuyên viên Tích hợp Hệ thống)',
  surveyorPhone: '0912.888.999',
  surveyDate: new Date().toISOString().split('T')[0],
  targetDate: '2026-10-15',
  estimatedBudget: '150.000.000 - 200.000.000 VNĐ',
  generalNotes: 'Khách yêu cầu thẩm mỹ cao, mặt bàn sạch không dây (Clean Desk). Đội thi công cần đăng ký thẻ ra vào tòa nhà trước 2 ngày.',
  updatedAt: new Date().toISOString(),
};

export default function App() {
  // 1. Initial State from localStorage or fallback
  const [metadata, setMetadata] = useState<ProjectMetadata>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.metadata) return parsed.metadata;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_METADATA;
  });

  const [answers, setAnswers] = useState<Record<string, Partial<QuestionAnswer>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) return parsed.answers;
      }
    } catch (e) {
      // ignore
    }
    // Default to medium preset for rich immediate demonstration
    return SURVEY_PRESETS[1].defaultAnswers;
  });

  const [savedSurveys, setSavedSurveys] = useState<SavedSurveyRecord[]>(() => {
    try {
      const hist = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (hist) return JSON.parse(hist);
    } catch (e) {
      // ignore
    }
    return [];
  });

  // 2. Navigation & Filter State
  const [activeCategoryId, setActiveCategoryId] = useState<string>('dimensions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState<boolean>(false);
  const [filterIncompleteOnly, setFilterIncompleteOnly] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'questions' | 'advisory'>('questions');

  // 3. Modals State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSavedSurveysOpen, setIsSavedSurveysOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CURRENT,
        JSON.stringify({ metadata, answers, updatedAt: new Date().toISOString() })
      );
    } catch (e) {
      // ignore
    }
  }, [metadata, answers]);

  // Save current project to history
  const handleSaveToHistory = () => {
    const record: SavedSurveyRecord = {
      id: metadata.id,
      metadata,
      answers,
      savedAt: new Date().toISOString(),
    };
    setSavedSurveys(prev => {
      const existingIdx = prev.findIndex(r => r.id === metadata.id);
      let updated;
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = record;
      } else {
        updated = [record, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
    showToast('Đã lưu hồ sơ khảo sát thành công!');
  };

  // 5. Calculations
  const calculations = useMemo(() => {
    return calculateAvParameters(answers);
  }, [answers]);

  // 6. Answer Handlers
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        value,
        isCompleted: value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0),
      },
    }));
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        notes,
      },
    }));
  };

  const handleToggleComplete = (questionId: string) => {
    setAnswers(prev => {
      const current = prev[questionId];
      const isCurrentlyCompleted = current?.isCompleted;
      return {
        ...prev,
        [questionId]: {
          ...current,
          questionId,
          isCompleted: !isCurrentlyCompleted,
        },
      };
    });
  };

  // 7. Load Preset
  const handleSelectPreset = (preset: SurveyPreset) => {
    setAnswers(preset.defaultAnswers);
    setMetadata(prev => ({
      ...prev,
      roomType: preset.roomType,
      roomName: `${prev.roomName.split('(')[0].trim()} (${preset.name})`,
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Đã áp dụng mẫu: ${preset.name}`);
  };

  // 8. New Survey
  const handleNewSurvey = () => {
    if (window.confirm('Bạn có chắc muốn tạo biên bản khảo sát mới? Dữ liệu hiện tại đã được lưu vào bộ nhớ.')) {
      handleSaveToHistory();
      const newId = 'prj-' + Math.random().toString(36).substring(2, 8);
      setMetadata({
        ...DEFAULT_METADATA,
        id: newId,
        customerName: '',
        roomName: 'Phòng Họp Mới',
        surveyDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      });
      setAnswers({});
      setActiveCategoryId('dimensions');
      showToast('Đã khởi tạo biên bản khảo sát mới');
    }
  };

  // 9. Load Survey Record
  const handleLoadSurvey = (record: SavedSurveyRecord) => {
    setMetadata(record.metadata);
    setAnswers(record.answers);
    showToast(`Đã mở khảo sát: ${record.metadata.roomName}`);
  };

  // 10. Delete Survey Record
  const handleDeleteSurvey = (id: string) => {
    const updated = savedSurveys.filter(s => s.id !== id);
    setSavedSurveys(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    showToast('Đã xóa biên bản khảo sát khỏi lịch sử');
  };

  // 11. Import JSON
  const handleImportJson = (data: { metadata: ProjectMetadata; answers: Record<string, Partial<QuestionAnswer>> }) => {
    setMetadata(data.metadata);
    setAnswers(data.answers);
    showToast('Đã nạp tệp khảo sát JSON thành công!');
  };

  // 12. Question completion counters
  const allQuestions = useMemo(() => {
    return SURVEY_CATEGORIES.flatMap(c => c.questions);
  }, []);

  const totalQuestionsCount = allQuestions.length;
  const completedQuestionsCount = useMemo(() => {
    return allQuestions.filter(q => {
      const ans = answers[q.id];
      return ans?.isCompleted || (ans?.value !== undefined && ans?.value !== '' && !(Array.isArray(ans.value) && ans.value.length === 0));
    }).length;
  }, [allQuestions, answers]);

  // 13. Filtered questions
  const currentCategory = SURVEY_CATEGORIES.find(c => c.id === activeCategoryId) || SURVEY_CATEGORIES[0];

  const displayedQuestions = useMemo(() => {
    let list = searchQuery ? allQuestions : currentCategory.questions;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.options?.some(opt => opt.toLowerCase().includes(q))
      );
    }

    if (filterCriticalOnly) {
      list = list.filter(item => item.critical);
    }

    if (filterIncompleteOnly) {
      list = list.filter(item => {
        const ans = answers[item.id];
        return !ans?.isCompleted && (ans?.value === undefined || ans?.value === '');
      });
    }

    return list;
  }, [searchQuery, currentCategory, allQuestions, filterCriticalOnly, filterIncompleteOnly, answers]);

  // Current category index for next/previous navigation
  const currentCategoryIdx = SURVEY_CATEGORIES.findIndex(c => c.id === activeCategoryId);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        metadata={metadata}
        completedCount={completedQuestionsCount}
        totalCount={totalQuestionsCount}
        onOpenProjectInfo={() => setIsProjectModalOpen(true)}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenSavedSurveys={() => setIsSavedSurveysOpen(true)}
        onNewSurvey={handleNewSurvey}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2 sticky top-[108px] z-20">
        <button
          onClick={() => setMobileTab('questions')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            mobileTab === 'questions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          Câu Hỏi Khảo Sát ({displayedQuestions.length})
        </button>
        <button
          onClick={() => setMobileTab('advisory')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
            mobileTab === 'advisory'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Phân Tích & Đề Xuất AV</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Navigation & Search Filters (Cols 3) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <CategoryNav
              categories={SURVEY_CATEGORIES}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              answers={answers}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterCriticalOnly={filterCriticalOnly}
              onToggleFilterCritical={() => setFilterCriticalOnly(!filterCriticalOnly)}
              filterIncompleteOnly={filterIncompleteOnly}
              onToggleFilterIncomplete={() => setFilterIncompleteOnly(!filterIncompleteOnly)}
            />

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 text-xs">
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Thao Tác Nhanh
              </div>
              <button
                onClick={handleSaveToHistory}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-700 font-medium border border-slate-200 transition text-left flex items-center justify-between"
              >
                <span>Lưu Hồ Sơ Hiện Tại</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </button>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-700 font-medium border border-slate-200 transition text-left flex items-center justify-between"
              >
                <span>In Biên Bản Khảo Sát</span>
                <Tv className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-700 font-medium border border-slate-200 transition text-left flex items-center justify-between"
              >
                <span>Xuất Markdown / Báo Cáo</span>
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Center Column: Questions Feed (Cols 6) */}
          <div
            className={`lg:col-span-6 space-y-4 ${
              mobileTab === 'advisory' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Mobile Category Dropdown */}
            <div className="lg:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <label className="text-xs font-bold text-slate-700">Chọn danh mục khảo sát:</label>
              <select
                value={activeCategoryId}
                onChange={e => {
                  setSearchQuery('');
                  setActiveCategoryId(e.target.value);
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
              >
                {SURVEY_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Header Banner */}
            {!searchQuery ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                    Chuyên mục {currentCategoryIdx + 1} / {SURVEY_CATEGORIES.length}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {currentCategory.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentCategory.subtitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                    {displayedQuestions.length} câu hỏi
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900">
                <span>
                  Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong> ({displayedQuestions.length} câu hỏi phù hợp)
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-bold underline text-blue-700 hover:text-blue-900"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Questions List */}
            {displayedQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Không tìm thấy câu hỏi phù hợp với tiêu chí lọc.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCriticalOnly(false);
                    setFilterIncompleteOnly(false);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedQuestions.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    answer={answers[q.id]}
                    onAnswerChange={handleAnswerChange}
                    onNotesChange={handleNotesChange}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}

            {/* Next / Previous Category Navigation */}
            {!searchQuery && (
              <div className="pt-4 flex items-center justify-between">
                <button
                  disabled={currentCategoryIdx === 0}
                  onClick={() => setActiveCategoryId(SURVEY_CATEGORIES[currentCategoryIdx - 1].id)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Mục Trước</span>
                </button>

                <div className="text-xs text-slate-400 font-medium">
                  {currentCategoryIdx + 1} / {SURVEY_CATEGORIES.length}
                </div>

                <button
                  disabled={currentCategoryIdx === SURVEY_CATEGORIES.length - 1}
                  onClick={() => setActiveCategoryId(SURVEY_CATEGORIES[currentCategoryIdx + 1].id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition shadow-xs"
                >
                  <span>Mục Kế Tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Smart AV Advisory & Calculations (Cols 3) */}
          <div
            className={`lg:col-span-3 ${
              mobileTab === 'questions' ? 'hidden lg:block' : 'block'
            }`}
          >
            <SmartAvAdvisory calculations={calculations} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">
              Công Cụ Khảo Sát & Chuẩn Hóa Phòng Họp AV Chuyên Nghiệp
            </span>
          </div>
          <div>
            Áp dụng nguyên tắc tiêu chuẩn quốc tế AVIXA DISCAS, ITU-T & Microsoft Teams Rooms
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProjectInfoModal
        metadata={metadata}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={updated => {
          setMetadata(updated);
          showToast('Đã lưu thông tin dự án!');
        }}
      />

      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {isPrintModalOpen && (
        <PrintReportView
          metadata={metadata}
          categories={SURVEY_CATEGORIES}
          answers={answers}
          calculations={calculations}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        metadata={metadata}
        categories={SURVEY_CATEGORIES}
        answers={answers}
        calculations={calculations}
        onImportJson={handleImportJson}
      />

      <SavedSurveysDrawer
        isOpen={isSavedSurveysOpen}
        onClose={() => setIsSavedSurveysOpen(false)}
        savedSurveys={savedSurveys}
        currentId={metadata.id}
        onLoadSurvey={handleLoadSurvey}
        onDeleteSurvey={handleDeleteSurvey}
        onNewSurvey={handleNewSurvey}
      />
    </div>
  );
}
