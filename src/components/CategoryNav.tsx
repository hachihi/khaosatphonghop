import React from 'react';
import {
  Maximize2,
  Volume2,
  Sun,
  Tv,
  Laptop,
  Camera,
  Mic,
  Network,
  Sliders,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { SurveyCategory, QuestionAnswer } from '../types';

interface CategoryNavProps {
  categories: SurveyCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  answers: Record<string, Partial<QuestionAnswer>>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterCriticalOnly: boolean;
  onToggleFilterCritical: () => void;
  filterIncompleteOnly: boolean;
  onToggleFilterIncomplete: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Maximize2: <Maximize2 className="w-4 h-4" />,
  Volume2: <Volume2 className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Tv: <Tv className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Mic: <Mic className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  answers,
  searchQuery,
  onSearchChange,
  filterCriticalOnly,
  onToggleFilterCritical,
  filterIncompleteOnly,
  onToggleFilterIncomplete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Tìm câu hỏi (vd: kính, HDMI, Teams, camera, mic...)"
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={onToggleFilterCritical}
          className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition ${
            filterCriticalOnly
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Chỉ xem mục Trọng Yếu</span>
        </button>

        <button
          onClick={onToggleFilterIncomplete}
          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
            filterIncompleteOnly
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>Chỉ xem chưa xong</span>
        </button>
      </div>

      {/* Categories Vertical List */}
      <div className="space-y-1 pt-1 border-t border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
          Danh Mục Khảo Sát
        </div>
        {categories.map(category => {
          const isActive = category.id === activeCategoryId && !searchQuery;
          const totalInCat = category.questions.length;
          const answeredInCat = category.questions.filter(q => {
            const ans = answers[q.id];
            return ans?.isCompleted || (ans?.value !== undefined && ans?.value !== '');
          }).length;
          const isCategoryComplete = answeredInCat === totalInCat && totalInCat > 0;

          return (
            <button
              key={category.id}
              onClick={() => {
                onSearchChange('');
                onSelectCategory(category.id);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-50 text-blue-900 font-semibold shadow-xs border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className={`${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {ICON_MAP[category.iconName] || <Maximize2 className="w-4 h-4" />}
                </span>
                <span className="truncate">{category.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isCategoryComplete
                      ? 'bg-emerald-100 text-emerald-700'
                      : isActive
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {answeredInCat}/{totalInCat}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
