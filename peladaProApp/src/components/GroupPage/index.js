import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

export default function GroupPage({ navigation }) {
  const [pesquisaGrupo, setPesquisaGrupo] = useState(null);
  const [gruposEncontrados, setGruposEncontrados] = useState([]); // Grupos associados ao usuário
  const [gruposPesquisados, setGruposPesquisados] = useState([]); // Resultados da busca
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState({}); // Mapeia o ID do adm para o display_name

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      setLoading(true);
      try {
        const { data: playerGroups, error: playerError } = await supabase
          .from("players")
          .select("group_id")
          .eq("user_id", user.id);

        if (playerError) throw playerError;

        const groupIds = playerGroups.map((pg) => pg.group_id);
        const { data: groups, error: groupError } = await supabase
          .from("Groups")
          .select("*")
          .in("id", groupIds);

        if (groupError) throw groupError;

        setGruposEncontrados(groups);

        // Buscar os nomes dos administradores
        const adminIds = [...new Set(groups.map((group) => group.adm))];
        fetchAdmins(adminIds);
      } catch (err) {
        console.error("Erro ao carregar grupos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  const fetchAdmins = async (adminIds) => {
    try {
      const { data: users, error } = await supabase
        .from("usuarios")
        .select("id, display_name")
        .in("id", adminIds);

      if (error) throw error;

      // Criar um mapa de IDs para nomes
      const adminMap = users.reduce((acc, user) => {
        acc[user.id] = user.display_name;
        return acc;
      }, {});

      setAdmins(adminMap);
    } catch (err) {
      console.error("Erro ao buscar nomes dos administradores:", err);
    }
  };

  async function searchGroup() {
    if (!pesquisaGrupo) return;

    setLoading(true);

    try {
      const pesquisaGrupoFormatado = pesquisaGrupo.toLowerCase().replace(/\s+/g, "");

      const { data: groups, error } = await supabase.from("Groups").select("*");

      if (error) throw error;

      const gruposFiltrados = groups.filter((group) => {
        const groupNameFormatado = group.group_name.toLowerCase().replace(/\s+/g, "");
        return groupNameFormatado.includes(pesquisaGrupoFormatado);
      });

      setGruposPesquisados(gruposFiltrados);

      // Buscar os nomes dos administradores para os grupos encontrados
      const adminIds = [...new Set(gruposFiltrados.map((group) => group.adm))];
      fetchAdmins(adminIds);
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.mainView}>
      {/* Pesquisa */}
      <View style={styles.viewTitle}>
        <Text style={styles.text}>Pesquisar Grupos</Text>
      </View>
      <View style={styles.viewPlaceholder}>
        <TextInput
          placeholder="Pesquisar grupo pelo nome"
          onChangeText={setPesquisaGrupo}
          value={pesquisaGrupo}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={searchGroup}>
          <Image source={require("../../img/lupa.png")} style={styles.image} />
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      {gruposPesquisados.length > 0 && (
        <View style={styles.viewGrupos}>
          <Text style={styles.textGrupos}>Resultados da Pesquisa</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#167830" />
          ) : (
            gruposPesquisados.map((group) => (
              <TouchableOpacity
                key={group.id}
                onPress={() => navigation.navigate("Group", { groupId: group.id })}
                style={styles.groupItem}
              >
                <Text style={styles.groupName}>{group.group_name}</Text>
                <Text style={styles.groupDescription}>
                  Quadra: {group.court_name || "Sem descrição"}
                </Text>
                <Text>Adm: {admins[group.adm] || "Carregando..."}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Meus Grupos */}
      <View style={styles.viewGrupos}>
        <Text style={styles.textGrupos}>Meus Grupos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#167830" />
        ) : gruposEncontrados.length === 0 ? (
          <Text style={styles.textNaoGrupos}>Nenhum grupo encontrado.</Text>
        ) : (
          gruposEncontrados.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => navigation.navigate("Group", { groupId: group.id })}
              style={styles.groupItem}
            >
              <Text style={styles.groupItemText}>{group.group_name}</Text>
              <Text style={styles.groupItemText}>
                Quadra: {group.court_name || "Sem descrição"}
              </Text>
              <Text style={styles.groupItemText}>Adm: {admins[group.adm] || "Carregando..."}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Botão para Criar Grupo */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateGroup")}
        style={styles.botaoCriarGrupo}
      >
        <Text style={styles.textButton}>Criar Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}