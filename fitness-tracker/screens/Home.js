import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { auth } from '../config/firebase'
import SignOut from '../components/SignOut';

// This is a sample screen only to show how stack screen navigation works. Remove this in later versions of the project 
function Home(props){
    const userCollectionRef = collection(db, "users")
    
    return(
        <View style={styles.container}>
            <Text>Home screen text!</Text>
            <Button title="Go back to starting page" onPress={() => props.navigation.navigate('Start')}/>

            {auth?.currentUser ? (
              <Text>Logged in, hello {}</Text>
            ):(
              <Text>Not logged in</Text>
            )}
            <SignOut />
        </View>
    )
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