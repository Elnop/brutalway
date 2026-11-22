import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';
import { designSystemPrimitives } from '@brutalway/oxlint-config-react-native/designSystemPrimitives';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [
    reactNativeConfig,
    designSystemPrimitives({ components: ['Pressable', 'Text'], files: ['src/shared/theme/**'] }),
  ],
});
