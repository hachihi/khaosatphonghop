import React from 'react';
import { X, FolderOpen, Trash2, Calendar, Building2, Plus, ArrowRight } from 'lucide-react';
import { ProjectMetadata, QuestionAnswer } from '../types';

export interface SavedSurveyRecord {
  id: string;
  metadata: ProjectMetadata;
  answers: Record<string, Partial<QuestionAnswer>>;
  savedAt: string;
}

interface SavedSurveysDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSurveys: SavedSurveyRecord[];
  currentId: string;
  onLoadSurvey: (record: SavedSurveyRecord) => void;
  onDeleteSurvey: (id: string) => void;
  onNewSurvey: () => void;
}

export const SavedSurveysDrawer: React.FC<SavedSurveysDrawerProps> = ({
  isOpen,
  onClose,
  savedSurveys,
  currentId,
  onLoadSurvey,
  onDeleteSurvey,
  onNewSurvey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Danh Sách Phòng Họp Đã Lưu</h2>
              <span className="text-[11px] text-slate-500">
                {savedSurveys.length} hồ sơ trong bộ nhớ máy
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Survey */}
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => {
              onNewSurvey();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Biên Bản Khảo Sát Mới</span>
          </button>
        </div>

        {/* List of saved surveys */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {savedSurveys.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có biên bản khảo sát nào được lưu.
            </div>
          ) : (
            savedSurveys.map(item => {
              const isCurrent = item.id === currentId;
              const answeredCount = Object.values(item.answers).filter(
                (a: any) => a && a.value !== undefined && a.value !== ''
              ).length;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.metadata.customerName || 'Khách hàng chưa đặt tên'}</span>
                      </div>
                      <div className="text-xs font-semibold text-blue-700 mt-0.5">
                        {item.metadata.roomName || 'Phòng họp chưa đặt tên'}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded-full">
                        Đang mở
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.savedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span>{answeredCount} câu đã khảo sát</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onDeleteSurvey(item.id)}
                      title="Xóa hồ sơ"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          onLoadSurvey(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-medium rounded-md transition flex items-center gap-1"
                      >
                        <span>Mở</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
