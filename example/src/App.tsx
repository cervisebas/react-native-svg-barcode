import { View, StyleSheet, Dimensions } from 'react-native';
import { Barcode } from 'react-native-svg-barcode';

const value = 'Hello World';
const width = Dimensions.get('window').width / 2;

export default function App() {
  return (
    <View style={styles.container}>
      <Barcode format={'CODE128'} value={value} text={value} maxWidth={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
