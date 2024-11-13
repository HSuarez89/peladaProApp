import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";


const GroupCard = ({ group }) => {

  return (
    <View style={styles.cardView}>
      <TouchableOpacity>
        <Text>Nome: {group.group_name}</Text>
        <Text>Quadra: {group.court_name}</Text>
        <Text>Endereço: {group.court_address}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupCard;