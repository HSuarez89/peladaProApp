import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import styles from "./styles";
import { supabase } from "../../lib/supabase";
import CreateGroup from "../CreateGroup";
import GroupCard from "../GroupCard";
import Group from "../Group";

export default function GroupPage() {
  const [pesquisaGrupo, setPesquisaGrupo] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(null);
  const [gruposEncontrados, setGruposEncontrados] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  async function searchGroup() {
    if (!pesquisaGrupo) return;

    setLoading(true);
    setBuscaRealizada(false);
    setGruposEncontrados([]);

    try {
      const { data, error } = await supabase.from("Groups").select("*");
      if (error) throw error;

      const pesquisaGrupoFormatado = pesquisaGrupo.toLowerCase().replace(/\s+/g, "");
      const gruposFiltrados = data.filter((group) => {
        const groupNameFormatado = group.group_name.toLowerCase().replace(/\s+/g, "");
        return groupNameFormatado === pesquisaGrupoFormatado;
      });

      console.log("Grupos filtrados:", gruposFiltrados);
      setGruposEncontrados(gruposFiltrados);
      setBuscaRealizada(true);
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
    console.log("Grupo selecionado:", grupo);
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
      <View style={styles.search}>
        <Text style={styles.text}>Pesquisar Grupos:</Text>
        <View style={styles.viewPlaceholder}>
          <TextInput
            placeholder="Nome do grupo:"
            style={styles.searchBar}
            onChangeText={setPesquisaGrupo}
            value={pesquisaGrupo}
          />
          <TouchableOpacity onPress={searchGroup}>
            <Image source={require("../../img/lupa.png")} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.results}>
        {loading ? (
          <ActivityIndicator size="large" color="#167830" />
        ) : buscaRealizada && gruposEncontrados.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum grupo encontrado.</Text>
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

      <View style={styles.viewButton}>
        <TouchableOpacity onPress={handleCriarGrupo} style={styles.button}>
          <Text style={styles.textButton}>Criar Grupo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}