import React from 'react';
import { Printer, X, Building2, User, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ProjectMetadata, SurveyCategory, QuestionAnswer, AvTechnicalCalculations } from '../types';

interface PrintReportViewProps {
  metadata: ProjectMetadata;
  categories: SurveyCategory[];
  answers: Record<string, Partial<QuestionAnswer>>;
  calculations: AvTechnicalCalculations;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  metadata,
  categories,
  answers,
  calculations,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 print:p-0 print:bg-white">
      {/* Top action bar (hidden during print) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between print:hidden bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-sm">Chế độ xem trước In ấn / Xuất PDF</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Ngay / Lưu PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main A4 Paper Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 sm:p-12 text-slate-900 print:shadow-none print:p-0 print:m-0 print:max-w-full print:rounded-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-blue-700 uppercase">
              BIÊN BẢN KỸ THUẬT HIỆN TRƯỜNG • AVIXA STANDARDS
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
              Phiếu Khảo Sát Kỹ Thuật Lắp Đặt Phòng Họp
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tài liệu đánh giá hiện trạng hạ tầng âm thanh, hình ảnh & hội nghị truyền hình
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div className="font-mono font-bold text-slate-900">MÃ: SRV-{new Date().getFullYear()}-{metadata.id.slice(0, 6).toUpperCase()}</div>
            <div>Ngày: {metadata.surveyDate || new Date().toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        {/* Client & Project Information Box */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs mb-6">
          <div className="space-y-1.5">
            <div>
              <span className="font-bold text-slate-600">Khách hàng / Đơn vị:</span>{' '}
              <span className="font-bold text-slate-900 text-sm">
                {metadata.customerName || '...................................................'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Tên phòng họp:</span>{' '}
              <span className="font-semibold text-blue-800">
                {metadata.roomName || '...................................................'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Địa chỉ công trình:</span>{' '}
              <span>{metadata.address || '...................................................'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Người liên hệ khách hàng:</span>{' '}
              <span>
                {metadata.contactPerson ? `${metadata.contactPerson} (${metadata.contactPhone})` : '...................................................'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 border-l border-slate-200 pl-4">
            <div>
              <span className="font-bold text-slate-600">Kỹ sư khảo sát:</span>{' '}
              <span className="font-bold text-slate-900">
                {metadata.surveyorName || '...................................................'}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Số điện thoại kỹ sư:</span>{' '}
              <span>{metadata.surveyorPhone || '...................................................'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Dự toán ngân sách:</span>{' '}
              <span>{metadata.estimatedBudget || 'Theo đề xuất thiết kế'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-600">Dự án:</span>{' '}
              <span>{metadata.projectName || 'Lắp đặt phòng họp'}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Spatial & Calculation Summary */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <span>I. KẾT QUẢ TÍNH TOÁN & KHUYẾN NGHỊ KỸ THUẬT CỐT LÕI</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-slate-500 font-medium">Diện tích / Thể tích</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {calculations.roomArea > 0 ? `${calculations.roomArea} m²` : '--'} / {calculations.roomVolume > 0 ? `${calculations.roomVolume} m³` : '--'}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-slate-500 font-medium">Kích cỡ TV chuẩn</div>
              <div className="text-sm font-bold text-blue-700 mt-0.5">
                {calculations.recommendedScreenInches}" (Tối thiểu {calculations.minScreenInches}")
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-slate-500 font-medium">Loại Camera</div>
              <div className="font-semibold text-slate-800 mt-0.5 leading-tight text-[11px]">
                {calculations.cameraTypeRecommendation}
              </div>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <div className="text-slate-500 font-medium">Hệ thống Micro</div>
              <div className="font-semibold text-slate-800 mt-0.5 leading-tight text-[11px]">
                {calculations.micRecommendation}
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(calculations.acousticIssues.length > 0 || calculations.cableIssues.length > 0) && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Cảnh báo kỹ thuật cần lưu ý khi thi công:</span>
              </div>
              <ul className="list-disc list-inside text-amber-800 space-y-0.5 pl-1">
                {calculations.acousticIssues.map((issue, idx) => (
                  <li key={`ac-${idx}`}>{issue}</li>
                ))}
                {calculations.cableIssues.map((issue, idx) => (
                  <li key={`cb-${idx}`}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section 2: Detailed Questions Checklist */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3">
            II. CHI TIẾT CÁC HẠNG MỤC KHẢO SÁT HIỆN TRƯỜNG
          </h2>

          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className="text-xs">
                <div className="font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded mb-2">
                  {category.title}
                </div>
                <table className="w-full text-left border-collapse mb-3">
                  <thead>
                    <tr className="border-b border-slate-300 text-[11px] font-bold text-slate-600">
                      <th className="py-1 w-16">Mã</th>
                      <th className="py-1 w-2/5">Nội dung khảo sát</th>
                      <th className="py-1">Hiện trạng ghi nhận</th>
                      <th className="py-1 w-1/4">Ghi chú hiện trường</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {category.questions.map(q => {
                      const ans = answers[q.id];
                      let valStr = '---';
                      if (ans?.value !== undefined && ans.value !== '') {
                        if (Array.isArray(ans.value)) {
                          valStr = ans.value.join('; ');
                        } else if (typeof ans.value === 'boolean') {
                          valStr = ans.value ? 'Có' : 'Không';
                        } else {
                          valStr = `${ans.value}${q.unit ? ' ' + q.unit : ''}`;
                        }
                      }
                      return (
                        <tr key={q.id} className="text-[11px]">
                          <td className="py-1.5 font-mono text-slate-500 font-semibold">{q.code}</td>
                          <td className="py-1.5 font-medium text-slate-800 pr-2">
                            {q.title}
                            {q.critical && <span className="text-rose-600 ml-1 font-bold">*</span>}
                          </td>
                          <td className="py-1.5 text-slate-900 font-semibold pr-2">{valStr}</td>
                          <td className="py-1.5 text-slate-600 italic">{ans?.notes || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Recommended BoQ */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1.5 mb-3">
            III. ĐỀ XUẤT CẤU HÌNH THIẾT BỊ PHÙ HỢP (BOQ DRAFT)
          </h2>
          <table className="w-full text-xs text-left border border-slate-300 border-collapse">
            <thead className="bg-slate-100">
              <tr className="border-b border-slate-300 font-bold text-slate-700">
                <th className="p-2 w-8 text-center">STT</th>
                <th className="p-2 w-28">Phân loại</th>
                <th className="p-2">Tên thiết bị đề xuất</th>
                <th className="p-2">Đặc tính kỹ thuật chính</th>
                <th className="p-2 w-12 text-center">SL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {calculations.recommendedBoq.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="p-2 font-semibold text-slate-700">{item.category}</td>
                  <td className="p-2 font-bold text-slate-900">{item.item}</td>
                  <td className="p-2 text-slate-600">{item.specs}</td>
                  <td className="p-2 text-center font-bold text-slate-800">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures Box */}
        <div className="grid grid-cols-2 gap-8 text-xs pt-8 border-t-2 border-slate-900 text-center">
          <div>
            <div className="font-bold uppercase text-slate-900 mb-1">
              ĐẠI DIỆN KHÁCH HÀNG
            </div>
            <div className="text-slate-500 italic mb-16">
              (Ký, ghi rõ họ tên và đóng dấu nếu có)
            </div>
            <div className="font-bold text-slate-800">
              {metadata.contactPerson || '...................................................'}
            </div>
          </div>

          <div>
            <div className="font-bold uppercase text-slate-900 mb-1">
              KỸ SƯ KHẢO SÁT HỆ THỐNG AV
            </div>
            <div className="text-slate-500 italic mb-16">
              (Ký và ghi rõ họ tên)
            </div>
            <div className="font-bold text-slate-800">
              {metadata.surveyorName || '...................................................'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
