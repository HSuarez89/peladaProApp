import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupPage from "../GroupPage";
import FinancePage from "../FinancePage";

const Tab = createBottomTabNavigator();

const ProfilePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        console.error("Erro ao buscar usuário:", error);
      } else if (data?.user) {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja sair?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: async () => {
          await supabase.auth.signOut();
          onLogout(); 
        }},
      ]
    );
  };

  const UserProfile = () => (
    <View style={styles.mainView}>
      <View style={styles.viewHeader}>
        <Image source={require('../../img/logoapp.png')} style={styles.logo}/>
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('../../img/logout.png')} style={styles.logout}/>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.welcome}>Bem-vindo ao seu perfil</Text>
        {user && (
          <>
            <Text style={styles.infoText}>Nome: {user.user_metadata?.display_name || "N/A"}</Text>
            <Text style={styles.infoText}>Email: {user.email}</Text>
            <Text style={styles.infoText}>Telefone: {user.user_metadata?.phone || "N/A"}</Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Perfil" component={UserProfile} />
        <Tab.Screen name="Grupos" component={GroupPage} />
        <Tab.Screen name="Finanças" component={FinancePage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default ProfilePage;