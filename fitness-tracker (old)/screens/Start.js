import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ExampleQuery from '../../../fitness-tracker (old)/components/ExampleQuery';
import { Button } from 'react-native-elements';

function Start(props) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Welcome to our Fitness Tracker!</Text>
      <Button style={styles.button} title='Log in' onPress={() => props.navigation.navigate('Login')}/>
      <Button style={styles.button} title='Sign up' onPress={() => props.navigation.navigate('Signup')}/>

      {/* Remove the ExampleQuery and Button JSX tag below when real project starts */}
      <ExampleQuery />
      <Button title='Skip login' onPress={() => props.navigation.navigate('Home')}/>
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
  button: {
    paddingVertical: 5,
  }
});

export default Start;