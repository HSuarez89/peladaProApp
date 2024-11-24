import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        height: '100%',
        width: '100%',
    },
    viewImage: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '90%',
        resizeMode: 'contain'
    },
    viewButtons: {
        width: '100%',
        alignItems: 'center',
        height: '40%',
        justifyContent: 'center'
    },
    button: {
        marginBottom: 20,
        width: '40%'
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#167830',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 15,
        textAlign: 'center'
    }
})

export default styles