import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GroupPage from "../GroupPage";
import FinancePage from "../FinancePage";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const ProfilePage = ({ onLogout }) => {
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
          onLogout();
        },
      },
    ]);
  };

  const UserProfile = () => (
    <View style={styles.mainView}>
      <View style={styles.viewHeader}>
        <Image source={require("../../img/logoapp.png")} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require("../../img/logout.png")} style={styles.logout} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.welcome}>Bem-vindo ao seu perfil</Text>
        {userData ? (
          <>
            <Text style={styles.infoText}>Nome: {userData.display_name || "N/A"}</Text>
            <Text style={styles.infoText}>Email: {userData.email}</Text>
            <Text style={styles.infoText}>Telefone: {userData.phone || "Telefone não informado"}</Text>
          </>
        ) : (
          <ActivityIndicator size="large" color="#167830" />
        )}
      </View>
    </View>
  );

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Grupos") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Finanças") {
              iconName = focused ? "wallet" : "wallet-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#167830",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: { fontSize: 12 },
        })}
      >
        <Tab.Screen name="Perfil" component={UserProfile} />
        <Tab.Screen name="Grupos" component={GroupPage} />
        <Tab.Screen name="Finanças" component={FinancePage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default ProfilePage;