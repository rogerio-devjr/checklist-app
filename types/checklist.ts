/**
 * Tipos para o aplicativo de Checklist de Equipamentos
 */

export interface ChecklistItem {
  id: string;
  date: string; // ISO 8601 format
  nomeTecnico: string;
  items: {
    processadorNumber: string;
    estruturaFisica: string;
    placasR19: string;
    placasEducativas: string;
    camerasLargaAmpla: string;
    sensorDoppler: string;
    reparoManutencao: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistFormData {
  date: string;
  nomeTecnico: string;
  processadorNumber: string;
  estruturaFisica: string;
  placasR19: 'conforme' | 'nao-conforme';
  placasEducativas: 'conforme' | 'nao-conforme';
  camerasLargaAmpla: 'conforme' | 'nao-conforme';
  sensorDoppler: 'conforme' | 'nao-conforme';
  reparoManutencao: string;
}

export interface ReportData {
  period: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  totalChecklists: number;
  problemsByType: Record<string, number>;
  trends: Array<{
    date: string;
    count: number;
  }>;
}

export interface ProblemSummary {
  type: string;
  count: number;
  percentage: number;
}
