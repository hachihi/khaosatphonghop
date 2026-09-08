import React from 'react';
import {
  FileText,
  Printer,
  Share2,
  FolderOpen,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ProjectMetadata } from '../types';

interface HeaderProps {
  metadata: ProjectMetadata;
  completedCount: number;
  totalCount: number;
  onOpenProjectInfo: () => void;
  onOpenPresets: () => void;
  onOpenPrint: () => void;
  onOpenExport: () => void;
  onOpenSavedSurveys: () => void;
  onNewSurvey: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  completedCount,
  totalCount,
  onOpenProjectInfo,
  onOpenPresets,
  onOpenPrint,
  onOpenExport,
  onOpenSavedSurveys,
  onNewSurvey,
}) => {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Room Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                  Khảo Sát Kỹ Thuật Phòng Họp AV
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden sm:inline-block">
                  Tiêu chuẩn AVIXA
                </span>
              </div>
              <button
                id="header-edit-project-btn"
                onClick={onOpenProjectInfo}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition group mt-0.5 text-left"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition" />
                <span className="font-medium text-blue-200 underline decoration-dotted underline-offset-2">
                  {metadata.customerName || 'Bấm để nhập Khách Hàng'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">
                  {metadata.roomName || 'Tên phòng họp'}
                </span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {metadata.surveyDate || 'Hôm nay'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              id="btn-open-presets"
              onClick={onOpenPresets}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mẫu Có Sẵn</span>
            </button>

            <button
              id="btn-saved-surveys"
              onClick={onOpenSavedSurveys}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Hồ Sơ Đã Lưu</span>
            </button>

            <button
              id="btn-export-share"
              onClick={onOpenExport}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xuất / Chia sẻ</span>
            </button>

            <button
              id="btn-print-report"
              onClick={onOpenPrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Phiếu Khảo Sát</span>
            </button>

            <button
              id="btn-new-survey"
              onClick={onNewSurvey}
              title="Tạo khảo sát phòng mới"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar Strip */}
        <div className="pb-2.5 pt-1 flex items-center gap-3">
          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percent === 100
                  ? 'bg-emerald-500'
                  : percent > 50
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {completedCount}/{totalCount} câu hỏi ({percent}%)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
