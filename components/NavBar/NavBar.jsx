import { Button, StyleSheet, View } from "react-native"


export const NavBar = () => {
    return(
        <View style={styleNavBar.nav}>
            <Button title="Generator" />
            <Button title="History" />
        </View>
    )
}

const styleNavBar = StyleSheet.create({
    nav: {
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        marginBottom: '1vh'
    },
    button: {
        
    },
});