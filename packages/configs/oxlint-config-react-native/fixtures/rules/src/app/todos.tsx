import { StyleSheet, Text, View } from 'react-native';
import { format } from '../shared/format';

const styles = StyleSheet.create({ title: { color: '#000', padding: 12 } });

// a comment
export default function TodosScreen(props: any) {
  const a = props.x ? (props.y ? 1 : 2) : 3;
  console.log(a, format);
  const items = [3, 1, 2].toSorted();
  return (
    <View style={{ flex: 1 }}>
      raw
      <Text style={styles.title}>{items.join()}</Text>
    </View>
  );
}
