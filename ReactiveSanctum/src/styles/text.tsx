
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { MD3DarkTheme } from 'react-native-paper';



export function GetTextStyles() {


    var headerText: StyleProp<TextStyle> = {
        color : MD3DarkTheme.colors.onSurface,
        fontSize: 24,
    };

    var regularText: StyleProp<TextStyle> = {
        color : MD3DarkTheme.colors.onSurface,
        fontSize: 18,
    };

    var textNoSize: StyleProp<TextStyle> = {
        color : MD3DarkTheme.colors.onSurface,
    };

    const styles = StyleSheet.create({
        regularText: regularText,
        headerText: headerText,
        textNoSize: textNoSize,
    });

    return styles;

}
