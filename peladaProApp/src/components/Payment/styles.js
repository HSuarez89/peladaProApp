import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%'
    },
    titleView: {
        height: '5%',
        marginTop: 20
    },
    titleText: {
        fontSize: 20,
        color: '#167830',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    paymentView: {
        flex: 1,
        backgroundColor: '#ababab',
        marginTop: 10,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    paymentText: {
        width: '15%',
        fontSize: 18,
        fontWeight: 'bold'
    },
    paymentInput: {
        width: '30%',
        backgroundColor: '#d9d9d9',
        borderRadius: 20,
        paddingLeft: 15
    },
    buttonView: {
        height: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#167830',
        width: '50%',
        borderRadius: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        paddingVertical: 15
    }
})

export default styles