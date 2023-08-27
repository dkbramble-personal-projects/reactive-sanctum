import React from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import { useTheme, FAB, Searchbar } from 'react-native-paper';
import { GetReleaseList } from '../components/releases/releaseList';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReleaseDetails } from './releaseDetails';
import { NavProps } from '../models/navigation/navProps';

const ReleasesStack = createNativeStackNavigator();

export function Releases(navProps: NavProps) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query: NativeSyntheticEvent<TextInputChangeEventData>) => setSearchQuery(query.nativeEvent.text);
    const onClearSearch = () => setSearchQuery('');

    const fabStyle = StyleSheet.create({
        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        },
      });

    const baseViewStyle = { backgroundColor: theme.colors.surface, flex: 1 };
    return <View style={baseViewStyle} >
                <Searchbar style={{ marginTop: 20, marginHorizontal: 15}} placeholder="Search" onChange={onChangeSearch} onClearIconPress={onClearSearch} value={searchQuery}/>
                <GetReleaseList navProps={navProps} searchQuery={searchQuery}/>
                <FAB
                    icon="plus"
                    style={fabStyle.fab}
                    size="medium"
                    onPress={() => navProps.navigation.navigate('Details', { release: {} } )}
                />
            </View>;
}


export function ReleasesCore() {
    return  <ReleasesStack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                >
                    <ReleasesStack.Screen name="Home" >
                        {(props) => <Releases {...props} />}
                    </ReleasesStack.Screen>
                    <ReleasesStack.Screen name="Details" options={{ animation: 'slide_from_right'}}>
                        {(props) => <ReleaseDetails navigation={props.navigation} params={props.route.params}/>}
                    </ReleasesStack.Screen>
                </ReleasesStack.Navigator>;
}

