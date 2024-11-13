import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

const CreateGroup = ({ goBack }) => {
  const [nomeGrupo, setNomeGrupo] = useState(null);
  const [nomeQuadra, setNomeQuadra] = useState(null);
  const [endereco, setEndereco] = useState(null);

  const cadastraGrupo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }
      const admId = user.id;

      const { data, error } = await supabase
        .from("Groups")
        .insert([
          { 
            "group_name": nomeGrupo, 
            "court_name": nomeQuadra, 
            "court_address": endereco, 
            "adm": admId 
          }
        ]);

      if (error) {
        console.error("Erro ao cadastrar grupo:", error.message);
      } else {
        Alert.alert("Cadastro realizado com sucesso.");
        goBack()
      }
    } catch (error) {
      console.error("Erro inesperado", error);
    }
  };

  return (
    <View>
      <View>
        <Text>Novo grupo</Text>
        <Text>Nome do grupo:</Text>
        <TextInput
          placeholder="Ex: Pelada Cidade Nova"
          onChangeText={setNomeGrupo}
          value={nomeGrupo}
        />
        <Text>Nome da quadra:</Text>
        <TextInput
          placeholder="Ex: Recreio"
          onChangeText={setNomeQuadra}
          value={nomeQuadra}
        />
        <Text>Endereço da quadra:</Text>
        <TextInput
          placeholder="Ex: Rua João Arantes N: 4528, bairro Cidade Nova"
          onChangeText={setEndereco}
          value={endereco}
        />
      </View>
      <View>
        <TouchableOpacity onPress={cadastraGrupo}>
          <Text>Criar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateGroup;