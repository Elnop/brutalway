import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';
import { colorFiles } from '@brutalway/oxlint-config-react-native/colorFiles';
import { designSystemPrimitives } from '@brutalway/oxlint-config-react-native/designSystemPrimitives';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [
    reactNativeConfig,
    designSystemPrimitives({ components: ['Pressable', 'Text', 'TextInput'], files: ['src/shared/theme/**'] }),
    colorFiles(['src/shared/palette/**']),
  ],
});
