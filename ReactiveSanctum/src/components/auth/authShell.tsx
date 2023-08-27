import React from 'react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { getAWSAuthStatusOrLogin } from '../../services/aws/auth/service';
import { LoginPage } from '../../pages/loginPage';
import { StyleProp, ViewStyle, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const AuthShell = (props: PropsWithChildren) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  var theme = useTheme();

  useEffect(() => {
    getAWSAuthStatusOrLogin(false).then((isLoggedIn) => {
      console.log('IsLoggedIn: ' + isLoggedIn);
      setIsAuthed(isLoggedIn);
      setIsInitialized(true);
    });
  }, []);

  const baseViewStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.colors.surface,
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
};


  if (!isInitialized){ return <View style={baseViewStyle}/>;}
  if (!isAuthed) {return <LoginPage setIsAuthed={setIsAuthed}/>;}

  return props.children;
};
