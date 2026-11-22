import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveProfile(value: string): Promise<void> {
  await AsyncStorage.setItem('profile', value);
}
