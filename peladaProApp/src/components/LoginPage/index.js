import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, Alert, Keyboard, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import styles from "./styles";
import { supabase } from "../../lib/supabase";


const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
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

      if (error) {
        Alert.alert('Erro', error.message);
      } else if (data?.user) {
        Alert.alert('Bem-vindo', 'Você fez login com sucesso!');

        // Sincronizar dados com a tabela usuarios
        await checkAndSyncUserData(data.user);

        // Marcar como autenticado e chamar o callback de sucesso
        navigation.reset({
          index: 0,
          routes: [{ name: "ProfilePage" }],
        });
      } else {
        Alert.alert('Erro', 'Usuário não encontrado ou senha incorreta.');
      }
    } catch (err) {
      console.error('Erro ao tentar fazer login:', err);
      Alert.alert('Erro', 'Houve um erro inesperado. Tente novamente.');
    }

    setLoading(false);
  }

  async function checkAndSyncUserData(user) {
    try {
      // Verifica se o usuário já existe na tabela usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        console.log('Usuário já existe na tabela usuarios.');
      } else {
        // Se não existe, insere os dados do usuário a partir do metadata
        const displayName = user.user_metadata?.display_name || 'Nome não informado';
        const phone = user.user_metadata?.phone || 'Telefone não informado';

        // Insere o usuário na tabela usuarios com os dados do email e metadata
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: user.id,
              email: user.email,
              display_name: displayName,
              phone: phone,
            },
          ]);

        if (insertError) {
          console.error('Erro ao sincronizar dados do usuário:', insertError.message);
        } else {
          console.log('Usuário sincronizado com sucesso!');
        }
      }
    } catch (err) {
      console.error('Erro ao verificar ou sincronizar os dados do usuário:', err);
    }
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
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;