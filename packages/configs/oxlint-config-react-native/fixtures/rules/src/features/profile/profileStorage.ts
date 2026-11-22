import AsyncStorage from '@react-native-async-storage/async-storage';

export const profileStorage = {
  read: async (): Promise<string | null> => AsyncStorage.getItem('profile'),
};
