import AsyncStorage from '@react-native-async-storage/async-storage';

describe('feedStorage', () => {
  it('starts empty', async () => {
    await AsyncStorage.clear();
    expect(await AsyncStorage.getItem('feed')).toBeNull();
  });
});
