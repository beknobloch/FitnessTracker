import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function SignOut(){

    //async function that signs out user
    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        } 
    }

    return(
        <Button title="Sign out" disabled={!auth?.currentUser} onPress={logout} disabledStyle={styles.buttonDisabled}/>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    }
  });
export default SignOut