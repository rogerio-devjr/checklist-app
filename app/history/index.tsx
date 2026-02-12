import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChecklistStorage } from "@/hooks/use-checklist-storage";
import { useRouter } from "expo-router";
import { ChecklistItem } from "@/types/checklist";
import { MaterialIcons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import { useState, useMemo } from "react";

export default function HistoryScreen() {
  const router = useRouter();
  const colors = useColors();
  const { checklists } = useChecklistStorage();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const filteredAndSortedChecklists = useMemo(() => {
    let filtered = checklists;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.date.includes(searchText) ||
        item.items.estruturaFisica.toLowerCase().includes(searchText.toLowerCase()) ||
        item.items.reparoManutencao.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [checklists, searchText, sortOrder]);

  const handleChecklistPress = (id: string) => {
    // Navegação para detalhes será implementada
    alert("Detalhes do checklist: " + id);
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
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">
            {formatDate(item.date)}
          </Text>
          <Text className="text-sm text-muted mt-2 line-clamp-2">
            {item.items.estruturaFisica || "Sem informações"}
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
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground flex-1">Histórico</Text>
          </View>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="search" size={20} color={colors.muted} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 10,
                color: colors.foreground,
              }}
              placeholder="Buscar checklist..."
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Sort Options */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setSortOrder("recent")}
              style={{
                flex: 1,
                backgroundColor: sortOrder === "recent" ? colors.primary : colors.surface,
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
                  sortOrder === "recent" ? "text-white" : "text-foreground"
                }`}
              >
                Recentes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortOrder("oldest")}
              style={{
                flex: 1,
                backgroundColor: sortOrder === "oldest" ? colors.primary : colors.surface,
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
                  sortOrder === "oldest" ? "text-white" : "text-foreground"
                }`}
              >
                Antigos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Checklists List */}
          <View className="gap-3">
            {filteredAndSortedChecklists.length === 0 ? (
              <View className="bg-surface rounded-lg p-8 items-center gap-3">
                <MaterialIcons name="inbox" size={40} color={colors.muted} />
                <Text className="text-muted text-center">
                  {searchText ? "Nenhum resultado encontrado" : "Nenhum checklist no histórico"}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredAndSortedChecklists}
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
