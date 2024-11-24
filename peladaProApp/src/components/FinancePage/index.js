import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

export default function FinancePage({ route }) {
  const { user } = route.params; // Recebe o ID do usuário via params
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
            Groups: group_id (group_name)
          `)
          .eq("user_id", user);

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
  }, [user]);

  const renderPagamento = ({ item }) => (
    <View>
      <Text>{item.Groups?.group_name || "Desconhecido"}</Text>
      <Text>{new Date(item.date).toLocaleDateString()}</Text>
      <Text>R$ {item.value},00</Text>
    </View>
  );

  return (
    <View>
      <View>
        <Text>Finanças</Text>
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