# Checklist de Equipamentos - Documentação

## Visão Geral

O **Checklist de Equipamentos** é um aplicativo móvel desenvolvido em React Native com Expo que permite inspeção, documentação e análise de equipamentos técnicos. O aplicativo oferece funcionalidades completas de checklist, armazenamento local de dados, geração de relatórios e exportação de informações.

## Funcionalidades Principais

### 1. Gerenciamento de Checklists

O aplicativo permite criar, visualizar, editar e deletar checklists de equipamentos. Cada checklist contém os seguintes campos:

- **Data**: Data da inspeção (selecionável via calendário)
- **Estrutura Física do Equipamento**: Descrição do estado da estrutura
- **Placas R19**: Avaliação das placas R19
- **Placas Educativas**: Avaliação das placas educativas
- **Câmeras de faixa e ampla**: Status das câmeras
- **Sensor Doppler**: Status do sensor Doppler
- **Reparos e Manutenção**: Descrição dos reparos realizados

### 2. Telas Principais

#### Tela Home
- Exibe lista de checklists recentes
- Botão para criar novo checklist
- Atalhos para Relatórios e Histórico
- Visualização rápida do status dos checklists

#### Novo Checklist
- Formulário completo com todos os campos
- Seletor de data integrado
- Validação de campos obrigatórios
- Salvamento automático com timestamp

#### Detalhes do Checklist
- Visualização completa dos dados do checklist
- Opção de editar (em desenvolvimento)
- Opção de deletar com confirmação
- Botão de exportação para PDF

#### Histórico
- Lista completa de todos os checklists
- Busca por data ou conteúdo
- Ordenação por recentes ou antigos
- Acesso rápido a qualquer checklist

#### Relatórios
- Visualização de estatísticas mensais e anuais
- Gráficos de problemas por equipamento
- Contagem total de checklists e problemas
- Exportação de relatórios em PDF

### 3. Armazenamento de Dados

O aplicativo utiliza **AsyncStorage** para armazenamento local seguro dos dados. Todos os checklists são salvos localmente no dispositivo, permitindo:

- Acesso offline aos dados
- Sincronização automática
- Backup local dos checklists
- Sem necessidade de conexão com internet para operações básicas

### 4. Exportação de Dados

#### Exportação de Checklist
- Compartilhamento de informações do checklist
- Formato compatível com múltiplos aplicativos
- Preservação de toda a informação

#### Exportação de Relatórios
- Geração de relatórios em formato HTML
- Gráficos visuais de problemas técnicos
- Resumo estatístico do período
- Compatível com impressão e PDF

## Fluxos de Usuário

### Fluxo 1: Criar Novo Checklist
1. Toque em "Novo Checklist" na tela Home
2. Selecione a data da inspeção
3. Preencha todos os campos com informações da inspeção
4. Toque em "Salvar"
5. Checklist é salvo e aparece na lista

### Fluxo 2: Visualizar e Exportar Checklist
1. Selecione um checklist da lista (Home ou Histórico)
2. Visualize todos os detalhes
3. Toque em "Exportar PDF" para compartilhar
4. Escolha o aplicativo para compartilhamento

### Fluxo 3: Gerar Relatório
1. Acesse "Relatórios" na tela Home
2. Selecione período (Mensal ou Anual)
3. Visualize gráficos de problemas técnicos
4. Toque em "Exportar Relatório PDF" para compartilhar

## Estrutura de Dados

### Checklist Item
```typescript
{
  id: string;              // UUID único
  date: string;            // Data ISO 8601
  items: {
    estruturaFisica: string;
    placasR19: string;
    placasEducativas: string;
    camerasLargaAmpla: string;
    sensorDoppler: string;
    reparoManutencao: string;
  };
  createdAt: string;       // Timestamp de criação
  updatedAt: string;       // Timestamp de atualização
}
```

### Report Data
```typescript
{
  period: 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  totalChecklists: number;
  problemsByType: Record<string, number>;
  trends: Array<{date: string, count: number}>;
}
```

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento e distribuição
- **TypeScript**: Tipagem estática
- **AsyncStorage**: Armazenamento local
- **NativeWind**: Tailwind CSS para React Native
- **Expo Router**: Navegação entre telas
- **React Query**: Gerenciamento de estado e cache

## Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou pnpm
- Expo CLI (opcional, mas recomendado)

### Instalação
```bash
cd checklist-app
pnpm install
```

### Desenvolvimento
```bash
pnpm dev
```

### Build para Android
```bash
pnpm android
```

### Build para iOS
```bash
pnpm ios
```

## Guia de Uso

### Criando um Checklist
1. Na tela Home, toque no botão "Novo Checklist"
2. A data atual será pré-selecionada (pode ser alterada)
3. Preencha cada campo com as informações da inspeção
4. Toque em "Salvar" para registrar o checklist

### Visualizando Histórico
1. Na tela Home, toque em "Histórico"
2. Use a barra de busca para encontrar checklists específicos
3. Use os botões "Recentes" e "Antigos" para ordenar
4. Toque em um checklist para visualizar detalhes completos

### Gerando Relatórios
1. Na tela Home, toque em "Relatórios"
2. Selecione o período desejado (Mensal ou Anual)
3. Visualize os gráficos de problemas técnicos
4. Toque em "Exportar Relatório PDF" para compartilhar

### Exportando Dados
1. Após criar ou visualizar um checklist, toque em "Exportar PDF"
2. Escolha o aplicativo para compartilhamento (Email, WhatsApp, etc.)
3. Os dados serão compartilhados no formato selecionado

## Recursos Futuros

- Edição de checklists existentes
- Sincronização com servidor backend
- Autenticação de usuários
- Múltiplos usuários e equipes
- Anexos de fotos aos checklists
- Notificações de acompanhamento
- Integração com calendário
- Exportação para Excel
- Análise avançada de tendências

## Suporte e Feedback

Para relatar problemas, sugestões ou feedback sobre o aplicativo, entre em contato através dos canais de suporte disponíveis.

## Versão

**Versão Atual**: 1.0.0  
**Data de Lançamento**: 11 de Fevereiro de 2026

## Licença

Este aplicativo é fornecido conforme está, para uso pessoal e profissional.

---

**Desenvolvido com ❤️ usando React Native e Expo**
