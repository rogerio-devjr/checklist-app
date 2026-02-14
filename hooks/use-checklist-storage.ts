import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistItem, ChecklistFormData } from '@/types/checklist';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'checklists';

export function useChecklistStorage() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChecklists = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setChecklists(JSON.parse(data));
      }
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveChecklist = useCallback(async (formData: ChecklistFormData) => {
    try {
      const newChecklist: ChecklistItem = {
        id: uuidv4(),
        date: formData.date,
        items: {
          processadorNumber: formData.processadorNumber,
          estruturaFisica: formData.estruturaFisica,
          placasR19: formData.placasR19,
          placasEducativas: formData.placasEducativas,
          camerasLargaAmpla: formData.camerasLargaAmpla,
          sensorDoppler: formData.sensorDoppler,
          reparoManutencao: formData.reparoManutencao,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedChecklists = [newChecklist, ...checklists];
      const jsonData = JSON.stringify(updatedChecklists);
      
      await AsyncStorage.setItem(STORAGE_KEY, jsonData);
      setChecklists(updatedChecklists);
      return newChecklist;
    } catch (error) {
      console.error('Erro ao salvar checklist:', error);
      throw error;
    }
  }, [checklists]);

  const updateChecklist = useCallback(async (id: string, formData: ChecklistFormData) => {
    try {
      const updatedChecklists = checklists.map((item) =>
        item.id === id
          ? {
              ...item,
              date: formData.date,
              items: {
                processadorNumber: formData.processadorNumber,
                estruturaFisica: formData.estruturaFisica,
                placasR19: formData.placasR19,
                placasEducativas: formData.placasEducativas,
                camerasLargaAmpla: formData.camerasLargaAmpla,
                sensorDoppler: formData.sensorDoppler,
                reparoManutencao: formData.reparoManutencao,
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChecklists));
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
      throw error;
    }
  }, [checklists]);

  const deleteChecklist = useCallback(async (id: string) => {
    try {
      const updatedChecklists = checklists.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChecklists));
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error('Erro ao deletar checklist:', error);
      throw error;
    }
  }, [checklists]);

  const getChecklistById = useCallback((id: string) => {
    return checklists.find((item) => item.id === id);
  }, [checklists]);

  const getChecklistsByPeriod = useCallback((startDate: Date, endDate: Date) => {
    return checklists.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [checklists]);

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  return {
    checklists,
    isLoading,
    saveChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    getChecklistsByPeriod,
    loadChecklists,
  };
}
