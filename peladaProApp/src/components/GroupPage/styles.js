import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%'
    },
    search: {
        width: '100%',
        height: 'auto',
        paddingLeft: 20,
        paddingTop: 15,
        paddingRight: 20,
    },
    text: {
        color: '#167830',
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 10,
        fontSize: 18
    },
    searchBar: {
        width: '80%',
        backgroundColor: '#ababab',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10
    },
    textButton: {
       color: '#ffffff',
       backgroundColor: '#167830',
       paddingHorizontal: 20,
       paddingVertical: 5, fontWeight: 'bold',
       borderRadius: 5,
       marginBottom: 20
    },
    viewPlaceholder: {
        flexDirection: 'row',
        marginBottom: 30,
        marginLeft: 20
    },
    image: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginLeft: 15
    },
    noResultsText: {
        marginLeft: 20,
        marginTop: 30
    },
    viewTitle: {
        height: 'auto'
    },
    viewGrupos: {
        flex: 1,
        backgroundColor: "#ababab",
    },
    textGrupos: {
        color: '#167830',
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 10,
        fontSize: 16,
    },
    botaoCriarGrupo: {
        backgroundColor: '#ababab',
        alignItems: 'center'
    },
    textNaoGrupos: {
        fontWeight: 'bold',
        paddingLeft: 30
    },
    groupItem: {
        height: 'auto',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    groupItemText: {
        fontWeight: 'bold'
    }
})

export default styles