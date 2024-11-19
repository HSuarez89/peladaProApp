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
        marginBottom: 10
    },
    searchBar: {
        width: '80%',
        backgroundColor: '#ababab',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10
    },
    viewButton: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column-reverse',
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
    }
})

export default styles