import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

// This is a sample screen only to show how stack screen navigation works. Remove this in later versions of the project 
function SampleScreen(props){
    return(
        <View style={styles.container}>
            <Text>Sample screen text!</Text>
            <Button title="Go to home" onPress={() => props.navigation.navigate('Home')}/>
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
export default SampleScreen;