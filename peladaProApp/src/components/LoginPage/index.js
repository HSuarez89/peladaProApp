import React, { useState } from "react";
import { Text, TextInput, Pressable, KeyboardAvoidingView, TouchableOpacity, Keyboard, Platform, Alert } from "react-native";
import styles from "./styles";
import ProfilePage from "../ProfilePage";
import { supabase } from "../../lib/supabase";

const LoginPage = ({ goBack }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);

    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha ambos os campos.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log('Resposta do Supabase:', { data, error });

      if (error) {
        Alert.alert('Erro', error.message);
      } else if (data?.user) {
        Alert.alert('Bem-vindo', 'Você fez login com sucesso!');
        console.log('Usuário autenticado:', data.user);
        setIsAuthenticated(true);
      } else {
        Alert.alert('Erro', 'Usuário não encontrado ou senha incorreta.');
      }
    } catch (err) {
      console.error('Erro ao tentar fazer login:', err);
      Alert.alert('Erro', 'Houve um erro inesperado. Tente novamente.');
    }

    setLoading(false);
  }

  if (isAuthenticated) {
    return <ProfilePage />;
  }

  return (
    <KeyboardAvoidingView style={styles.mainView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable style={styles.form} onPress={() => Keyboard.dismiss()}>
        <Text style={styles.formText}>E-mail:</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="Seu e-mail" 
          onChangeText={setEmail} 
          value={email} 
          autoCapitalize="none" 
        />
        <Text style={styles.formText}>Senha:</Text>
        <TextInput 
          style={styles.formInput} 
          placeholder="Sua senha" 
          onChangeText={setPassword} 
          value={password} 
          secureTextEntry 
        />
        <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Entrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goBack} disabled={loading}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;