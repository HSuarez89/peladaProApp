import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { supabase } from "../../lib/supabase";

const GroupCard = ({ group }) => {
  const [nameAdm, setNameAdm] = useState(null);

  useEffect(() => {
    async function getAdmName() {
      const { data, error } = await supabase
        .from('usuarios')
        .select('display_name')
        .eq('id', group.adm);

      if (error) {
        console.error('Erro ao buscar nome do administrador:', error);
      } else if (data && data.length > 0) {
        setNameAdm(data[0].display_name);
      }
    }
    if (group && group.adm) {
      getAdmName();
    }
  }, [group]);

  return (
    <View style={styles.cardView}>
      <TouchableOpacity>
        <Text>Nome: {group.group_name}</Text>
        <Text>Quadra: {group.court_name}</Text>
        <Text>Endereço: {group.court_address}</Text>
        <Text>Administrador: {nameAdm ? nameAdm : "Carregando..."}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupCard;