import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

const ProfilePage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        console.error("Erro ao buscar usuário:", error);
      } else if (data?.user) {
        setUser(data.user);

        const { data: userData, error: userDataError } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userDataError) {
          console.error("Erro ao buscar dados do usuário:", userDataError.message);
          Alert.alert("Erro", "Não foi possível buscar os dados do usuário.");
        } else {
          setUserData(userData);
        }
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Confirmar Logout", "Deseja sair?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace("LaunchPage"); // Redireciona para a tela inicial após o logout
        },
      },
    ]);
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.viewHeader}>
        <Image source={require("../../img/logoapp.png")} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require("../../img/logout.png")} style={styles.logout} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.welcome}>Bem-vindo ao seu perfil</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#167830" />
        ) : userData ? (
          <>
            <Text style={styles.infoText}>Nome: {userData.display_name || "N/A"}</Text>
            <Text style={styles.infoText}>Email: {userData.email}</Text>
            <Text style={styles.infoText}>
              Telefone: {userData.phone || "Telefone não informado"}
            </Text>
          </>
        ) : (
          <Text style={styles.infoText}>Erro ao carregar dados do usuário.</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("GroupPage")}
        >
          <Text style={styles.buttonText}>Grupos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FinancePage", {user: user.id})}
        >
          <Text style={styles.buttonText}>Finanças</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilePage;