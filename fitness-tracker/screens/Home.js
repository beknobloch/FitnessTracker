import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ExampleQuery from '../components/ExampleQuery';
import { Button } from 'react-native-elements';

function Home(props) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Remove the ExampleQuery JSX tag below when real project starts */}
      <ExampleQuery />
      <Button title='Go to sample screen' onPress={() => props.navigation.navigate('SampleScreen')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;