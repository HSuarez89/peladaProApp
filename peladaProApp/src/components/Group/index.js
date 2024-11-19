import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Group({ grupo, goBack }) {
  return (
    <View>
      <Text>{grupo.group_name}</Text>
      <Text>{grupo.description || "Descrição não disponível"}</Text>
      <TouchableOpacity onPress={goBack}>
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}