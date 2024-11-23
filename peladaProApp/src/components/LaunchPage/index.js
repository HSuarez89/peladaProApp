import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";

const LaunchPage = ({ navigation }) => {

  return (
    <View style={styles.mainView}>
      <View style={styles.viewImage}>
        <Image source={require('../../img/logoapp.png')} style={styles.image} />
      </View>
      <View style={styles.viewButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LoginPage")}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterPage")}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LaunchPage;