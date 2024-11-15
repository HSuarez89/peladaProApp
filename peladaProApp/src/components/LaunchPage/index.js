import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import RegisterPage from "../RegisterPage";
import LoginPage from "../LoginPage";

const LaunchPage = ({ onLoginSuccess }) => {
  const [page, setPage] = useState(null);

  function goRegisterPage() {
    setPage('register');
  }

  function goLoginPage() {
    setPage('login');
  }

  function goBack() {
    setPage(null);
  }

  if (page === 'register') {
    return <RegisterPage goBack={goBack} />;
  } else if (page === 'login') {
    return <LoginPage goBack={goBack} onLoginSuccess={onLoginSuccess} />; // Passando a função onLoginSuccess para o LoginPage
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.viewImage}>
        <Image source={require('../../img/logoapp.png')} style={styles.image} />
      </View>
      <View style={styles.viewButtons}>
        <TouchableOpacity style={styles.button} onPress={goLoginPage}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goRegisterPage}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LaunchPage;