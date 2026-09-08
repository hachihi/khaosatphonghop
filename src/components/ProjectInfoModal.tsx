import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, Calendar, DollarSign, FileText } from 'lucide-react';
import { ProjectMetadata } from '../types';

interface ProjectInfoModalProps {
  metadata: ProjectMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProjectMetadata) => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  metadata,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProjectMetadata>(metadata);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProjectMetadata, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Thông Tin Dự Án & Khách Hàng
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật thông tin nhận diện để in phiếu khảo sát và báo cáo kỹ thuật
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tên khách hàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Khách Hàng / Công Ty <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => handleChange('customerName', e.target.value)}
                  placeholder="Ví dụ: Công ty Cổ phần Tập đoàn ABC"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Tên phòng họp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Phòng Họp / Vị Trí <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={e => handleChange('roomName', e.target.value)}
                  placeholder="Ví dụ: Phòng Họp VIP Tầng 12"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Tên dự án */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Dự Án
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={e => handleChange('projectName', e.target.value)}
                placeholder="Ví dụ: Nâng cấp Hội nghị Truyền hình MTR 2026"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Địa chỉ công trình */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa Chỉ Khảo Sát
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="Ví dụ: Tòa nhà Keangnam, Mễ Trì, Nam Từ Liêm, HN"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Người liên hệ khách hàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người Đại Diện Khách Hàng
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={e => handleChange('contactPerson', e.target.value)}
                  placeholder="Họ và tên (IT Manager / Admin)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Số điện thoại khách hàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Điện Thoại Khách Hàng
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={e => handleChange('contactPhone', e.target.value)}
                  placeholder="0912.xxx.xxx"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Kỹ sư khảo sát */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kỹ Sư AV Khảo Sát <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.surveyorName}
                  onChange={e => handleChange('surveyorName', e.target.value)}
                  placeholder="Tên kỹ sư thực hiện"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* SĐT Kỹ sư */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số ĐT Kỹ Sư
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.surveyorPhone}
                  onChange={e => handleChange('surveyorPhone', e.target.value)}
                  placeholder="0988.xxx.xxx"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Ngày khảo sát */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày Khảo Sát
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={formData.surveyDate}
                  onChange={e => handleChange('surveyDate', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Dự toán ngân sách */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngân Sách Dự Kiến (VNĐ)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.estimatedBudget}
                  onChange={e => handleChange('estimatedBudget', e.target.value)}
                  placeholder="Ví dụ: 80.000.000 - 120.000.000 VNĐ"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú chung */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú Đặc Biệt Của Khách Hàng
            </label>
            <textarea
              rows={2}
              value={formData.generalNotes}
              onChange={e => handleChange('generalNotes', e.target.value)}
              placeholder="Ví dụ: Khách yêu cầu thi công vào thứ 7 và CN để không ảnh hưởng giờ làm việc. Cần giấu dây hoàn toàn không lộ trên mặt bàn..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
            >
              Lưu Thông Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
