import { useState } from 'react';
import { View, StyleSheet, Dimensions, Button } from 'react-native';
import { Barcode } from 'react-native-svg-barcode';
import randomString from './Utils/randomString';

const lenght = 12;
const width = Dimensions.get('window').width / 2;

export default function App() {
  const [code, setCode] = useState(randomString(lenght));

  return (
    <View style={styles.container}>
      <Barcode format={'CODE128'} value={code} text={code} maxWidth={width} />
      <View style={styles.button}>
        <Button
          title={'Aleatorio'}
          onPress={() => setCode(randomString(lenght))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
  },
});
