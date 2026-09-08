import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, FileText, Code } from 'lucide-react';
import { ProjectMetadata, SurveyCategory, QuestionAnswer, AvTechnicalCalculations } from '../types';
import { generateMarkdownSummary } from '../utils/avCalculations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProjectMetadata;
  categories: SurveyCategory[];
  answers: Record<string, Partial<QuestionAnswer>>;
  calculations: AvTechnicalCalculations;
  onImportJson: (data: { metadata: ProjectMetadata; answers: Record<string, Partial<QuestionAnswer>> }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  metadata,
  categories,
  answers,
  calculations,
  onImportJson,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownText = generateMarkdownSummary(metadata, answers, categories, calculations);
  const jsonString = JSON.stringify({ metadata, answers }, null, 2);

  const handleCopy = () => {
    const textToCopy = activeTab === 'markdown' ? markdownText : jsonString;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khao-sat-${metadata.customerName || 'phong-hop'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.metadata && parsed.answers) {
          onImportJson(parsed);
          onClose();
        } else {
          alert('Tệp JSON không đúng định dạng khảo sát phòng họp.');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Xuất Dữ Liệu & Chia Sẻ Khảo Sát
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sao chép văn bản để gửi Zalo / Email hoặc lưu file JSON dự phòng
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 text-xs">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`pb-2.5 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'markdown'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Văn Bản Markdown / Báo Cáo
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Dữ Liệu Thô JSON
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'markdown' ? (
            <textarea
              readOnly
              rows={14}
              value={markdownText}
              className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-none select-all"
            />
          ) : (
            <div className="space-y-4">
              <textarea
                readOnly
                rows={12}
                value={jsonString}
                className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 outline-none select-all"
              />
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                <span>Tải file về máy để lưu trữ hoặc nạp lại khi cần khảo sát tiếp:</span>
                <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer font-medium flex items-center gap-1 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nạp file JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500">
            {activeTab === 'markdown'
              ? 'Dễ dàng dán trực tiếp vào Zalo, Microsoft Teams hoặc Word'
              : 'Dùng để sao lưu toàn bộ thông tin khảo sát'}
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'json' && (
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải File JSON</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép Nội Dung</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
