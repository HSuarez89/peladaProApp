import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./styles";

export default function GroupPage(){
    return(
        <View style={styles.mainView}>
            <View style={styles.search}>
                <Text style={styles.text}>Pesquisar Grupos:</Text>
                <TextInput placeholder='Nome do grupo:' style={styles.searchBar}/>
            </View>
            <View style={styles.myGroups}>
                <Text style={styles.text}>Meus Grupos</Text>
                <View style={styles.groups}>
                </View>
            </View>
        </View>
    )
}