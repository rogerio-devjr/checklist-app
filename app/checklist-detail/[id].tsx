import { ScrollView, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChecklistStorage } from "@/hooks/use-checklist-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { generateChecklistPDF } from "@/lib/pdf-service";

export default function ChecklistDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getChecklistById, deleteChecklist } = useChecklistStorage();

  const checklist = id ? getChecklistById(id) : null;

  const handleExportPDF = async () => {
    if (!checklist) return;
    try {
      await generateChecklistPDF(checklist);
      Alert.alert('Sucesso', 'Checklist exportado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar checklist');
    }
  };

  if (!checklist) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text className="text-lg font-semibold text-foreground mt-4">Checklist não encontrado</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginTop: 16,
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    Alert.alert("Confirmar exclusão", "Deseja realmente deletar este checklist?", [
      { text: "Cancelar", onPress: () => {}, style: "cancel" },
      {
        text: "Deletar",
        onPress: async () => {
          try {
            await deleteChecklist(checklist.id);
            Alert.alert("Sucesso", "Checklist deletado com sucesso!", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
          } catch (error) {
            Alert.alert("Erro", "Falha ao deletar checklist");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusField = (label: string, value: string) => {
    const isConforme = value === 'conforme';
    return (
      <View className="mb-6">
        <Text className="text-sm font-semibold text-muted mb-2">{label}</Text>
        <View
          style={{
            backgroundColor: isConforme ? colors.success : colors.error,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
          }}
        >
          <Text className="text-base font-semibold text-white">
            {isConforme ? 'Conforme' : 'Nao Conforme'}
          </Text>
        </View>
      </View>
    );
  };

  const renderField = (label: string, value: string) => (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-muted mb-2">{label}</Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          minHeight: 80,
        }}
      >
        <Text className="text-base text-foreground leading-relaxed">{value || "Não preenchido"}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground flex-1">Detalhes</Text>
          </View>

          {/* Date and Tecnico Info */}
          <View className="gap-4">
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text className="text-sm text-muted">Data da inspeção</Text>
              <Text className="text-lg font-semibold text-foreground mt-1">
                {formatDate(checklist.date)}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
              }}
            >
              <Text className="text-sm text-muted">Técnico Responsável</Text>
              <Text className="text-lg font-semibold text-foreground mt-1">
                {checklist.nomeTecnico}
              </Text>
            </View>
          </View>

          {/* Numero do Processador */}
          {renderField("Numero do Processador", checklist.items.processadorNumber)}

          {/* Form Fields */}
          {renderField("Estrutura Fisica do Equipamento", checklist.items.estruturaFisica)}
          {renderStatusField("Placas R19", checklist.items.placasR19)}
          {renderStatusField("Placas Educativas", checklist.items.placasEducativas)}
          {renderStatusField("Cameras de faixa e ampla", checklist.items.camerasLargaAmpla)}
          {renderStatusField("Sensor Doppler", checklist.items.sensorDoppler)}
          {renderField(
            "Reparos e Manutencao",
            checklist.items.reparoManutencao
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={() => Alert.alert("Em desenvolvimento", "Edição em breve")}
              style={{
                flex: 1,
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
              <MaterialIcons name="edit" size={20} color="white" />
              <Text className="text-white font-semibold">Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={{
                flex: 1,
                backgroundColor: colors.error,
                borderRadius: 8,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="delete" size={20} color="white" />
              <Text className="text-white font-semibold">Deletar</Text>
            </TouchableOpacity>
          </View>

          {/* Export Button */}
          <TouchableOpacity
            onPress={() => handleExportPDF()}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="file-download" size={20} color={colors.primary} />
            <Text className="text-primary font-semibold">Exportar PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
