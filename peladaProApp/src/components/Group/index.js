import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase"; // Certifique-se de importar corretamente
import styles from "./styles";

export default function Group({ grupo, goBack }) {
  const [isAdm, setIsAdm] = useState(false); // Estado para controlar se o usuário é o administrador
  const [isPlayer, setIsPlayer] = useState(false); // Estado para verificar se o usuário é jogador do grupo
  const [admName, setAdmName] = useState(null); // Nome do administrador
  const [loading, setLoading] = useState(true); // Estado para exibir um carregador enquanto verifica

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Obtém o usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Verifica se o usuário autenticado é o administrador
        if (user && user.id === grupo.adm) {
          setIsAdm(true);
        }

        // Verifica se o usuário já é jogador do grupo
        const { data: playerData, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("group_id", grupo.id)
          .eq("user_id", user.id)
          .single(); // Garante que apenas um resultado seja retornado

        if (playerError && playerError.code !== "PGRST116") throw playerError; // "PGRST116" significa que não há registros

        if (playerData) {
          setIsPlayer(true); // O usuário já é jogador no grupo
        }

        // Busca o nome do administrador na tabela de usuários
        const { data: admData, error: admError } = await supabase
          .from("usuarios") // Certifique-se de que o nome da tabela de usuários esteja correto
          .select("display_name")
          .eq("id", grupo.adm)
          .single(); // Garante que apenas um resultado seja retornado

        if (admError) throw admError;

        setAdmName(admData?.display_name || "Desconhecido");
      } catch (err) {
        console.error("Erro ao buscar informações do administrador ou jogador:", err.message);
        setAdmName("Desconhecido");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchGroupDetails();
  }, [grupo.adm, grupo.id]);

  // Função para o botão "Entrar no Grupo"
  const handleEntrarNoGrupo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        setLoading(true);
        // Insere o jogador na tabela de players
        const { error } = await supabase
          .from("players")
          .insert([{ group_id: grupo.id, user_id: user.id }]);

        if (error) throw error;

        // Atualiza o estado para refletir que o usuário agora é um jogador
        setIsPlayer(true);
      } catch (err) {
        console.error("Erro ao entrar no grupo:", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Enquanto a verificação está em andamento, exibe um indicador de carregamento
  if (loading) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" color="#167830" />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <View>
        <Text style={styles.infoTitle}>{grupo.group_name}</Text>
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>Quadra: {grupo.court_name}</Text>
        <Text style={styles.infoText}>Endereço: {grupo.court_address}</Text>
        <Text style={styles.infoText}>Administrador: {admName}</Text>
      </View>
      
      {isPlayer && ( // Renderiza a seção da próxima partida apenas se o usuário for jogador
        <View style={styles.partidaView}>
          <Text style={styles.partidaText}>Próxima partida</Text>
        </View>
      )}

      {isAdm && ( // Renderiza a admView apenas se o usuário for o administrador
        <View style={styles.admView}>
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.ButtonText}>Abrir Partida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.ButtonText}>Financeiro do Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isPlayer && !isAdm && ( // Exibe o botão "Entrar no Grupo" se o usuário não for jogador nem administrador
        <View style={styles.goBackView}>
          <TouchableOpacity onPress={handleEntrarNoGrupo} style={styles.Button}>
            <Text style={styles.ButtonText}>Entrar no Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPlayer && ( // Exibe o botão "Informar Pagamento" se o usuário for um jogador
        <View style={styles.pagamentoView}>
          <TouchableOpacity style={styles.pagamentoButton}>
            <Text style={styles.pagamentoButtonText}>Informar Pagamento</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.goBackView}>
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}