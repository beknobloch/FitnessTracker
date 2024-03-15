import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Button } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'

function Login(props){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //async function that signs in user
    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("")
            setPassword("")

            /*This resets the entire stack and brings the user inside the app
            This prevents being able to go back to the login or start page after being logged in
            */
            props.navigation.popToTop();
            props.navigation.replace('Home')
            
        } catch (error) {
            console.log(error)
            Alert.alert("Incorrect username or password")
        } 
    }
    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Password" 

                    // bug: when secureTextEntry is true, screen shakes when typing in email text input
                    secureTextEntry={false}
                    onChangeText={setPassword}
                    value={password}
                />
                <Button title="Log in" onPress={logIn} />
        </KeyboardAvoidingView>
    )
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
    },
    input: {
        height: 40, 
        width: 200, 
        borderColor: 'black',
        borderWidth: 1, 
        marginBottom: 20, 
        padding: 5,
    }
  });
export default Login;