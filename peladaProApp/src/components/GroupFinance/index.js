import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

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
    <View>
      <Text>{item.usuarios?.display_name || "Desconhecido"}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
      <Text>R$ {item.value},00</Text>
    </View>
  );

  return (
    <View>
      <View>
        <Text>Pagamentos do Grupo</Text>
      </View>
      <View>
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
