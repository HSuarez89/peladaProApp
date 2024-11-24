import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
    },
    form: {
        marginTop: '25%',
    },
    formText: {
        fontSize: 15,
    },
    formInput: {
        paddingVertical: 10,
        backgroundColor: '#ababab',
        marginBottom: 15,
        borderRadius: 15,
        paddingLeft: 10
    },
    button: {
        marginTop: 30,
        marginHorizontal: 'auto',
        width: '60%'
    },
    buttonText: {
        margin: 'auto',
        backgroundColor: '#167830',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
        textAlign: 'center'
    }
})

export default styles