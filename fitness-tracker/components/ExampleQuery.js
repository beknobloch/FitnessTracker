import React, { useState, useEffect }from "react";
import { StyleSheet, Text, View} from 'react-native';
import { db } from "../config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { Button } from "react-native-elements";

//this component shows how to query and display data in firebase
function ExampleQuery(){
    //variables
    const [testList, setTestList] = useState([]) //contents of database as array of json objects
    const [userCollectionRef, setUserCollectionRef] = useState(collection(db, "test")) //raw contents of database collection "test"
    
    //gets list of documents from database in a format that js can read
    const getDocList = async () =>{
        try {
            const data = await getDocs(userCollectionRef)
            //console.log(data) // raw data that's unformatted and not usable yet

            //formats the data as an array containing json objects with each object representing a document on firebase
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            //console.log(filteredData) // array of json objects
            setTestList(filteredData)
        } catch (error) {
            console.log(error)
        }
    }

    //fetches from the database for new data, may not be necessary for project
    const updateDb = async() => {
        setUserCollectionRef(collection(db, "test"))
    }

    /* useEffect lets you rerun code when something else changes
    In this case, when userCollectionRef changes, getDocList() is called 
    */
    useEffect(() => {
        getDocList()
    }, [userCollectionRef]) 

    return(
        <View>
            <Text>{'\n'}This component fetches data from collection "test" in firebase and displays the result </Text>
            <Text>{'`n'}Remove this in future prototypes</Text>
            <Button title="Press me!" onPress={updateDb}/>
            
            {/* Needs to check if testList has anything
            If it doesn't, that means the fetch from the database isn't complete and we can't display the list yet    
            */}
            {testList.length > 0 ? (
                //iterates through testList to display each document and all of its fields
                testList.map((item, i) => (
                    <View key={'item_' + i}>
                        <Text>Item #{i+1}</Text>

                        {//This iterates through each field to display them all
                        Object.keys(item).map((key, index) => (
                            <Text key={index}>{key}: {item[key]}</Text>
                        ))}
                        <Text>{'\n'}</Text>
                    </View>
                ))
            ) : (
                <Text>Loading...</Text>
            )}

        </View>
    )
}

export default ExampleQuery;