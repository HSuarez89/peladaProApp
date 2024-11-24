import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import { useFocusEffect } from '@react-navigation/native';

export default function Group({ navigation, route, groupId }) {
  const [isAdm, setIsAdm] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [admName, setAdmName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMatch, setOpenMatch] = useState(null);
  const [presenca, setPresenca] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {

    const { groupId } = route.params;
    if (!groupId) {
      console.error("O ID do grupo não foi fornecido.");
      return;
    }

    const fetchGroupData = async () => {
      try {
        const { data, error } = await supabase
          .from("Groups")
          .select("*")
          .eq("id", groupId)
          .single();

        if (error) throw error;

        setGrupo(data);
      } catch (err) {
        console.error("Erro ao buscar dados do grupo:", err.message);
        setGrupo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    
    if (!grupo) return;

    const fetchGroupDetails = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user && user.id === grupo.adm) {
          setIsAdm(true);
        }

        const { data: playerData, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("group_id", grupo.id)
          .eq("user_id", user.id)
          .single();

        if (playerError && playerError.code !== "PGRST116") throw playerError;

        if (playerData) {
          setIsPlayer(true);
        }

        const { data: admData, error: admError } = await supabase
          .from("usuarios")
          .select("display_name")
          .eq("id", grupo.adm)
          .single();

        if (admError) throw admError;

        setAdmName(admData?.display_name || "Desconhecido");
      } catch (err) {
        console.error("Erro ao buscar informações do administrador ou jogador:", err.message);
        setAdmName("Desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [grupo]);

  useFocusEffect(
    React.useCallback(() => {
      if (grupo) {
        fetchOpenMatchAndPresenca();
      }
    }, [grupo])
  );

  const fetchOpenMatchAndPresenca = async () => {
    try {
      // Obter o usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const currentUser = userData?.user;
      if (!currentUser) throw new Error("Usuário não autenticado.");

      // Buscar a partida aberta
      const { data: partida, error: partidaError } = await supabase
        .from("partidas")
        .select("id, date, time")
        .eq("group_id", grupo.id)
        .eq("status", true)
        .maybeSingle(); // Retorna null se nenhuma partida for encontrada

      if (partidaError) throw partidaError;

      if (partida) {
        setOpenMatch(partida);

        // Verificar se há registro de presença do jogador
        const { data: presencaData, error: presencaError } = await supabase
          .from("presenca")
          .select("id")
          .eq("id", partida.id) // Relaciona pelo match_id
          .eq("user_id", currentUser.id) // Relaciona pelo user_id
          .maybeSingle(); // Retorna null se o jogador não confirmou presença

        if (presencaError && presencaError.code !== "PGRST116") {
          throw presencaError;
        }

        if (presencaData) {
          setPresenca(true); // Jogador confirmou presença
        } else {
          setPresenca(false); // Jogador não confirmou presença
        }
      } else {
        setOpenMatch(null); // Nenhuma partida aberta
      }
    } catch (err) {
      console.error("Erro ao buscar a partida aberta ou a presença:", err.message);
      setOpenMatch(null); // Limpa caso ocorra erro
      setPresenca(false);
    }
  };  

  const openDatePicker = () => {
    setSelectedDate(null); // Limpa a data
    setSelectedTime(null); // Limpa a hora
    setPickerMode("date"); // Modo para selecionar a data
    setModalVisible(true); // Abre o modal
  };
  
  const handleDateChange = async (event, date) => {
    if (date) {
      console.log("Data selecionada:", date);
      setSelectedDate(date); // Atualiza a data selecionada
      setPickerMode("time"); // Altera para o modo de seleção de hora
      setModalVisible(true); // Reabre o modal para a seleção da hora
    } else {
      setModalVisible(false); // Fecha o modal caso o usuário cancele
    }
  };
  
  const handleTimeChange = async (event, time) => {
    if (time) {
      console.log("Hora selecionada:", time);
      const newTime = new Date(selectedDate); // Cria um novo objeto Date com a data selecionada
      newTime.setHours(time.getHours(), time.getMinutes()); // Define a hora e os minutos com base no valor selecionado
      setSelectedTime(newTime); // Atualiza a hora selecionada no estado
    } else {
      setSelectedTime(null); // Caso o usuário cancele, a hora é definida como null
    }
  
    setModalVisible(false); // Fecha o modal após a seleção da hora
    await showConfirmAlert(time); // Passa a hora selecionada diretamente para a função de confirmação
  };
  
  const showConfirmAlert = async (time) => {
    console.log("selectedDate:", selectedDate);
    console.log("Hora recebida na confirmação:", time);
  
    // Verifique se selectedDate e a hora estão definidos corretamente
    if (!selectedDate || !time) {
      console.log("Data ou hora não selecionadas corretamente");
      Alert.alert("Erro", "Por favor, selecione tanto a data quanto a hora.");
      return;
    }
  
    // Verifique se são datas válidas
    if (isNaN(selectedDate.getTime()) || isNaN(time.getTime())) {
      Alert.alert("Erro", "Por favor, selecione tanto a data quanto a hora.");
      return;
    }
  
    // Formatação da data e hora
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    // Formata a hora corretamente
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
  
    // Defina um valor válido para o group_id (este valor precisa vir de algum lugar do seu app)
    const groupId = 1; // Exemplo: você pode substituir por um ID de grupo real que você tenha no app
  
    // Exibe o alerta de confirmação
    Alert.alert(
      "Confirmar partida",
      `Data: ${formattedDate}\nHora: ${formattedTime}`,
      [
        {
          text: "Cancelar",
          onPress: () => {
            console.log("Partida não criada");
            setSelectedDate(null);
            setSelectedTime(null);
          },
          style: "cancel",
        },
        {
          text: "Criar partida",
          onPress: async () => {
            try {
              const { data, error } = await supabase.from("partidas").insert([
                {
                  group_id: grupo.id,
                  date: formattedDate,
                  time: formattedTime,
                  status: true,
                },
              ]);
              fetchOpenMatchAndPresenca()
              if (error) {
                console.error("Erro ao criar a partida:", error.message);
                Alert.alert("Erro", "Erro ao criar a partida.");
                return;
              }
  
              console.log("Partida criada com sucesso:", data);
              Alert.alert("Sucesso", "Partida criada com sucesso!");
  
              setSelectedDate(null);
              setSelectedTime(null);
            } catch (err) {
              console.error("Erro inesperado:", err.message);
              Alert.alert("Erro", "Erro ao criar a partida.");
            }
          },
        },
      ]
    );
  };              

  const removePlayerFromGroup = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Erro ao obter o usuário:", userError.message);
      return;
    }

    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("group_id", grupo.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao remover o jogador:", error.message);
        Alert.alert("Erro", "Não foi possível remover o jogador do grupo.");
      } else {
        Alert.alert("Sucesso", "Você saiu do grupo.");
        setIsPlayer(false);
      }
    } catch (err) {
      console.error("Erro inesperado ao tentar remover o jogador:", err);
    }
  };

  const addPlayerToGroup = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Erro ao obter o usuário:", userError.message);
      return;
    }

    try {
      const { error } = await supabase
        .from("players")
        .insert([{ group_id: grupo.id, user_id: user.id }]);

      if (error) {
        console.error("Erro ao adicionar jogador:", error.message);
        Alert.alert("Erro", "Não foi possível adicionar o jogador ao grupo.");
      } else {
        setIsPlayer(true);
        Alert.alert("Sucesso", "Você foi cadastrado com sucesso no grupo!");
      }
    } catch (err) {
      console.error("Erro inesperado ao tentar adicionar o jogador:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" color="#167830" />
      </View>
    );
  }

  if (!grupo) {
    return (
      <View style={styles.mainView}>
        <Text style={styles.errorText}>Grupo não encontrado!</Text>
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

      {isPlayer && (
        <View style={styles.partidaView}>
          <Text style={styles.partidaText}>Próxima partida</Text>
          {openMatch && (
            <TouchableOpacity style={styles.partidaButton} onPress={() => navigation.navigate("Partida", {matchId: openMatch.id})}>
              <Text style={styles.partidaButtonText}>Quadra: {grupo.court_name}</Text>
              <Text style={styles.partidaButtonText}>Data: {openMatch.date}</Text>
              <Text style={styles.partidaButtonText}>Hora: {openMatch.time}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isAdm && (
        <View style={styles.goBackView}>
          <TouchableOpacity style={styles.goBackButton} onPress={openDatePicker}>
            <Text style={styles.goBackButtonText}>Adicionar Partida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Financeiro do Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isPlayer && !isAdm && (
        <View style={styles.enterGroupView}>
          <TouchableOpacity style={styles.enterGroupButton} onPress={addPlayerToGroup}>
            <Text style={styles.enterGroupButtonText}>Entrar no Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPlayer && !isAdm && (
        <View style={styles.leaveGroupView}>
          <TouchableOpacity
            style={styles.leaveGroupButton}
            onPress={() => {
              Alert.alert(
                "Confirmar saída",
                "Tem certeza que deseja sair deste grupo?",
                [
                  { text: "Cancelar" },
                  { text: "Sair", onPress: removePlayerFromGroup },
                ]
              );
            }}
          >
            <Text style={styles.leaveGroupButtonText}>Sair do Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalView}>
          {pickerMode === "date" && (
            <DateTimePicker mode="date" value={new Date()} onChange={handleDateChange} />
          )}
          {pickerMode === "time" && (
            <DateTimePicker mode="time" value={new Date()} onChange={handleTimeChange} />
          )}
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}