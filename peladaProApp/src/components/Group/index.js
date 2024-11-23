import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import PartidaCard from "../PartidaCard";

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

  useEffect(() => {
    if (!grupo) return;
  
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
          .single();
  
        if (partidaError) throw partidaError;
  
        if (partida) {
          setOpenMatch(partida);
  
          // Verificar se há registro de presença do jogador
          const { data: presencaData, error: presencaError } = await supabase
            .from("presenca") // Nome da tabela de presença
            .select("id") // Apenas verificamos se o registro existe
            .eq("id", partida.id) // UUID da partida
            .eq("user_id", currentUser.id) // UUID do usuário
            .single();
  
          if (presencaError && presencaError.code !== "PGRST116") {
            // Ignorar erro caso o jogador não tenha confirmado presença ainda
            throw presencaError;
          }
  
          if (presencaData) {
            setPresenca(true); // Jogador confirmou presença
          }
        }
      } catch (err) {
        console.error("Erro ao buscar a partida aberta ou a presença:", err.message);
      }
    };
  
    fetchOpenMatchAndPresenca();
  }, [grupo]);

  const openPicker = (mode) => {
    setPickerMode(mode);
    setModalVisible(true);
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setModalVisible(false);
      openPicker("time");
    } else {
      setModalVisible(false);
    }
  };

  const handleTimeChange = (event, time) => {
    if (time) {
      setSelectedTime(time);
      setModalVisible(false);
      showConfirmAlert();
    } else {
      setModalVisible(false);
    }
  };

  const showConfirmAlert = () => {
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione tanto a data quanto a hora.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedTime = selectedTime.toISOString().split("T")[1].slice(0, 5);

    Alert.alert(
      "Confirmar partida",
      `Data: ${formattedDate}\nHora: ${formattedTime}`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Partida não criada"),
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

              if (error) {
                console.error("Erro ao criar a partida:", error.message);
                alert("Erro ao criar a partida.");
                return;
              }

              alert("Partida criada com sucesso!");
              setSelectedDate(null);
              setSelectedTime(null);
            } catch (err) {
              console.error("Erro ao criar a partida:", err.message);
              alert("Erro ao criar a partida.");
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
          <TouchableOpacity style={styles.goBackButton} onPress={() => openPicker("date")}>
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