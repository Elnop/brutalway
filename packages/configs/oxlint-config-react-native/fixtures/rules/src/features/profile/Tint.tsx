import { StyleSheet, Text } from 'react-native';

type TintProps = { tint?: string; icon: string; red: number };

export function Tint({ tint, icon, red }: TintProps) {
  const glyph = icon === 'snow' ? 'snow' : icon;
  const colors = [
    '#ffffff',
    `rgba(${red}, 2, 3, 0.5)`,
    'hsl(10, 20%, 30%)',
    tint ?? '#000',
    '#section',
  ];
  return (
    <Text accessibilityHint={glyph} selectionColor="tomato" style={styles.label}>
      {colors.join()}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', backgroundColor: 'transparent' },
});
