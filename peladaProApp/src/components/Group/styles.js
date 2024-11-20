import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%',
    },
    infoView: {
        height: 'auto',
        marginVertical: 20
    },
    infoTitle: {
        backgroundColor: '#ababab',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#167830',
        paddingVertical: 20,
        textAlign: 'center'
        
    },
    infoText: {
        fontWeight: 'bold',
        paddingLeft: 20,
    },
    partidaView: {
        flex: 1,
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        paddingTop: 10
    },
    partidaText: {
        color: '#167830',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    admView: {
        height: 'auto',
        flexDirection: 'row',
        marginVertical: 60
    },
    Button: {
        width: '50%',
        paddingHorizontal: 20,
    },
    ButtonText: {
        backgroundColor: '#167830',
        color: '#ffffff',
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 10
    },
    pagamentoView: {
        height: 'auto',
        alignItems: 'center',
        marginBottom: 20
    },
    pagamentoButton: {
        width: '50%',
    },
    pagamentoButtonText: {
        backgroundColor: '#167830',
        color: '#ffffff',
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 10
    },
    goBackView: {
        height: 'auto',
        alignItems: 'center',
        marginBottom: 20
    },
    goBackButton: {
        width: '50%',
    },
    goBackButtonText: {
        backgroundColor: '#167830',
        color: '#ffffff',
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 10
    }
})

export default styles