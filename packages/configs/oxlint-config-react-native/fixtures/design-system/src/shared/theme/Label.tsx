import { Text } from 'react-native';

type LabelProps = { text: string };

export function Label({ text }: LabelProps) {
  return <Text>{text}</Text>;
}
