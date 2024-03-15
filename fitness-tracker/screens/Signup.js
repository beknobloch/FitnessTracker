import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, Alert, DatePic } from "react-native";
import { Button } from "react-native-elements";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

function Signup(props){
    // variables
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [birthday, setBirthday] = useState(new Date())

    // database collection
    const userCollectionRef = collection(db, "users")

    //async function that creates an account for the user
    const createAccount = async () => {
        try {
            //after account is created, the user is automatically signed in
            await createUserWithEmailAndPassword(auth, email, password)
            addUser()
            Alert.alert("Account created! Redirecting to home page...", undefined, [
                {
                    text: "Let's get started!",
                    onPress: () => {
                        //this code runs after closing the alert box 
                        props.navigation.popToTop();
                        props.navigation.replace('Home');
                    }
                }
            ]);
            
            //resets variables
            setEmail("")
            setPassword("")
            setBirthday("00/00/0000")
            setName("")
        } catch (error) {
            console.log(error)
            Alert.alert("Incorrect username or password")
        } 
    }

    //adds user's name, birthday, and id (created by firebase authenticator) to database
    const addUser = async () => {
        try {
            // adds info to database
            await addDoc(userCollectionRef, {
                name: name, 
                uid: auth?.currentUser?.uid, // since the user is already logged in at this point, we can get their id
                birthday: birthday.toLocaleDateString('en-US', { // converts date to MM/DD/YYYY format 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
            })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Name" 
                    onChangeText={setName}
                    value={name}
                />

                <View style={styles.rowBox}>
                    <Text style={styles.text}>Date of birth: </Text>
                    <DateTimePicker
                        value={birthday}
                        mode='date'
                        onChange={(event, selectedDate) => {
                            setBirthday(selectedDate)
                        }}
                    />
                </View>

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
                <Button title="Create account" onPress={createAccount} />
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
    },
    rowBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20
    },
    text: {
        fontSize: 20
    }
  });
export default Signup;