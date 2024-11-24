import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, FlatList } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

export default function Partida({ route, navigation }) {
  const { matchId } = route.params;
  const [matchDetails, setMatchDetails] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]); // Lista de jogadores confirmados

  const fetchMatchDetails = async () => {
    try {
      const { data: matchData, error: matchError } = await supabase
        .from("partidas")
        .select("*, Groups(*)")
        .eq("id", matchId)
        .single();

      if (matchError) throw matchError;

      if (matchData) {
        setMatchDetails(matchData);

        const groupId = matchData.group_id;
        fetchGroupDetails(groupId);
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes da partida:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async (groupId) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from("Groups")
        .select("group_name, court_name, court_address, adm")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;

      if (groupData) {
        setGroupDetails(groupData);
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes do grupo:", err.message);
    }
  };

  const fetchPresenceList = async () => {
    try {
      const { data: presenceData, error: presenceError } = await supabase
        .from("presenca")
        .select("user_id")
        .eq("id", matchId);
  
      if (presenceError) throw presenceError;
  
      if (presenceData) {
        // Buscar os nomes dos jogadores com base nos IDs da tabela `usuarios`
        const userIds = presenceData.map((presence) => presence.user_id);
  
        const { data: usersData, error: usersError } = await supabase
          .from("usuarios")
          .select("id, display_name") // Alterado para selecionar 'display_name'
          .in("id", userIds);
  
        if (usersError) throw usersError;
  
        setPlayers(usersData); // Lista de jogadores confirmados
      }
    } catch (err) {
      console.error("Erro ao buscar lista de presença:", err.message);
    }
  };

  const handleCloseMatch = async () => {
    try {
      const { error } = await supabase
        .from("partidas")
        .update({ status: false }) 
        .eq("id", matchId);
  
      if (error) throw error;
  
      alert("Partida fechada com sucesso!");
      setMatchDetails((prev) => ({ ...prev, status: false }));
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao fechar a partida:", err.message);
      alert("Erro ao fechar a partida: " + err.message);
    }
  };
  

  const confirmarPresenca = async () => {
    if (!user || !matchId) {
      Alert.alert("Erro", "Não foi possível confirmar presença. Tente novamente.");
      return;
    }

    try {
      const { data, error } = await supabase.from("presenca").insert({
        id: matchId, // ID da partida
        user_id: user.user.id, // ID do usuário
      });

      if (error) throw error;

      Alert.alert("Sucesso", "Sua presença foi confirmada com sucesso!");
      fetchPresenceList(); // Atualizar lista de presença após confirmação
    } catch (err) {
      console.error("Erro ao confirmar presença:", err.message);
      Alert.alert("Erro", "Não foi possível confirmar presença. Tente novamente.");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: userData, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erro ao obter dados do usuário:", error.message);
      } else {
        setUser(userData);
      }
    };

    fetchUserDetails();
    if (matchId) {
      fetchMatchDetails();
      fetchPresenceList();
    }
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#167830" />
        <Text>Carregando detalhes da partida...</Text>
      </View>
    );
  }

  if (!matchDetails || !groupDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhuma partida ou grupo encontrado.</Text>
      </View>
    );
  }

  const isAdmin = user?.user.id === groupDetails.adm;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Partida</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detail}>Grupo: {groupDetails.group_name}</Text>
        <Text style={styles.detail}>Quadra: {groupDetails.court_name}</Text>
        <Text style={styles.detail}>Endereço: {groupDetails.court_address || "Não disponível"}</Text>
        <Text style={styles.detail}>Data: {matchDetails.date || "Não definida"}</Text>
        <Text style={styles.detail}>Hora: {matchDetails.time || "Não definida"}</Text>
        <Text style={styles.detail}>Status: {matchDetails.status ? "Aberta" : "Encerrada"}</Text>
      </View>

      <View style={styles.viewPresenca}>
        <Text style={styles.viewPresencaText}>Lista de presença</Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <Text style={styles.playerName}>{item.display_name}</Text>
          )}
          contentContainerStyle={styles.playerList}
        />

      </View>

      <View style={styles.viewBotao}>
        <TouchableOpacity style={styles.botao} onPress={confirmarPresenca}>
          <Text style={styles.textBotao}>Confirmar Presença</Text>
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <View style={styles.viewBotao}>
          <TouchableOpacity style={styles.botao} onPress={handleCloseMatch}>
            <Text style={styles.textBotao}>Fechar Partida</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}