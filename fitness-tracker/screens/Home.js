import React, {useState, useEffect} from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { auth } from '../../../fitness-tracker (old)/config/firebase'
import SignOut from '../../../fitness-tracker (old)/components/SignOut';

// Home screen user can see after logging in or creating an account
function Home(props){
    //const userCollectionRef = collection(db, "users")
    const [loggedIn, setLoggedIn] = useState(false)

        //listens for if user signs in/out
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((state) => {
            setLoggedIn(state);
        }); 
        return () => unsubscribe();
    }, []);

    return(
        <View style={styles.container}>
            <Text>Home screen text!</Text>

            {/* This button can also be removed in future prototypes */}
            <Button title="Go back to starting page" onPress={() => props.navigation.navigate('Start')}/>

            {loggedIn ? (
              <Text>Logged in, hello {auth?.currentUser.email}</Text>
            ):(
              <Text>Not logged in</Text>
            )}
            <SignOut loggedIn={loggedIn} />
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