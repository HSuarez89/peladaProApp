import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import CreateGroup from "../CreateGroup";
import GroupCard from "../GroupCard";
import Group from "../Group";
import styles from "./styles";

export default function GroupPage() {
  const [pesquisaGrupo, setPesquisaGrupo] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(null);
  const [gruposEncontrados, setGruposEncontrados] = useState([]); // Grupos associados ao usuário
  const [gruposPesquisados, setGruposPesquisados] = useState([]); // Resultados da busca
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Obter o usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Carregar grupos do usuário logado
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
      } catch (err) {
        console.error("Erro ao carregar grupos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  // Buscar grupo pelo nome com formatação
  async function searchGroup() {
    if (!pesquisaGrupo) return;

    setLoading(true);

    try {
      // Formata a pesquisa: converte para minúsculas e remove espaços
      const pesquisaGrupoFormatado = pesquisaGrupo.toLowerCase().replace(/\s+/g, "");

      // Busca todos os grupos da tabela
      const { data: groups, error } = await supabase
        .from("Groups")
        .select("*");

      if (error) throw error;

      // Filtra os grupos localmente com a lógica de formatação
      const gruposFiltrados = groups.filter((group) => {
        const groupNameFormatado = group.group_name.toLowerCase().replace(/\s+/g, "");
        return groupNameFormatado.includes(pesquisaGrupoFormatado);
      });

      setGruposPesquisados(gruposFiltrados);
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleCriarGrupo() {
    setPaginaAtual("criar");
  }

  function handleVoltar() {
    setPaginaAtual(null);
    setGrupoSelecionado(null);
  }

  function handleAbrirGrupo(grupo) {
    setGrupoSelecionado(grupo);
    setPaginaAtual("grupo");
  }

  if (paginaAtual === "criar") {
    return <CreateGroup goBack={handleVoltar} />;
  }

  if (paginaAtual === "grupo" && grupoSelecionado) {
    return <Group grupo={grupoSelecionado} goBack={handleVoltar} />;
  }

  return (
    <View style={styles.mainView}>
      {/* Seção de pesquisa */}
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

      {/* Resultados da pesquisa */}
      {gruposPesquisados.length > 0 && (
        <View style={styles.viewGrupos}>
          <Text style={styles.textGrupos}>Resultados da Pesquisa</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#167830" />
          ) : (
            gruposPesquisados.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onOpenGroup={handleAbrirGrupo}
              />
            ))
          )}
        </View>
      )}

      {/* Grupos associados ao usuário */}
      <View style={styles.viewGrupos}>
        <Text style={styles.textGrupos}>Meus Grupos</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#167830" />
        ) : gruposEncontrados.length === 0 ? (
          <Text style={styles.textNaoGrupos}>Nenhum grupo encontrado.</Text>
        ) : (
          gruposEncontrados.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onOpenGroup={handleAbrirGrupo}
            />
          ))
        )}
      </View>

      {/* Botão para criar grupo */}
      <TouchableOpacity onPress={handleCriarGrupo} style={styles.botaoCriarGrupo}>
        <Text style={styles.textButton}>Criar Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}