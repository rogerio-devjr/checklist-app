# Design do Aplicativo Checklist de Equipamentos

## Visão Geral

Aplicativo móvel para inspeção e manutenção de equipamentos técnicos, permitindo preenchimento de checklists, exportação em PDF e geração de relatórios com análise de problemas.

## Screens

### 1. Home Screen (Tela Principal)
- **Conteúdo Principal:**
  - Botão "Novo Checklist" (destaque)
  - Lista de checklists recentes com data e status
  - Atalhos para "Relatórios" e "Histórico"
- **Funcionalidade:**
  - Visualizar últimos checklists preenchidos
  - Acessar novo formulário de checklist
  - Navegar para relatórios

### 2. Novo Checklist Screen
- **Conteúdo Principal:**
  - Campo de data (seletor de data)
  - Campos de texto para cada item:
    - Estrutura Física do Equipamento
    - Placas R19
    - Placas Educativas
    - Câmeras de faixa e ampla
    - Sensor Doppler
    - Especifique o que foi realizado de reparo e manutenção
  - Botões "Cancelar" e "Salvar"
- **Funcionalidade:**
  - Preencher informações de inspeção
  - Validar campos obrigatórios
  - Salvar checklist com timestamp

### 3. Detalhes do Checklist Screen
- **Conteúdo Principal:**
  - Exibição de todos os campos preenchidos
  - Data e hora da inspeção
  - Botão "Exportar PDF"
  - Botão "Editar"
  - Botão "Deletar"
- **Funcionalidade:**
  - Visualizar checklist completo
  - Exportar para PDF
  - Editar informações
  - Remover checklist

### 4. Relatórios Screen
- **Conteúdo Principal:**
  - Seletor de período (Mensal/Anual)
  - Gráfico de problemas técnicos (por tipo de equipamento)
  - Tabela resumida de ocorrências
  - Filtros por tipo de problema
- **Funcionalidade:**
  - Visualizar estatísticas de problemas
  - Gerar gráficos de tendências
  - Exportar relatório em PDF
  - Filtrar por período e tipo

### 5. Histórico Screen
- **Conteúdo Principal:**
  - Lista de todos os checklists com filtros
  - Busca por data
  - Ordenação por data (recente/antigo)
- **Funcionalidade:**
  - Visualizar histórico completo
  - Buscar checklists específicos
  - Acessar detalhes de qualquer checklist

## Fluxos Principais

### Fluxo 1: Criar Novo Checklist
1. Usuário toca "Novo Checklist" na Home
2. Abre formulário com data atual pré-preenchida
3. Preenche os 6 campos de inspeção
4. Toca "Salvar"
5. Retorna à Home com novo checklist na lista

### Fluxo 2: Visualizar e Exportar Checklist
1. Usuário seleciona checklist da lista
2. Abre tela de detalhes
3. Toca "Exportar PDF"
4. PDF é gerado e salvo/compartilhado
5. Retorna à tela de detalhes

### Fluxo 3: Gerar Relatório
1. Usuário acessa "Relatórios"
2. Seleciona período (Mensal ou Anual)
3. Sistema analisa todos os checklists do período
4. Exibe gráficos de problemas técnicos
5. Usuário pode exportar relatório em PDF

## Cores e Branding

- **Cor Primária:** Verde (#2E7D32) - Representa saúde/funcionamento
- **Cor Secundária:** Laranja (#F57C00) - Representa aviso/manutenção
- **Cor de Erro:** Vermelho (#D32F2F) - Representa problema crítico
- **Background:** Branco/Cinza claro
- **Texto Principal:** Cinza escuro (#212121)

## Estrutura de Dados

### Checklist
```
{
  id: string (UUID)
  date: Date
  items: {
    estruturaFisica: string
    placasR19: string
    placasEducativas: string
    camerasLargaAmpla: string
    sensorDoppler: string
    reparoManutencao: string
  }
  createdAt: Date
  updatedAt: Date
}
```

### Relatório
```
{
  period: "monthly" | "annual"
  startDate: Date
  endDate: Date
  totalChecklists: number
  problemsByType: {
    [equipmentType]: number
  }
  trends: Array<{date: Date, count: number}>
}
```
