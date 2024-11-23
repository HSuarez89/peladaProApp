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
        paddingTop: 10,
        marginBottom: 20
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
        marginBottom: 20,
        alignItems: 'center',
        
    },
    goBackButton: {
        width: '50%',
        marginBottom: 30,
        alignItems: 'center',
        backgroundColor: '#167830',
        borderRadius: 10,
    },
    goBackButtonText: {
        color: '#ffffff',
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
      },
      leaveGroupView: {
        height: 'auto',
        marginBottom: 20,
        alignItems: 'center'
      },
      leaveGroupButton: {
        width: '50%',
      },
      leaveGroupButtonText: {
        backgroundColor: '#BA0000',
        color: '#ffffff',
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: 10
      },
      partidaButton: {
        marginTop: 20,
        flexDirection: 'row',
        height: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: 5
      },
      partidaButtonText: {
        width: '30%',
        textAlign: 'center',
        paddingVertical: 15,
        fontWeight: 'bold',
      }   
})

export default styles