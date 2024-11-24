import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, Keyboard } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Payment({ navigation, route }) {
  const [valor, setValor] = useState("");

  const handleLancarPagamento = async () => {
    const { userId, groupId } = route.params;

    if (!valor) {
      Alert.alert("Erro", "Por favor, insira um valor válido.");
      return;
    }

    try {
      const { data, error } = await supabase.from("payment").insert([
        {
          user_id: userId,
          group_id: groupId,
          date: new Date().toISOString(), // Data atual em formato ISO
          value: parseInt(valor, 10), // Converte para número inteiro
        },
      ]);

      if (error) {
        console.error("Erro ao lançar pagamento:", error.message);
        Alert.alert("Erro", "Não foi possível lançar o pagamento.");
      } else {
        Alert.alert("Sucesso", "Pagamento lançado com sucesso!");
        setValor(""); // Limpa o campo de valor
        Keyboard.dismiss(); // Fecha o teclado
        navigation.goBack()
      }
    } catch (err) {
      console.error("Erro inesperado:", err.message);
      Alert.alert("Erro", "Ocorreu um erro ao lançar o pagamento.");
    }
  };

  return (
    <View>
      <View>
        <Text>Lançar Pagamento</Text>
      </View>
      <View>
        <Text>Valor:</Text>
        <TextInput
          placeholder="Ex: 50"
          onChangeText={setValor}
          value={valor}
          keyboardType="numeric"
        />
      </View>
      <View>
        <TouchableOpacity onPress={handleLancarPagamento}>
          <Text>Lançar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
