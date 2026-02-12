import { ScrollView, Text, View, TouchableOpacity, Dimensions, Share, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChecklistStorage } from "@/hooks/use-checklist-storage";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useState, useMemo } from "react";
import { generateReportPDF } from "@/lib/pdf-service";

const { width } = Dimensions.get("window");

export default function ReportsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { checklists } = useChecklistStorage();
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");

  const handleExportReport = async () => {
    try {
      const htmlContent = await generateReportPDF(
        period,
        reportData.totalChecklists,
        reportData.problemsByType,
        reportData.startDate,
        reportData.endDate
      );
      await Share.share({
        message: `Relatório de ${period === 'monthly' ? 'Equipamentos - Mês' : 'Equipamentos - Ano'}`,
        title: 'Exportar Relatório',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar relatório');
    }
  };

  const reportData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    const periodChecklists = checklists.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Contar problemas por tipo de equipamento
    const problemsByType: Record<string, number> = {
      "Estrutura Física": 0,
      "Placas R19": 0,
      "Placas Educativas": 0,
      "Câmeras": 0,
      "Sensor Doppler": 0,
      "Reparos": 0,
    };

    periodChecklists.forEach((checklist) => {
      if (checklist.items.estruturaFisica && checklist.items.estruturaFisica.length > 10)
        problemsByType["Estrutura Física"]++;
      if (checklist.items.placasR19 && checklist.items.placasR19.length > 10)
        problemsByType["Placas R19"]++;
      if (checklist.items.placasEducativas && checklist.items.placasEducativas.length > 10)
        problemsByType["Placas Educativas"]++;
      if (checklist.items.camerasLargaAmpla && checklist.items.camerasLargaAmpla.length > 10)
        problemsByType["Câmeras"]++;
      if (checklist.items.sensorDoppler && checklist.items.sensorDoppler.length > 10)
        problemsByType["Sensor Doppler"]++;
      if (checklist.items.reparoManutencao && checklist.items.reparoManutencao.length > 10)
        problemsByType["Reparos"]++;
    });

    return {
      totalChecklists: periodChecklists.length,
      problemsByType,
      startDate: startDate.toLocaleDateString("pt-BR"),
      endDate: endDate.toLocaleDateString("pt-BR"),
    };
  }, [checklists, period]);

  const totalProblems = Object.values(reportData.problemsByType).reduce((a, b) => a + b, 0);

  const renderProblemBar = (label: string, count: number) => {
    const percentage = totalProblems > 0 ? (count / totalProblems) * 100 : 0;
    return (
      <View key={label} className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-foreground">{label}</Text>
          <Text className="text-sm text-muted">{count}</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 4,
            height: 8,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: colors.primary,
              height: "100%",
              width: `${percentage}%`,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground flex-1">Relatórios</Text>
          </View>

          {/* Period Selector */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setPeriod("monthly")}
              style={{
                flex: 1,
                backgroundColor: period === "monthly" ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`font-semibold ${
                  period === "monthly" ? "text-white" : "text-foreground"
                }`}
              >
                Mensal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPeriod("annual")}
              style={{
                flex: 1,
                backgroundColor: period === "annual" ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 10,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`font-semibold ${
                  period === "annual" ? "text-white" : "text-foreground"
                }`}
              >
                Anual
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Text className="text-sm text-muted">Período</Text>
            <Text className="text-base font-semibold text-foreground mt-1">
              {reportData.startDate} a {reportData.endDate}
            </Text>
          </View>

          {/* Summary Cards */}
          <View className="flex-row gap-3">
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                alignItems: "center",
              }}
            >
              <MaterialIcons name="checklist" size={24} color={colors.primary} />
              <Text className="text-2xl font-bold text-foreground mt-2">
                {reportData.totalChecklists}
              </Text>
              <Text className="text-xs text-muted mt-1">Checklists</Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                alignItems: "center",
              }}
            >
              <MaterialIcons name="warning" size={24} color={colors.warning} />
              <Text className="text-2xl font-bold text-foreground mt-2">
                {totalProblems}
              </Text>
              <Text className="text-xs text-muted mt-1">Problemas</Text>
            </View>
          </View>

          {/* Problems Chart */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text className="text-lg font-semibold text-foreground mb-4">
              Problemas por Equipamento
            </Text>

            {totalProblems === 0 ? (
              <View className="items-center py-8">
                <MaterialIcons name="inbox" size={32} color={colors.muted} />
                <Text className="text-muted text-center mt-2">
                  Nenhum problema registrado neste período
                </Text>
              </View>
            ) : (
              Object.entries(reportData.problemsByType).map(([label, count]) =>
                renderProblemBar(label, count)
              )
            )}
          </View>

          {/* Export Button */}
          <TouchableOpacity
            onPress={() => handleExportReport()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="file-download" size={20} color="white" />
            <Text className="text-white font-semibold">Exportar Relatório PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
