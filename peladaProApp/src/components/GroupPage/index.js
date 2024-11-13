import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./styles";
import { supabase } from "../../lib/supabase";
import CreateGroup from '../CreateGroup'

export default function GroupPage(){

    const [pesquisaGrupo, setPesquisaGrupo] = useState(null)
    const [paginaCriarGrupo, setPaginaCriarGrupo] = useState(null)

    function handleCriarGrupo(){
        setPaginaCriarGrupo('criar')
    }

    function goBack(){
        setPaginaCriarGrupo(null)
    }

    if(paginaCriarGrupo === 'criar'){
        return(
            <CreateGroup goBack={goBack}/>
        )
    }

    return(
        <View style={styles.mainView}>
            <View style={styles.search}>
                <Text style={styles.text}>Pesquisar Grupos:</Text>
                <TextInput placeholder='Nome do grupo:' style={styles.searchBar} onChange={setPesquisaGrupo} value={pesquisaGrupo}/>
            </View>
            <View style={styles.viewButton}>
                <TouchableOpacity onPress={handleCriarGrupo} style={styles.button}>
                    <Text style={styles.textButton}>Criar Grupo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}