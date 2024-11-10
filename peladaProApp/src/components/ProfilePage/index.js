import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
          console.error("Erro ao buscar usuário:", error);
        } else if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro inesperado:", error);
        Alert.alert("Erro", "Ocorreu um erro ao carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <Text style={styles.title}>Bem-vindo ao seu perfil</Text>
      {user && (
        <>
          <Text style={styles.infoText}>Nome: {user.user_metadata?.display_name || "N/A"}</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
          <Text style={styles.infoText}>Telefone: {user.user_metadata?.phone || "N/A"}</Text>
        </>
      )}
    </View>
  );
};

export default ProfilePage;