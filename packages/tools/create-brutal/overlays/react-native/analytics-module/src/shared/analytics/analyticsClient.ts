import { DeviceEventEmitter } from 'react-native';

export const analyticsClient = {
  track(name: string, properties: Record<string, string | number | boolean> = {}): void {
    DeviceEventEmitter.emit('analytics', { name, properties });
  },
};
