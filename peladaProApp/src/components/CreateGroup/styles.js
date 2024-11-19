import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%'
    },
    formView:{
        height: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    title: {
        fontSize: 18,
        color: '#167830',
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        backgroundColor: '#ababab',
        borderRadius: 10,
        paddingLeft: 10
    },
    viewButton: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 30,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        backgroundColor: '#167830',
        color: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 55,
        fontWeight: 'bold',
        fontSize: 18,
        borderRadius: 10
    }
})

export default styles