import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, TouchableOpacity, Keyboard, Platform } from "react-native";
import styles from "./styles";

const LoginPage = ({goBack}) => {

    const[email, setEmail] = useState(null)
    const[password, setPassword] = useState(null)

    return(
        <KeyboardAvoidingView style={styles.mainView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable style={styles.form} onPress={() => Keyboard.dismiss()}>
                <Text style={styles.formText}>E-mail:</Text>
                <TextInput style={styles.formInput} placeholder="Seu e-mail" onChangeText={setEmail} value={email}/>
                <Text style={styles.formText}>Senha:</Text>
                <TextInput style={styles.formInput} placeholder="Sua senha" onChangeText={setPassword} value={password}/>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </Pressable>
        </KeyboardAvoidingView>
    )
}

export default LoginPage