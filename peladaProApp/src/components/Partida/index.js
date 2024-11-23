import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase"; // Ajuste o caminho conforme necessário
import styles from "./styles";

export default function Partida({ route }) {
  const { matchId } = route.params; // Obtém o matchId passado pela navegação
  const [matchDetails, setMatchDetails] = useState(null);
  const [groupDetails, setGroupDetails] = useState(null); // Para armazenar os detalhes do grupo
  const [user, setUser] = useState(null); // Para armazenar os dados do usuário logado
  const [loading, setLoading] = useState(true);

  // Função para buscar os detalhes da partida
  const fetchMatchDetails = async () => {
    try {
      const { data: matchData, error: matchError } = await supabase
        .from("partidas")
        .select("*, Groups(*)") // Busca os detalhes da partida e do grupo
        .eq("id", matchId)
        .single(); // Busca apenas uma partida

      if (matchError) throw matchError;

      if (matchData) {
        setMatchDetails(matchData); // Define os detalhes da partida

        // Extrai o group_id e busca os dados do grupo
        const groupId = matchData.group_id;
        fetchGroupDetails(groupId); // Chama a função para buscar os dados do grupo
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes da partida:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os detalhes do grupo
  const fetchGroupDetails = async (groupId) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from("Groups")
        .select("group_name, court_name, court_address, adm") // Busca o grupo com o adm
        .eq("id", groupId)
        .single(); // Busca o grupo relacionado à partida

      if (groupError) throw groupError;

      if (groupData) {
        setGroupDetails(groupData); // Define os detalhes do grupo
      }
    } catch (err) {
      console.error("Erro ao buscar os detalhes do grupo:", err.message);
    }
  };

  // Obtendo o usuário logado
  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Erro ao obter dados do usuário:", error.message);
      } else {
        console.log("Usuário logado:", userData); // Verifique se os dados do usuário estão sendo retornados
        setUser(userData); // Armazena os dados do usuário logado
      }
    };

    fetchUserDetails();
    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  // Verificando se o usuário é o administrador, somente quando o user e groupDetails estiverem definidos
  useEffect(() => {
    if (user && groupDetails) {
      console.log("ID do Usuário Logado:", user.user.id); // Log para verificar o id do usuário logado
      console.log("Administrador do Grupo ID:", groupDetails.adm); // Log para verificar o id do admin do grupo

      const isAdmin = user.user.id === groupDetails.adm; // Comparação para verificar se é o administrador
      console.log("É administrador?", isAdmin);

      if (isAdmin) {
        // Aqui você pode realizar qualquer ação adicional se for admin
      }
    }
  }, [user, groupDetails]);

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

  // Verificando a variável isAdmin para exibir o botão de "Fechar partida"
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

      {/* Renderiza o botão "Fechar Partida" apenas se o usuário for o adm do grupo */}
      {isAdmin && (
        <View>
          <TouchableOpacity>
            <Text>Fechar Partida</Text>
          </TouchableOpacity>
        </View>
      )}

      <View>
        <Text>Lista de presença</Text>
      </View>
    </View>
  );
}
