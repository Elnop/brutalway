import { ActionSheetIOS, StyleSheet, Text, View } from 'react-native';

type AvatarProps = { name: string };

export function Avatar({ name }: AvatarProps) {
  ActionSheetIOS.dismissActionSheet();
  return (
    <View style={[styles.avatar]}>
      <Text style={{ marginTop: 4 }}>{name}</Text>
      <Text style={[styles.name, { opacity: 0.5 }]}>{name}</Text>
      Hello
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    marginTop: -4,
    color: '#ff0000',
    backgroundColor: `rgb(0, 0, 0)`,
    fontFamily: 'Inter',
    boxShadow: '2px 2px 0 black',
  },
  name: { fontSize: 14 },
  unused: { flex: 1 },
});
