import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { getAWSAuthStatusOrLogin } from '../services/aws/auth/service';

interface LoginProps {
    setIsAuthed: (value: React.SetStateAction<boolean>) => void
}
export function LoginPage(props: LoginProps) {
    var theme = useTheme();

    const baseViewStyle: StyleProp<ViewStyle> = {
        backgroundColor: theme.colors.surface,
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
    };


    return <View style={baseViewStyle} >
        <Button style={{ marginHorizontal: 100}} mode="contained" onPress={() => {
            getAWSAuthStatusOrLogin(true).then((isLoggedIn) => {props.setIsAuthed(isLoggedIn); } );
        }}>Login</Button>
    </View>;
}



