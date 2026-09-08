import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Tv,
  Camera,
  Mic,
  Cable,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { AvTechnicalCalculations } from '../types';

interface SmartAvAdvisoryProps {
  calculations: AvTechnicalCalculations;
  onOpenBoqModal?: () => void;
}

export const SmartAvAdvisory: React.FC<SmartAvAdvisoryProps> = ({ calculations }) => {
  const hasAcousticRisk = calculations.acousticIssues.length > 0;
  const hasCableRisk = calculations.cableIssues.length > 0;
  const hasPowerNetRisk = calculations.powerNetworkIssues.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm sm:text-base font-bold tracking-tight">
            Phân Tích Kỹ Thuật AV Tự Động
          </h2>
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
          Smart AI Advisor
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Spatial Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">
              Diện Tích Phòng
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {calculations.roomArea > 0 ? `${calculations.roomArea} m²` : '--'}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">
              Thể Tích Không Gian
            </span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {calculations.roomVolume > 0 ? `${calculations.roomVolume} m³` : '--'}
            </div>
          </div>
        </div>

        {/* Display Size Recommendation */}
        <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <Tv className="w-4 h-4 text-blue-600" />
            <span>Kích Thước Màn Hình Khuyến Nghị</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-700">
              {calculations.recommendedScreenInches > 0
                ? `${calculations.recommendedScreenInches}"`
                : '--'}
            </span>
            <span className="text-xs text-blue-600/80 font-medium">
              (Tối thiểu: {calculations.minScreenInches}")
            </span>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Dựa trên chuẩn quốc tế AVIXA DISCAS giúp người ngồi xa nhất đọc rõ biểu đồ Excel và văn bản nhỏ.
          </p>
        </div>

        {/* Camera Recommendation */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Camera className="w-4 h-4 text-slate-600" />
            <span>Khuyến Nghị Camera & Zoom</span>
          </div>
          <p className="text-xs font-semibold text-slate-900">
            {calculations.cameraTypeRecommendation}
          </p>
        </div>

        {/* Mic & Audio Recommendation */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Mic className="w-4 h-4 text-slate-600" />
            <span>Khuyến Nghị Micro & Loa</span>
          </div>
          <p className="text-xs font-semibold text-slate-900">
            {calculations.micRecommendation}
          </p>
        </div>

        {/* Warning Alerts Section */}
        {(hasAcousticRisk || hasCableRisk || hasPowerNetRisk) && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Cảnh Báo Kỹ Thuật Hiện Trường</span>
            </div>

            {calculations.acousticIssues.map((issue, idx) => (
              <div
                key={`ac-${idx}`}
                className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-snug"
              >
                <span className="font-bold text-amber-800">Âm học: </span>
                {issue}
              </div>
            ))}

            {calculations.cableIssues.map((issue, idx) => (
              <div
                key={`cb-${idx}`}
                className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-snug flex items-start gap-1.5"
              >
                <Cable className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-800">Cáp & Ống gen: </span>
                  {issue}
                </div>
              </div>
            ))}

            {calculations.powerNetworkIssues.map((issue, idx) => (
              <div
                key={`pn-${idx}`}
                className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 leading-snug"
              >
                <span className="font-bold text-slate-700">Điện & Mạng: </span>
                {issue}
              </div>
            ))}
          </div>
        )}

        {/* Bill of Quantities Preview */}
        <div className="pt-2 border-t border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Dự Toán Thiết Bị Sơ Bộ (BoQ)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {calculations.recommendedBoq.length} hạng mục
            </span>
          </div>

          <div className="space-y-1.5">
            {calculations.recommendedBoq.slice(0, 5).map((item, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-800">{item.item}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{item.specs}</div>
                </div>
                <span className="font-bold text-slate-700 shrink-0 bg-slate-200/60 px-2 py-0.5 rounded text-[11px]">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 italic text-center">
            * Bảng thiết bị đầy đủ sẽ xuất hiện chi tiết trong Phiếu Khảo Sát in ấn.
          </p>
        </div>
      </div>
    </div>
  );
};
