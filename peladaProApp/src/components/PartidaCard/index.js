import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";


const PartidaCard = ({ court_name, date, time }) => {
 
  const formatTime = (time) => {
    if (time) {
      const [hour, minute] = time.split(":"); 
      return `${hour}:${minute}`; 
    }
    return time; 
  };

  return (
    <View style={styles.cardView}>
        <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardText}>{court_name}</Text>
            <Text style={styles.cardText}>{date}</Text> 
            <Text style={styles.cardText}>{formatTime(time)}</Text>
        </TouchableOpacity>
    </View>
  );
};

export default PartidaCard;

