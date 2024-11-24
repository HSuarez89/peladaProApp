import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        width: '100%'
    },
    titleView: {
        height: 'auto',
        marginVertical: 20
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#167830',
        textAlign: 'center'
    },
    listView: {
        flex: 1,
        backgroundColor: '#ababab',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 15
    },
    flatList: {
        flexDirection: 'row',
    },
    flatListItem: {
        width: '35%',
        backgroundColor: '#c9c9c9',
        textAlign: 'center'
    }
})

export default styles