import { QuestionAnswer, AvTechnicalCalculations } from '../types';

export function calculateAvParameters(
  answers: Record<string, Partial<QuestionAnswer>>
): AvTechnicalCalculations {
  const length = Number(answers['length_m']?.value) || 0;
  const width = Number(answers['width_m']?.value) || 0;
  const height = Number(answers['height_m']?.value) || 0;
  const furthest = Number(answers['furthest_viewer_m']?.value) || length * 0.85 || 0;
  const cableDist = Number(answers['cable_run_distance']?.value) || 0;

  const roomArea = length > 0 && width > 0 ? Number((length * width).toFixed(1)) : 0;
  const roomVolume = roomArea > 0 && height > 0 ? Number((roomArea * height).toFixed(1)) : 0;

  // AVIXA DISCAS standard (16:9 ratio display)
  // General text reading (6x rule): Screen Height = Furthest Distance / 6
  // Diagonal inches ≈ Height (m) * 80.4
  let minScreenInches = 55;
  let recommendedScreenInches = 65;

  if (furthest > 0) {
    const minHeightM = furthest / 6;
    const calcInches = Math.round(minHeightM * 80.4);
    
    // Snap to standard commercial sizes: 55, 65, 75, 85, 98, 110, 130
    if (calcInches <= 55) {
      minScreenInches = 55;
      recommendedScreenInches = 65;
    } else if (calcInches <= 65) {
      minScreenInches = 65;
      recommendedScreenInches = 75;
    } else if (calcInches <= 75) {
      minScreenInches = 75;
      recommendedScreenInches = 85;
    } else if (calcInches <= 85) {
      minScreenInches = 85;
      recommendedScreenInches = 98;
    } else {
      minScreenInches = 98;
      recommendedScreenInches = 135; // Dual display or LED Wall
    }
  }

  // Camera Recommendation
  let cameraTypeRecommendation = 'Camera ePTZ góc rộng (110° - 120°) tích hợp sẵn';
  if (length > 7.5 || furthest > 7) {
    cameraTypeRecommendation = 'Camera PTZ cơ học Zoom quang học 12x - 20x hoặc Hệ thống Dual Camera quang học';
  } else if (length > 4.5 || furthest > 4.5) {
    cameraTypeRecommendation = 'Camera PTZ Zoom quang 5x - 10x có tính năng Auto Framing & Speaker Tracking';
  }

  // Microphone Recommendation
  let micRecommendation = 'Micro mảng tích hợp trên thanh Video Bar (Bán kính thu ~ 4.5m)';
  const micType = answers['mic_architecture']?.value as string;
  if (micType?.includes('âm trần') || length > 8) {
    micRecommendation = 'Micro mảng âm trần (Ceiling Array Mic) chuyên dụng + Bộ xử lý tín hiệu DSP AEC';
  } else if (length > 5 || furthest > 5) {
    micRecommendation = 'Thanh Video Bar + 1 đến 2 Micro phụ để bàn (Expansion Mic Pods) kéo dài';
  }

  // Acoustic assessment
  const acousticIssues: string[] = [];
  const wallMaterials = (answers['wall_material']?.value as string[]) || [];
  const floorMaterial = (answers['floor_material']?.value as string) || '';
  const noiseItems = (answers['ambient_noise']?.value as string[]) || [];
  const echoTest = (answers['clap_echo_test']?.value as string) || '';

  if (wallMaterials.some(w => w.includes('2 mặt trở lên') || w.includes('nhiều kính'))) {
    acousticIssues.push('Phòng có từ 2 mặt vách kính cường lực trở lên: nguy cơ dội âm vang (Echo/Reverb) rất cao.');
  }
  if (floorMaterial.includes('gạch men') || floorMaterial.includes('Đá granite')) {
    acousticIssues.push('Sàn gạch men/đá hoa cương bóng không có thảm: độ phản xạ âm cao, làm đục giọng nói.');
  }
  if (noiseItems.some(n => n.includes('thổi trực diện') || n.includes('Họng gió'))) {
    acousticIssues.push('Cảnh báo họng gió điều hòa thổi mạnh gần micro: luồng gió đập vào màng mic gây tiếng ù gió khó chịu.');
  }
  if (echoTest.includes('đanh, kéo dài')) {
    acousticIssues.push('Kết quả Clap Test cho thấy thời gian dội âm RT60 lớn: bắt buộc cần micro có thuật toán khử vang AEC tốt.');
  }

  let acousticRiskLevel: 'low' | 'medium' | 'high' = 'low';
  if (acousticIssues.length >= 2) {
    acousticRiskLevel = 'high';
  } else if (acousticIssues.length === 1) {
    acousticRiskLevel = 'medium';
  }

  // Cable issues
  const cableIssues: string[] = [];
  if (cableDist > 7) {
    cableIssues.push(`Khoảng cách cáp ${cableDist}m vượt quá giới hạn cáp HDMI/USB thụ động (5m): Bắt buộc dùng Cáp quang chủ động (AOC) hoặc bộ HDBaseT.`);
  }
  const floorConduit = answers['floor_conduit']?.value as string;
  if (floorConduit?.includes('Chưa có') || floorConduit?.includes('nẹp sàn')) {
    cableIssues.push('Chưa có ống gen âm sàn: cần phối hợp đội nội thất cắt sàn hoặc dùng nẹp sàn nhôm chống vấp ngã.');
  }

  // Power & Network issues
  const powerNetworkIssues: string[] = [];
  const powerItems = (answers['power_infrastructure']?.value as string[]) || [];
  const netItems = (answers['network_internet']?.value as string[]) || [];

  if (!powerItems.some(p => p.includes('TIẾP ĐỊA') || p.includes('Earth Grounding'))) {
    powerNetworkIssues.push('Chưa xác nhận tiếp địa nguồn điện: thiết bị AV có thể bị rò điện nhẹ hoặc phát sinh tiếng ù hum 50Hz.');
  }
  if (!netItems.some(n => n.includes('dây mạng LAN Cat6'))) {
    powerNetworkIssues.push('Chưa sẵn sàng đầu chờ dây mạng LAN Cat6: dùng Wi-Fi sẽ gây hiện tượng rớt gói tin giật hình.');
  }
  if (netItems.some(n => n.includes('Firewall'))) {
    powerNetworkIssues.push('Mạng có tường lửa nội bộ: cần IT mở các cổng UDP/TCP cho Microsoft Teams/Zoom trước ngày nghiệm thu.');
  }

  // Recommended Bill of Quantities (BoQ) draft
  const recommendedBoq: AvTechnicalCalculations['recommendedBoq'] = [];

  // 1. Display
  const screenCount = (answers['screen_count']?.value as string) || '';
  const isDual = screenCount.includes('kép') || screenCount.includes('Dual');
  recommendedBoq.push({
    category: 'Hiển thị',
    item: `Màn hình Commercial Display ${recommendedScreenInches}" 4K`,
    specs: `Tấm nền IPS chống lóa 28%, hoạt động 16/7 - 24/7, cổng HDMI/LAN`,
    quantity: isDual ? 2 : 1,
  });

  // Giá treo
  const mountType = (answers['display_mounting']?.value as string) || '';
  recommendedBoq.push({
    category: 'Phụ kiện treo',
    item: mountType.includes('di động') ? 'Khung chân di động có bánh xe khóa tải trọng 80kg' : 'Giá treo tường nghiêng cơ học chịu lực VESA',
    specs: mountType.includes('di động') ? 'Hợp kim nhôm cao cấp, có khay để camera và codec' : 'Sắt sơn tĩnh điện chống rung',
    quantity: isDual ? 2 : 1,
  });

  // 2. Video Conference Core
  if (length <= 5) {
    recommendedBoq.push({
      category: 'Hội nghị truyền hình',
      item: 'All-in-one 4K Video Bar (Tích hợp Camera 120°, 6 Mic mảng, Loa Stereo)',
      specs: 'Hỗ trợ Teams/Zoom, AI Framing, kết nối USB cắm là chạy (BYOD)',
      quantity: 1,
    });
  } else if (length <= 8) {
    recommendedBoq.push({
      category: 'Hội nghị truyền hình',
      item: 'Hệ thống Video Conference Chuyên Dụng (Camera PTZ Zoom quang + Soundbar + Mic Pod)',
      specs: 'Zoom quang học 10x-15x, Speaker Tracking, mic mở rộng để bàn có nút Mute',
      quantity: 1,
    });
    recommendedBoq.push({
      category: 'Micro mở rộng',
      item: 'Micro Pod để bàn nối dài có đèn LED trạng thái',
      specs: 'Bán kính thu 4.5m/mic, chống ồn AI, nút Mute cảm ứng',
      quantity: 1,
    });
  } else {
    recommendedBoq.push({
      category: 'Hội nghị truyền hình',
      item: 'Camera PTZ 4K Zoom quang học 12x-20x chuẩn SDI/HDMI/USB/IP',
      specs: 'Chuyên dụng phòng hội đồng VIP, bám theo diễn giả tự động',
      quantity: 1,
    });
    recommendedBoq.push({
      category: 'Âm thanh chuyên nghiệp',
      item: 'Micro Mảng Âm Trần (Ceiling Array Microphone) + Bộ xử lý DSP AEC',
      specs: 'Thu âm đa hướng không lộ dây, triệt tiêu tiếng dội âm hoàn toàn',
      quantity: 1,
    });
    recommendedBoq.push({
      category: 'Hệ thống Loa',
      item: 'Hệ thống Loa Âm Trần Hi-Fi 2-way phân bổ đều',
      specs: 'Công suất 30W - 60W, góc phủ rộng 120°',
      quantity: 4,
    });
  }

  // 3. Controller
  const touchCtrl = (answers['touch_controller']?.value as string) || '';
  if (touchCtrl.includes('Bắt buộc') || length > 5) {
    recommendedBoq.push({
      category: 'Điều khiển',
      item: 'Màn hình cảm ứng điều khiển phòng họp 10.1" (Touch Controller)',
      specs: 'Độ phân giải Full HD, cấp nguồn qua dây mạng PoE, 1 chạm vào họp',
      quantity: 1,
    });
  }

  // 4. Cabling & Accessories
  if (cableDist > 5) {
    recommendedBoq.push({
      category: 'Cáp tín hiệu',
      item: `Cáp quang chủ động HDMI AOC 4K/60Hz (${Math.ceil(cableDist + 3)}m)`,
      specs: 'Lõi sợi thủy tinh quang học, không suy hao tín hiệu ở cự ly xa',
      quantity: 1,
    });
    recommendedBoq.push({
      category: 'Cáp tín hiệu',
      item: `Cáp quang chủ động USB 3.1 Type-C/A AOC (${Math.ceil(cableDist + 3)}m)`,
      specs: 'Truyền dữ liệu camera 10Gbps và tín hiệu điều khiển ổn định',
      quantity: 1,
    });
  } else {
    recommendedBoq.push({
      category: 'Cáp tín hiệu',
      item: 'Bộ cáp kết nối cao cấp HDMI 2.0 & USB 3.0 (3m - 5m)',
      specs: 'Chống nhiễu bọc giáp 3 lớp, đầu cắm mạ vàng 24k',
      quantity: 1,
    });
  }

  return {
    roomArea,
    roomVolume,
    minScreenInches,
    recommendedScreenInches,
    cameraTypeRecommendation,
    micRecommendation,
    acousticRiskLevel,
    acousticIssues,
    cableIssues,
    powerNetworkIssues,
    recommendedBoq,
  };
}

