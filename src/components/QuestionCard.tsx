import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  FileEdit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SurveyQuestion, QuestionAnswer } from '../types';

interface QuestionCardProps {
  question: SurveyQuestion;
  answer?: Partial<QuestionAnswer>;
  onAnswerChange: (questionId: string, value: any) => void;
  onNotesChange: (questionId: string, notes: string) => void;
  onToggleComplete: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  onNotesChange,
  onToggleComplete,
}) => {
  const [showTip, setShowTip] = useState(false);
  const [showNotes, setShowNotes] = useState(Boolean(answer?.notes));

  const isCompleted = answer?.isCompleted || (answer?.value !== undefined && answer?.value !== '');
  const currentValue = answer?.value;

  const handleSelectRadio = (val: string) => {
    onAnswerChange(question.id, val);
  };

  const handleToggleMulti = (opt: string) => {
    const currentList = Array.isArray(currentValue) ? (currentValue as string[]) : [];
    if (currentList.includes(opt)) {
      onAnswerChange(
        question.id,
        currentList.filter(item => item !== opt)
      );
    } else {
      onAnswerChange(question.id, [...currentList, opt]);
    }
  };

  return (
    <div
      id={`question-card-${question.id}`}
      className={`rounded-xl border transition-all duration-200 bg-white p-4 sm:p-5 shadow-xs ${
        isCompleted
          ? 'border-slate-200 hover:border-slate-300'
          : question.critical
          ? 'border-amber-300/80 bg-amber-50/20'
          : 'border-slate-200'
      }`}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            {question.code}
          </span>
          {question.critical && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Trọng Yếu
            </span>
          )}
        </div>

        {/* Complete Toggle */}
        <button
          type="button"
          onClick={() => onToggleComplete(question.id)}
          title={isCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã khảo sát'}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition font-medium ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2
            className={`w-3.5 h-3.5 ${
              isCompleted ? 'text-emerald-600' : 'text-slate-400'
            }`}
          />
          <span className="hidden sm:inline">
            {isCompleted ? 'Đã khảo sát' : 'Chưa xong'}
          </span>
        </button>
      </div>

      {/* Question Title & Description */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
        {question.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-3.5 leading-relaxed">
        {question.description}
      </p>

      {/* Input Controls */}
      <div className="mb-3">
        {/* NUMBER TYPE */}
        {question.type === 'number' && (
          <div className="flex items-center gap-2 max-w-xs">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="0"
                value={currentValue !== undefined ? (currentValue as number) : ''}
                onChange={e =>
                  onAnswerChange(
                    question.id,
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                placeholder={question.placeholder || 'Nhập số...'}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-800"
              />
            </div>
            {question.unit && (
              <span className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                {question.unit}
              </span>
            )}
          </div>
        )}

        {/* TEXT TYPE */}
        {question.type === 'text' && (
          <input
            type="text"
            value={currentValue !== undefined ? (currentValue as string) : ''}
            onChange={e => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder || 'Nhập câu trả lời...'}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-800"
          />
        )}

        {/* RADIO PILLS */}
        {question.type === 'radio' && question.options && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = currentValue === opt;
              return (
                <label
                  key={idx}
                  onClick={() => handleSelectRadio(opt)}
                  className={`flex items-start gap-3 p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition select-none ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-medium shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name={`radio-${question.id}`}
                    checked={isSelected}
                    onChange={() => handleSelectRadio(opt)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1 leading-snug">{opt}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* SELECT DROPDOWN */}
        {question.type === 'select' && question.options && (
          <select
            value={currentValue !== undefined ? (currentValue as string) : ''}
            onChange={e => onAnswerChange(question.id, e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-800"
          >
            <option value="">-- Chọn phương án khảo sát --</option>
            {question.options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* MULTISELECT PILLS */}
        {question.type === 'multiselect' && question.options && (
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-medium">
              (Có thể tích chọn nhiều phương án)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {question.options.map((opt, idx) => {
                const isSelected =
                  Array.isArray(currentValue) && (currentValue as string[]).includes(opt);
                return (
                  <label
                    key={idx}
                    onClick={() => handleToggleMulti(opt)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 text-blue-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleMulti(opt)}
                      className="mt-0.5 rounded-sm text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1 leading-snug">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* BOOLEAN TOGGLE */}
        {question.type === 'boolean' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onAnswerChange(question.id, true)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                currentValue === true
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Có / Nguy cơ cao
            </button>
            <button
              type="button"
              onClick={() => onAnswerChange(question.id, false)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                currentValue === false
                  ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Không / An toàn
            </button>
          </div>
        )}
      </div>

      {/* Footer Utilities: AV Pro Tip & Notes */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          {question.avTip ? (
            <button
              type="button"
              onClick={() => setShowTip(!showTip)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showTip ? 'Ẩn lưu ý kỹ sư' : 'Lưu ý kỹ thuật thực chiến'}</span>
              {showTip ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1 transition"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{showNotes ? 'Thu gọn ghi chú' : 'Ghi chú hiện trường'}</span>
          </button>
        </div>

        {/* Expandable AV Tip */}
        {showTip && question.avTip && (
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed animate-in fade-in duration-150">
            <span className="font-bold text-blue-700">💡 Chuyên gia AV tư vấn: </span>
            {question.avTip}
          </div>
        )}

        {/* Expandable Field Notes */}
        {showNotes && (
          <div className="mt-1 animate-in fade-in duration-150">
            <textarea
              rows={2}
              value={answer?.notes || ''}
              onChange={e => onNotesChange(question.id, e.target.value)}
              placeholder="Ghi chú chi tiết hiện trường (ví dụ: vướng cột chịu lực, ổ cắm cách 1.5m, cần thang nhôm 3m...)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};
