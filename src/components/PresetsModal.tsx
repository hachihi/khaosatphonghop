import React from 'react';
import { X, Sparkles, Check, Users, ArrowRight } from 'lucide-react';
import { SurveyPreset } from '../types';
import { SURVEY_PRESETS } from '../data/surveyQuestions';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: SurveyPreset) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Chọn Mẫu Phòng Họp Khảo Sát Nhanh
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nạp dữ liệu mẫu cấu hình chuẩn giúp tiết kiệm thời gian hoặc tham khảo thông số kỹ thuật
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of presets */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {SURVEY_PRESETS.map(preset => (
            <div
              key={preset.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition">
                    {preset.name}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" />
                    {preset.capacity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold rounded-lg transition shrink-0 flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>Nạp Mẫu Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