export function generateMarkdownSummary(
  metadata: {
    customerName: string;
    projectName: string;
    roomName: string;
    surveyDate: string;
    surveyorName: string;
  },
  answers: Record<string, Partial<QuestionAnswer>>,
  categories: { id: string; title: string; questions: { id: string; title: string; code: string; unit?: string }[] }[],
  calcs: AvTechnicalCalculations
): string {
  let md = `# BIÊN BẢN KHẢO SÁT HIỆN TRẠNG LẮP ĐẶT PHÒNG HỌP AV\n\n`;
  md += `**Khách hàng:** ${metadata.customerName || 'Chưa điền'}\n`;
  md += `**Dự án:** ${metadata.projectName || 'Chưa điền'}\n`;
  md += `**Tên phòng:** ${metadata.roomName || 'Chưa điền'}\n`;
  md += `**Kỹ sư khảo sát:** ${metadata.surveyorName || 'Chưa điền'}\n`;
  md += `**Ngày khảo sát:** ${metadata.surveyDate || new Date().toISOString().split('T')[0]}\n\n`;

  md += `## I. THÔNG SỐ KHÔNG GIAN & ĐỀ XUẤT KỸ THUẬT\n`;
  md += `- **Diện tích phòng:** ${calcs.roomArea} m² (Thể tích: ${calcs.roomVolume} m³)\n`;
  md += `- **Kích cỡ màn hình khuyến nghị:** ${calcs.recommendedScreenInches}" (Tối thiểu: ${calcs.minScreenInches}")\n`;
  md += `- **Khuyến nghị Camera:** ${calcs.cameraTypeRecommendation}\n`;
  md += `- **Khuyến nghị Micro & Loa:** ${calcs.micRecommendation}\n`;
  md += `- **Đánh giá rủi ro âm học:** ${calcs.acousticRiskLevel.toUpperCase()}\n\n`;

  if (calcs.acousticIssues.length > 0) {
    md += `### Cảnh báo Âm học:\n`;
    calcs.acousticIssues.forEach(i => (md += `- ⚠️ ${i}\n`));
    md += `\n`;
  }

  if (calcs.cableIssues.length > 0) {
    md += `### Cảnh báo Đường dây cáp:\n`;
    calcs.cableIssues.forEach(i => (md += `- 🔌 ${i}\n`));
    md += `\n`;
  }

  md += `## II. CHI TIẾT CÁC HẠNG MỤC KHẢO SÁT\n\n`;

  categories.forEach(cat => {
    md += `### ${cat.title}\n`;
    cat.questions.forEach(q => {
      const ans = answers[q.id];
      let valStr = 'Chưa khảo sát';
      if (ans && ans.value !== undefined && ans.value !== '') {
        if (Array.isArray(ans.value)) {
          valStr = ans.value.join(', ');
        } else if (typeof ans.value === 'boolean') {
          valStr = ans.value ? 'Có / Đúng' : 'Không / Chưa có';
        } else {
          valStr = `${ans.value}${q.unit ? ' ' + q.unit : ''}`;
        }
      }
      md += `- **[${q.code}] ${q.title}:** ${valStr}\n`;
      if (ans?.notes) {
        md += `  *Ghi chú thêm:* ${ans.notes}\n`;
      }
    });
    md += `\n`;
  });

  md += `## III. DỰ TOÁN SƠ BỘ THIẾT BỊ (BOQ DRAFT)\n\n`;
  md += `| Hạng mục | Tên thiết bị / Chủng loại | Thông số kỹ thuật | SL |\n`;
  md += `|---|---|---|:---:|\n`;
  calcs.recommendedBoq.forEach(b => {
    md += `| ${b.category} | ${b.item} | ${b.specs} | ${b.quantity} |\n`;
  });

  md += `\n---\n*Biên bản được lập tự động từ Hệ thống Khảo sát Kỹ thuật Phòng họp AV.*`;
  return md;
}
