import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ExampleQuery from '../components/ExampleQuery';
import { Button } from 'react-native-elements';

function Start(props) {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/*Adding an image requires defining a source and definig its style*/}
      <Image source={require('../assets/StartPageIcon.png')} style={styles.image}resizeMode="cover" />
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
  image: {
    width: 300, // Set the width as needed
    height: 200, // Set the height as needed
    marginBottom: 20, // Adjust the margin as needed
},
  button: {
    paddingVertical: 5,
  }
});

export default Start;