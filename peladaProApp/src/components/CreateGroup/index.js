import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from './styles';

const CreateGroup = ({ goBack }) => {
  const [nomeGrupo, setNomeGrupo] = useState(null);
  const [nomeQuadra, setNomeQuadra] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [user, setUser] = useState(null);

  // Função para obter o usuário logado
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    fetchUser(); // Chama ao montar o componente
  }, []);

  const cadastraGrupo = async () => {
    try {
      // Verificando se todos os campos foram preenchidos
      if (!nomeGrupo || !nomeQuadra || !endereco) {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      // Verificando se o usuário está logado
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const admId = user.id;

      // Inserindo o grupo na tabela Groups e retornando o ID do grupo
      const { data: groupData, error: groupError } = await supabase
        .from("Groups")
        .insert([{
          group_name: nomeGrupo,
          court_name: nomeQuadra,
          court_address: endereco,
          adm: admId
        }])
        .select(); // Garantir que o Supabase retorne os dados inseridos

      if (groupError) {
        console.error("Erro ao cadastrar grupo:", groupError.message);
        Alert.alert("Erro", `Erro ao cadastrar grupo: ${groupError.message}`);
        return;
      }

      if (!groupData || groupData.length === 0) {
        console.error("Erro ao cadastrar grupo: dados não retornados.");
        Alert.alert("Erro", "Erro ao cadastrar grupo: dados não retornados.");
        return;
      }

      const groupId = groupData[0].id;
      console.log("ID do grupo criado:", groupId);

      // Agora, insere o usuário na tabela players
      const { error: insertPlayerError } = await supabase
        .from("players")
        .insert([{ group_id: groupId, user_id: admId }]);

      if (insertPlayerError) {
        console.error("Erro ao inserir jogador na tabela:", insertPlayerError.message);
        Alert.alert("Erro", `Erro ao cadastrar jogador: ${insertPlayerError.message}`);
        return;
      }

      Alert.alert("Sucesso", "Grupo cadastrado e jogador adicionado com sucesso!");
      goBack();
    } catch (error) {
      console.error("Erro inesperado", error);
      Alert.alert("Erro inesperado", error.message);
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.formView}>
        <Text style={styles.title}>Novo grupo</Text>
        <Text>Nome do grupo:</Text>
        <TextInput
          placeholder="Ex: Pelada Cidade Nova"
          onChangeText={setNomeGrupo}
          value={nomeGrupo}
          style={styles.input}
        />
        <Text>Nome da quadra:</Text>
        <TextInput
          placeholder="Ex: Recreio"
          onChangeText={setNomeQuadra}
          value={nomeQuadra}
          style={styles.input}
        />
        <Text>Endereço da quadra:</Text>
        <TextInput
          placeholder="Ex: Rua João Arantes N: 4528, bairro Cidade Nova"
          onChangeText={setEndereco}
          value={endereco}
          style={styles.input}
        />
      </View>
      <View style={styles.viewButton}>
        <TouchableOpacity onPress={cadastraGrupo} style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack} style={styles.button}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateGroup;