export type QuestionType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'radio';

export interface SurveyQuestion {
  id: string;
  categoryId: string;
  code: string; // e.g. "DIM-01", "ACO-02"
  title: string;
  description: string;
  type: QuestionType;
  options?: string[];
  unit?: string;
  placeholder?: string;
  critical?: boolean; // Quan trọng, bắt buộc kiểm tra
  avTip?: string; // Lời khuyên kỹ thuật chuyên sâu (AV Pro Tip)
  defaultChecked?: boolean;
}

export interface QuestionAnswer {
  questionId: string;
  value: string | number | boolean | string[];
  notes?: string;
  isCompleted?: boolean;
  photoNotes?: string;
}

export interface SurveyCategory {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  iconName: string;
  questions: SurveyQuestion[];
}

export interface ProjectMetadata {
  id: string;
  customerName: string;
  projectName: string;
  roomName: string;
  roomType: 'huddle' | 'medium' | 'boardroom' | 'auditorium' | 'custom';
  address: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  surveyorName: string;
  surveyorPhone: string;
  surveyDate: string;
  targetDate: string;
  estimatedBudget: string;
  generalNotes: string;
  updatedAt: string;
}

export interface AvTechnicalCalculations {
  roomArea: number;
  roomVolume: number;
  minScreenInches: number;
  recommendedScreenInches: number;
  cameraTypeRecommendation: string;
  micRecommendation: string;
  acousticRiskLevel: 'low' | 'medium' | 'high';
  acousticIssues: string[];
  cableIssues: string[];
  powerNetworkIssues: string[];
  recommendedBoq: {
    category: string;
    item: string;
    specs: string;
    quantity: number;
  }[];
}

export interface SurveyPreset {
  id: string;
  name: string;
  roomType: ProjectMetadata['roomType'];
  description: string;
  capacity: string;
  defaultAnswers: Record<string, Partial<QuestionAnswer>>;
}
