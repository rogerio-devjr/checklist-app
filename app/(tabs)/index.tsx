import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChecklistStorage } from "@/hooks/use-checklist-storage";
import { useRouter } from "expo-router";
import { ChecklistItem } from "@/types/checklist";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { checklists, isLoading } = useChecklistStorage();

  const handleNewChecklist = () => {
    router.push("/new-checklist");
  };

  const handleChecklistPress = (id: string) => {
    // Navegação para detalhes será implementada com Link
    router.navigate({
      pathname: "/(tabs)",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => (
    <TouchableOpacity
      onPress={() => handleChecklistPress(item.id)}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">
            Checklist - {formatDate(item.date)}
          </Text>
          <Text className="text-sm text-muted mt-2">
            {item.items.estruturaFisica ? "Estrutura Física preenchida" : "Incompleto"}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Checklists</Text>
            <Text className="text-base text-muted">
              Gerencie suas inspeções de equipamentos
            </Text>
          </View>

          {/* New Checklist Button */}
          <TouchableOpacity
            onPress={handleNewChecklist}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={24} color="white" />
            <Text className="text-white font-semibold text-lg">Novo Checklist</Text>
          </TouchableOpacity>

          {/* Quick Actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/reports")}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: "center",
                gap: 8,
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="bar-chart" size={20} color={colors.primary} />
              <Text className="text-sm font-semibold text-foreground">Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/history")}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                alignItems: "center",
                gap: 8,
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="history" size={20} color={colors.primary} />
              <Text className="text-sm font-semibold text-foreground">Histórico</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Checklists */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Recentes</Text>
            {isLoading ? (
              <Text className="text-muted text-center py-8">Carregando...</Text>
            ) : checklists.length === 0 ? (
              <View className="bg-surface rounded-lg p-8 items-center gap-3">
                <MaterialIcons name="inbox" size={40} color={colors.muted} />
                <Text className="text-muted text-center">Nenhum checklist criado ainda</Text>
                <Text className="text-sm text-muted text-center">
                  Toque em "Novo Checklist" para começar
                </Text>
              </View>
            ) : (
              <FlatList
                data={checklists.slice(0, 5)}
                renderItem={renderChecklistItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
