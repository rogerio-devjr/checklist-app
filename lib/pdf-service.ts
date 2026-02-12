import { ChecklistItem } from '@/types/checklist';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/**
 * Serviço para gerar PDFs de checklists
 * Usa expo-file-system para salvar e expo-sharing para compartilhar
 */

export async function generateChecklistPDF(checklist: ChecklistItem): Promise<void> {
  try {
    // Criar conteúdo HTML do checklist
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Checklist - ${new Date(checklist.date).toLocaleDateString('pt-BR')}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2E7D32;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          color: #2E7D32;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section-title {
          background-color: #2E7D32;
          color: white;
          padding: 10px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .section-content {
          background-color: #f5f5f5;
          padding: 15px;
          border-left: 4px solid #2E7D32;
          min-height: 80px;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Checklist de Equipamentos</h1>
        <p>Data: ${new Date(checklist.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>

      <div class="section">
        <div class="section-title">Numero do Processador</div>
        <div class="section-content">${checklist.items.processadorNumber || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Estrutura Física do Equipamento</div>
        <div class="section-content">${checklist.items.estruturaFisica || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Placas R19</div>
        <div class="section-content">${checklist.items.placasR19 || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Placas Educativas</div>
        <div class="section-content">${checklist.items.placasEducativas || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Câmeras de faixa e ampla</div>
        <div class="section-content">${checklist.items.camerasLargaAmpla || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Sensor Doppler</div>
        <div class="section-content">${checklist.items.sensorDoppler || 'Não preenchido'}</div>
      </div>

      <div class="section">
        <div class="section-title">Reparos e Manutencao</div>
        <div class="section-content">${checklist.items.reparoManutencao || 'Nao preenchido'}</div>
      </div>

      ${checklist.items.assinaturaTecnico ? `
      <div class="section">
        <div class="section-title">Assinatura do Tecnico</div>
        <div class="section-content">
          <img src="${checklist.items.assinaturaTecnico}" style="max-width: 200px; max-height: 100px;" />
        </div>
      </div>
      ` : ''}

      <div class="footer">
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Checklist de Equipamentos v1.0</p>
      </div>
    </body>
    </html>
    `;

    // Salvar arquivo HTML como PDF
    const fileName = `Checklist_${new Date(checklist.date).toISOString().split('T')[0]}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/html',
        dialogTitle: 'Compartilhar Checklist',
      });
    }
  } catch (error) {
    console.error('Erro ao gerar PDF do checklist:', error);
    throw error;
  }
}

export async function generateReportPDF(
  period: 'monthly' | 'annual',
  totalChecklists: number,
  problemsByType: Record<string, number>,
  startDate: string,
  endDate: string
): Promise<void> {
  try {
    const totalProblems = Object.values(problemsByType).reduce((a, b) => a + b, 0);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Equipamentos</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2E7D32;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          color: #2E7D32;
        }
        .period-info {
          background-color: #f5f5f5;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #2E7D32;
        }
        .period-info p {
          margin: 5px 0;
        }
        .summary {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          flex: 1;
          background-color: #f5f5f5;
          padding: 15px;
          border-left: 4px solid #2E7D32;
          text-align: center;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }
        .summary-card .number {
          font-size: 32px;
          font-weight: bold;
          color: #2E7D32;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          background-color: #2E7D32;
          color: white;
          padding: 10px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th {
          background-color: #2E7D32;
          color: white;
          padding: 10px;
          text-align: left;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .bar-chart {
          margin-bottom: 20px;
        }
        .bar-item {
          margin-bottom: 15px;
        }
        .bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 14px;
        }
        .bar-container {
          background-color: #e0e0e0;
          height: 20px;
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          background-color: #2E7D32;
          height: 100%;
          transition: width 0.3s ease;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Equipamentos</h1>
        <p>Período: ${period === 'monthly' ? 'Mensal' : 'Anual'}</p>
      </div>

      <div class="period-info">
        <p><strong>Período:</strong> ${startDate} a ${endDate}</p>
        <p><strong>Tipo:</strong> ${period === 'monthly' ? 'Relatório Mensal' : 'Relatório Anual'}</p>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>Total de Checklists</h3>
          <div class="number">${totalChecklists}</div>
        </div>
        <div class="summary-card">
          <h3>Total de Problemas</h3>
          <div class="number">${totalProblems}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Problemas por Equipamento</div>
        <div class="bar-chart">
          ${Object.entries(problemsByType)
            .map(([label, count]) => {
              const percentage = totalProblems > 0 ? (count / totalProblems) * 100 : 0;
              return `
                <div class="bar-item">
                  <div class="bar-label">
                    <span>${label}</span>
                    <span>${count}</span>
                  </div>
                  <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="footer">
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Checklist de Equipamentos v1.0</p>
      </div>
    </body>
    </html>
    `;

    // Salvar arquivo HTML como PDF
    const fileName = `Relatorio_${period}_${new Date().toISOString().split('T')[0]}.html`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(filePath, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/html',
        dialogTitle: 'Compartilhar Relatório',
      });
    }
  } catch (error) {
    console.error('Erro ao gerar PDF do relatório:', error);
    throw error;
  }
}
