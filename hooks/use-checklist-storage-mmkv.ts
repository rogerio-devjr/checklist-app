import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistItem, ChecklistFormData } from '@/types/checklist';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'checklists';
let storage: any = null;

try {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV();
} catch (error) {
  console.warn('MMKV não disponível neste dispositivo:', error);
}

/**
 * Hook melhorado para armazenamento de checklists com suporte a MMKV e AsyncStorage
 * MMKV é mais rápido e confiável em dispositivos Android
 */
export function useChecklistStorage() {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMMKV, setUseMMKV] = useState(true);

  const loadChecklists = useCallback(async () => {
    try {
      setIsLoading(true);
      let data: string | null = null;

      // Tentar carregar de MMKV primeiro (mais rápido e confiável)
      try {
        if (storage) {
          const mmkvData = storage.getString(STORAGE_KEY);
          if (mmkvData) {
            data = mmkvData;
            setUseMMKV(true);
          }
        }
      } catch (mmkvError) {
        console.warn('MMKV não disponível, usando AsyncStorage:', mmkvError);
        setUseMMKV(false);
      }

      // Se MMKV falhar, tentar AsyncStorage
      if (!data) {
        try {
          data = await AsyncStorage.getItem(STORAGE_KEY);
          if (data) {
            setUseMMKV(false);
          }
        } catch (asyncError) {
          console.error('Erro ao carregar de AsyncStorage:', asyncError);
        }
      }

      if (data) {
        try {
          const parsed = JSON.parse(data);
          setChecklists(parsed);
        } catch (parseError) {
          console.error('Erro ao fazer parse dos dados:', parseError);
          setChecklists([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
      setChecklists([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveChecklist = useCallback(
    async (formData: ChecklistFormData) => {
      try {
        const newChecklist: ChecklistItem = {
          id: uuidv4(),
          date: formData.date,
          nomeTecnico: formData.nomeTecnico,
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

        let saved = false;

        // Tentar salvar em MMKV primeiro
        if (useMMKV && storage) {
          try {
            storage.set(STORAGE_KEY, jsonData);
            saved = true;
            console.log('Checklist salvo com sucesso em MMKV');
          } catch (mmkvError) {
            console.warn('Erro ao salvar em MMKV, tentando AsyncStorage:', mmkvError);
          }
        }

        // Se MMKV falhar ou não estiver disponível, usar AsyncStorage
        if (!saved) {
          try {
            await AsyncStorage.setItem(STORAGE_KEY, jsonData);
            setUseMMKV(false);
            saved = true;
            console.log('Checklist salvo com sucesso em AsyncStorage');
          } catch (asyncError) {
            console.error('Erro ao salvar em AsyncStorage:', asyncError);
            throw new Error('Falha ao salvar checklist. Tente novamente.');
          }
        }

        if (saved) {
          setChecklists(updatedChecklists);
          return newChecklist;
        }

        throw new Error('Falha ao salvar checklist em ambos os armazenamentos');
      } catch (error) {
        console.error('Erro ao salvar checklist:', error);
        throw error;
      }
    },
    [checklists, useMMKV]
  );

  const updateChecklist = useCallback(
    async (id: string, formData: ChecklistFormData) => {
      try {
        const updatedChecklists = checklists.map((item) =>
          item.id === id
            ? {
                ...item,
                date: formData.date,
                nomeTecnico: formData.nomeTecnico,
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

        const jsonData = JSON.stringify(updatedChecklists);
        let updated = false;

        // Tentar atualizar em MMKV
        if (useMMKV && storage) {
          try {
            storage.set(STORAGE_KEY, jsonData);
            updated = true;
          } catch (mmkvError) {
            console.warn('Erro ao atualizar em MMKV:', mmkvError);
          }
        }

        // Se MMKV falhar, usar AsyncStorage
        if (!updated) {
          try {
            await AsyncStorage.setItem(STORAGE_KEY, jsonData);
            setUseMMKV(false);
            updated = true;
          } catch (asyncError) {
            console.error('Erro ao atualizar em AsyncStorage:', asyncError);
            throw new Error('Falha ao atualizar checklist');
          }
        }

        if (updated) {
          setChecklists(updatedChecklists);
        }
      } catch (error) {
        console.error('Erro ao atualizar checklist:', error);
        throw error;
      }
    },
    [checklists, useMMKV]
  );

  const deleteChecklist = useCallback(
    async (id: string) => {
      try {
        const updatedChecklists = checklists.filter((item) => item.id !== id);
        const jsonData = JSON.stringify(updatedChecklists);
        let deleted = false;

        // Tentar deletar em MMKV
        if (useMMKV && storage) {
          try {
            storage.set(STORAGE_KEY, jsonData);
            deleted = true;
          } catch (mmkvError) {
            console.warn('Erro ao deletar em MMKV:', mmkvError);
          }
        }

        // Se MMKV falhar, usar AsyncStorage
        if (!deleted) {
          try {
            await AsyncStorage.setItem(STORAGE_KEY, jsonData);
            setUseMMKV(false);
            deleted = true;
          } catch (asyncError) {
            console.error('Erro ao deletar em AsyncStorage:', asyncError);
            throw new Error('Falha ao deletar checklist');
          }
        }

        if (deleted) {
          setChecklists(updatedChecklists);
        }
      } catch (error) {
        console.error('Erro ao deletar checklist:', error);
        throw error;
      }
    },
    [checklists, useMMKV]
  );

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
