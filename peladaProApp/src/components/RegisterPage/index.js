import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, Keyboard, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import styles from "./styles";
import { supabase } from '../../lib/supabase';

const RegisterPage = ({ goBack }) => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [tel, setTel] = useState(null);
    const [password, setPassword] = useState(null);
    const [confPassword, setConfPassword] = useState(null);
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        if (password !== confPassword) {
            Alert.alert('As senhas não coincidem. Tente novamente.');
            return;
        }
    
        setLoading(true);
    
        const phoneStr = tel ? tel.toString() : '';
    
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name,
                    phone: phoneStr,
                },
            },
        });
    
        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }
    
        // Alerta de sucesso do cadastro
        Alert.alert('Usuário cadastrado com sucesso!');
    
        // Atualizando o metadata após o cadastro
        if (user) {
            try {
                const { error: metadataError } = await supabase.auth.updateUser({
                    data: {
                        display_name: name, // Nome do usuário
                        phone: phoneStr,     // Telefone do usuário
                    }
                });
    
                if (metadataError) {
                    console.error('Erro ao atualizar o metadata do usuário:', metadataError.message);
                    Alert.alert('Erro ao atualizar os dados. Tente novamente.');
                } else {
                    console.log('Metadata do usuário atualizado com sucesso!');
                }
            } catch (error) {
                console.error('Erro ao atualizar os dados do usuário:', error.message);
                Alert.alert('Erro inesperado ao tentar atualizar os dados do usuário.');
            }
        }
    
        setLoading(false);
        goBack();
    }

    return (
        <KeyboardAvoidingView style={styles.mainView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable style={styles.form} onPress={() => Keyboard.dismiss()}>
                <Text style={styles.formText}>Nome:</Text>
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Nome" 
                    onChangeText={setName} 
                    value={name}
                />
                <Text style={styles.formText}>E-mail:</Text>
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Ex: nome@provedor.com.br" 
                    onChangeText={setEmail} 
                    value={email}
                />
                <Text style={styles.formText}>Telefone:</Text>
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Ex: 31999999999" 
                    onChangeText={setTel} 
                    value={tel} 
                    keyboardType="numeric"
                />
                <Text style={styles.formText}>Senha:</Text>
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Senha" 
                    onChangeText={setPassword} 
                    value={password} 
                    secureTextEntry
                />
                <Text style={styles.formText}>Confirmar Senha:</Text>
                <TextInput 
                    style={styles.formInput} 
                    placeholder="Confirme sua senha" 
                    onChangeText={setConfPassword} 
                    value={confPassword} 
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

export default RegisterPage;