import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import LaunchPage from "../LaunchPage";
import styles from "./styles";

const RegisterPage = ({goBack}) => {

    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [tel, setTel] = useState(null)
    const [password, setPassword] = useState(null)
    const [confPassword, setConfPassword] = useState(null)

    return(
        <KeyboardAvoidingView style={styles.mainView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable style={styles.form} onPress={() => Keyboard.dismiss()}>
                <Text style={styles.formText}>Nome:</Text>
                <TextInput style={styles.formInput} placeholder="Nome" onChangeText={setName} value={name}/>
                <Text style={styles.formText}>E-mail:</Text>
                <TextInput style={styles.formInput} placeholder="Ex: nome@provedor.com.br" onChangeText={setEmail} value={email}/>
                <Text style={styles.formText}>Telefone:</Text>
                <TextInput style={styles.formInput} placeholder="Ex 31999999999" onChangeText={setTel} value={tel} keyboardType="numeric"/>
                <Text style={styles.formText}>Senha:</Text>
                <TextInput style={styles.formInput} placeholder="Senha" onChangeText={setPassword} value={password}/>
                <Text style={styles.formText}>Confirmar Senha:</Text>
                <TextInput style={styles.formInput} placeholder="Confirme sua senha" onChangeText={setConfPassword} value={confPassword}/>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </Pressable>
        </KeyboardAvoidingView>
    )
}

export default RegisterPage

