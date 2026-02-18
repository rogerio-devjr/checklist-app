import { useEffect, useState } from 'react';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

/**
 * Hook para solicitar permissões de armazenamento no Android
 * Solicita permissões automaticamente ao montar o componente
 */
export function useStoragePermissions() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        setIsLoading(true);

        // Apenas solicitar permissões no Android
        if (Platform.OS === 'android') {
          // Solicitar permissões de mídia e armazenamento
          const { status } = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY
          );
          
          setPermissionStatus(status);
          
          if (status !== 'granted') {
            console.warn('Permissão de armazenamento não concedida:', status);
          } else {
            console.log('Permissão de armazenamento concedida com sucesso');
          }
        } else {
          // iOS não requer permissões especiais para AsyncStorage
          setPermissionStatus('granted');
        }
      } catch (error) {
        console.error('Erro ao solicitar permissões:', error);
        setPermissionStatus('undetermined');
      } finally {
        setIsLoading(false);
      }
    };

    requestPermissions();
  }, []);

  return {
    permissionStatus,
    isLoading,
    isGranted: permissionStatus === 'granted',
  };
}
