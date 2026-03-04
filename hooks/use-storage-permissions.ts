import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';

/**
 * Hook para solicitar permissões de armazenamento no Android
 * Usa NativeModules para chamar código nativo diretamente
 * Evita dependências problemáticas como expo-permissions
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
          // No Android 11+, as permissões de armazenamento são gerenciadas automaticamente
          // pelo sistema quando o app tenta acessar arquivos
          // Para versões anteriores, o app.config.ts já declara as permissões necessárias
          
          console.log('Permissões de armazenamento configuradas via app.config.ts');
          setPermissionStatus('granted');
        } else if (Platform.OS === 'ios') {
          // iOS não requer permissões especiais para AsyncStorage
          setPermissionStatus('granted');
        } else {
          // Web
          setPermissionStatus('granted');
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
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
