import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Button, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../lib/supabase";
import styles from "./styles";
import PartidaCard from "../PartidaCard";

export default function Group({ grupo, goBack }) {
  const [isAdm, setIsAdm] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [admName, setAdmName] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState(null); // "date" ou "time"
  const [openMatch, setOpenMatch] = useState(null);

  useEffect(() => {
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
  }, [grupo.adm, grupo.id]);

  useEffect(() => {
    const fetchOpenMatch = async () => {
      try {
        // Consulta na tabela 'partidas' para verificar se existe uma partida aberta (status: true)
        const { data, error } = await supabase
          .from("partidas")
          .select("date, time")
          .eq("group_id", grupo.id)
          .eq("status", true)
          .single(); // Usamos .single() porque esperamos apenas uma partida aberta

        if (error) throw error;

        if (data) {
          setOpenMatch(data); // Aqui você pode armazenar os dados da partida se necessário
        }
      } catch (err) {
        console.error("Erro ao buscar a partida aberta:", err.message);
      }
    };

    fetchOpenMatch();
  }, [grupo.id]);

  const openPicker = (mode) => {
    setPickerMode(mode); // Define se é "date" ou "time"
    setModalVisible(true); // Abre o modal
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setModalVisible(false); // Fecha o modal de data
      openPicker("time"); // Abre o modal de hora após escolher a data
    } else {
      setModalVisible(false); // Fecha o modal se o usuário cancelar
    }
  };

  const handleTimeChange = (event, time) => {
    if (time) {
      setSelectedTime(time);
      setModalVisible(false); // Fecha o modal de hora
    } else {
      setModalVisible(false); // Fecha o modal se o usuário cancelar
    }
  };

  const showConfirmAlert = () => {
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione tanto a data quanto a hora.");
      return; // Não continua caso algum valor não tenha sido selecionado
    }

    const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const formattedTime = selectedTime.toISOString().split("T")[1].slice(0, 5); // Formato HH:MM

    console.log(`Data formatada: ${formattedDate}, Hora formatada: ${formattedTime}`);

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
              console.log("Tentando criar a partida com os dados:", {
                group_id: grupo.id,
                date: formattedDate,
                time: formattedTime,
              });

              const { data, error } = await supabase.from("partidas").insert([{
                group_id: grupo.id,
                date: formattedDate, // Usando a data formatada
                time: formattedTime, // Usando a hora formatada
                status: true,
              }]);

              if (error) {
                console.error("Erro ao criar a partida:", error.message);
                alert("Erro ao criar a partida.");
                return;
              }

              console.log("Partida criada com sucesso!", data);
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

  // Função para remover o jogador do grupo
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
        console.log("Jogador removido do grupo com sucesso!");
        Alert.alert("Sucesso", "Você saiu do grupo.");
        setIsPlayer(false); // Atualiza o estado
      }
    } catch (err) {
      console.error("Erro inesperado ao tentar remover o jogador:", err);
    }
  };

  // Função para adicionar o jogador ao grupo
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
        console.log("Jogador adicionado ao grupo com sucesso!");
        setIsPlayer(true); // Atualiza o estado para que o botão "Sair do Grupo" apareça
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

          {/* Adicione a renderização condicional do PartidaCard aqui */}
          {openMatch && (
            <PartidaCard
              court_name={grupo.court_name}
              date={openMatch.date}
              time={openMatch.time}
            />
          )}
        </View>
      )}


      {isAdm && (
        <View style={styles.admView}>
          <TouchableOpacity style={styles.Button} onPress={() => openPicker("date")}>
            <Text style={styles.ButtonText}>Abrir Partida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button}>
            <Text style={styles.ButtonText}>Financeiro do Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botão para adicionar o jogador ao grupo se ele ainda não for membro */}
      {!isPlayer && (
        <View style={styles.goBackView}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={addPlayerToGroup}
          >
            <Text style={styles.goBackButtonText}>Entrar no Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botão para sair do grupo se o jogador for membro */}
      {isPlayer && (
        <View style={styles.leaveGroupView}>
          <TouchableOpacity
            style={styles.leaveGroupButton}
            onPress={() => {
              Alert.alert(
                "Tem certeza?",
                "Você realmente deseja sair deste grupo?",
                [
                  {
                    text: "Cancelar",
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "Sim, sair",
                    onPress: removePlayerFromGroup,
                  },
                ]
              );
            }}
          >
            <Text style={styles.leaveGroupButtonText}>Sair do Grupo</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.goBackView}>
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalView}>
          {pickerMode === "date" && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}
          {pickerMode === "time" && (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              is24Hour={true}
              display="clock"
              onChange={handleTimeChange}
            />
          )}
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}