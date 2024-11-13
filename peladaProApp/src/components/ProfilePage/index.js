import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupPage from "../GroupPage";
import FinancePage from "../FinancePage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import GroupCard from "../GroupCard";

const Tab = createBottomTabNavigator();

const ProfilePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para carregar os dados do usuário e buscar os grupos
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        console.error("Erro ao buscar usuário:", error);
      } else if (data?.user) {
        setUser(data.user);
        // Agora que temos o usuário, vamos buscar os grupos onde ele é o administrador
        const { data: groupsData, error: groupsError } = await supabase
          .from("Groups")
          .select("*")
          .eq("adm", data.user.id); // Filtra os grupos pelo ID do administrador

        if (groupsError) {
          console.error("Erro ao buscar grupos:", groupsError.message);
        } else {
          setGroups(groupsData);
        }
      }
      setLoading(false);
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
        <Image source={require('../../img/logoapp.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout}>
          <Image source={require('../../img/logout.png')} style={styles.logout} />
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

      <View style={styles.myGroups}>
        <Text style={styles.text}>Meus Grupos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#167830" />
        ) : (
          <View>
            {groups.length > 0 ? (
              groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))
            ) : (
              <Text>Você não é administrador de nenhum grupo.</Text>
            )}
          </View>
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

            if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Grupos') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Finanças') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#167830',
          tabBarInactiveTintColor: 'gray',
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