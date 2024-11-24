import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

export default function GroupFinance({ route }) {
  const { groupId } = route.params;
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const { data, error } = await supabase
          .from("payment")
          .select(`
            date,
            value,
            usuarios: user_id (display_name)
          `)
          .eq("group_id", groupId);

        if (error) {
          console.error("Erro ao buscar pagamentos:", error.message);
          Alert.alert("Erro", "Não foi possível carregar os pagamentos.");
        } else {
          setPagamentos(data);
        }
      } catch (err) {
        console.error("Erro inesperado:", err.message);
        Alert.alert("Erro", "Ocorreu um erro ao carregar os pagamentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagamentos();
  }, [groupId]);

  const renderPagamento = ({ item }) => (
    <View style={styles.flatList}>
      <Text style={styles.flatListItem}>{item.usuarios?.display_name || "Desconhecido"}</Text>
      <Text style={styles.flatListItem}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.flatListItem}>R$ {item.value},00</Text>
    </View>
  );

  return (
    <View style={styles.mainView}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Pagamentos do Grupo</Text>
      </View>
      <View style={styles.listView}>
        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <FlatList
            data={pagamentos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPagamento}
          />
        )}
      </View>
    </View>
  );
}
