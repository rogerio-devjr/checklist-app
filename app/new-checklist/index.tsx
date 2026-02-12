import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChecklistStorage } from "@/hooks/use-checklist-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ChecklistFormData } from "@/types/checklist";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NewChecklistScreen() {
  const router = useRouter();
  const colors = useColors();
  const { saveChecklist } = useChecklistStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState<ChecklistFormData>({
    date: new Date().toISOString().split("T")[0],
    estruturaFisica: "",
    placasR19: "",
    placasEducativas: "",
    camerasLargaAmpla: "",
    sensorDoppler: "",
    reparoManutencao: "",
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData({
        ...formData,
        date: selectedDate.toISOString().split("T")[0],
      });
    }
    setShowDatePicker(false);
  };

  const handleInputChange = (field: keyof ChecklistFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    if (!formData.date) {
      Alert.alert("Erro", "Por favor, selecione uma data");
      return false;
    }
    if (
      !formData.estruturaFisica ||
      !formData.placasR19 ||
      !formData.placasEducativas ||
      !formData.camerasLargaAmpla ||
      !formData.sensorDoppler ||
      !formData.reparoManutencao
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await saveChecklist(formData);
      Alert.alert("Sucesso", "Checklist salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar checklist. Tente novamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderFormField = (
    label: string,
    field: keyof ChecklistFormData,
    placeholder: string
  ) => (
    <View className="gap-2 mb-4">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        style={{
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          color: colors.foreground,
          backgroundColor: colors.surface,
          minHeight: 100,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
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
            <Text className="text-2xl font-bold text-foreground flex-1">Novo Checklist</Text>
          </View>

          {/* Date Field */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Data</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: colors.surface,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              activeOpacity={0.7}
            >
              <Text className="text-base text-foreground">{formatDate(formData.date)}</Text>
              <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(formData.date)}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}

          {/* Form Fields */}
          {renderFormField(
            "Estrutura Física do Equipamento",
            "estruturaFisica",
            "Descreva o estado da estrutura física..."
          )}

          {renderFormField("Placas R19", "placasR19", "Descreva o estado das placas R19...")}

          {renderFormField(
            "Placas Educativas",
            "placasEducativas",
            "Descreva o estado das placas educativas..."
          )}

          {renderFormField(
            "Câmeras de faixa e ampla",
            "camerasLargaAmpla",
            "Descreva o estado das câmeras..."
          )}

          {renderFormField(
            "Sensor Doppler",
            "sensorDoppler",
            "Descreva o estado do sensor Doppler..."
          )}

          {renderFormField(
            "Especifique o que foi realizado de reparo e manutenção",
            "reparoManutencao",
            "Descreva os reparos e manutenções realizados..."
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flex: 1,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text className="text-foreground font-semibold">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
