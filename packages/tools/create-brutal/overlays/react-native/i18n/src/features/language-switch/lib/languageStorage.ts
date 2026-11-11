import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'language';

export async function savedLanguage(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY);
}

export function saveLanguage(language: string): void {
  void AsyncStorage.setItem(STORAGE_KEY, language);
}
