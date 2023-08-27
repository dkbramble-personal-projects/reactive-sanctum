import React from 'react';
import { AuthShell } from './src/components/auth/authShell';
import { NavigationContainer} from '@react-navigation/native';
import { NavigationTabs } from './src/components/navigation/tabs';
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

function App(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <AuthShell>
          <NavigationContainer>
            <NavigationTabs/>
          </NavigationContainer>
      </AuthShell>
    </PaperProvider>
  );
}

export default App;
