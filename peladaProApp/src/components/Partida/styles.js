import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        paddingVertical: 20,
        color: '#167830',
        fontWeight: 'bold'
    },
    detailContainer: {
        height: 'auto',
        width: '100%',
        backgroundColor: "#ffffff",
        paddingVertical: 5,
        paddingLeft: 20
    },
    viewPresenca: {
        flex: 1,
        width: '100%',
        backgroundColor: '#ababab',
        borderRadius: 10,
    },
    viewPresencaText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
        marginBottom: 20
    },
    viewBotao: {
        height: 'auto',
        width: '40%',
    },
    textBotao: {
        backgroundColor:'#167830',
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
        borderRadius: 10
    },
    botao: {
        marginVertical: 20
    },
    playerList: {
        backgroundColor: '#c9c9c9',
        marginTop: 10
      },
      playerName: {
        fontSize: 16,
        color: "#333",
        paddingVertical: 5,
        paddingLeft: 10
      },
})

export default styles