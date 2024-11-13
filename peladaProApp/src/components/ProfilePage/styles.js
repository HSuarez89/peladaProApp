import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    viewHeader: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: "center",
        paddingTop: 20,
    },
    logo: {
        width: '30%', 
        resizeMode: 'contain'
    },
    logout: {
        height: '30%', 
        resizeMode: "contain",
    },
    userInfo: {
        width: "100%",
        height: "auto",
        alignItems: "center",
    },
    welcome: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 40,
        color: "#167830",
        textAlign: "center"
    },
    infoText: {
        width: "100%",
        alignItems: "flex-start",
        marginLeft: 30,
    },
    myGroups: {
        width: '100%',
        flex: 1,
        backgroundColor: '#ababab',
        paddingLeft: 20,
        paddingTop: 15,
        paddingRight: 20,
        marginTop: 30,
        borderRadius: 20
    },
    text: {
        color: '#167830',
        fontWeight: 'bold',
        marginBottom: 10
    }
})

export default styles