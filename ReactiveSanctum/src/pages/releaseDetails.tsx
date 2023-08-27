import React, { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Button, Checkbox, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { Release } from '../services/aws/api/releases/models';
import { ReleaseCoverProps, ReleaseImage } from '../components/releases/cover';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { createRelease, deleteRelease, updateRelease } from '../services/aws/api/releases/service';
import DropDownPicker from 'react-native-dropdown-picker';


interface NavProps {
    navigation: any;
    params: any
}

const newRelease: Release =  {
    releaseDate: new Date().getTime(),
};

export function ReleaseDetails(props: NavProps) {
    const theme = useTheme();
    var release: Release = props.params.release as Release ?? newRelease;

    const [title, setTitle] = React.useState(release.name);
    const [releaseDate, setReleaseDate] = React.useState(release.releaseDate ? new Date(release.releaseDate * 1000) : null);
    const [checkDate, setCheckDate] = React.useState(release.checkDate);
    const [open, setOpen] = useState(false);
    const releaseTypes = [
        {label: 'Game', value: 'Game'},
        {label: 'DLC', value: 'DLC'},
        {label: 'Music', value: 'Music'},
        {label: 'TV', value: 'TV'},
        {label: 'Movie', value: 'Movie'},
    ];
    const [type, setType] = React.useState(release?.type ?? releaseTypes[0].value);

    const onReleaseDateChange = (event: DateTimePickerEvent, selectedDate: any) => {

        if (event.type === 'dismissed'){
            setReleaseDate(null);
        } else {
            const currentDate = selectedDate as Date;
            console.log(currentDate);
            setReleaseDate(currentDate);
        }
      };

    const baseViewStyle: StyleProp<ViewStyle> = {
        backgroundColor: theme.colors.surface,
        flex: 1,
     };


    const showMode = () => {
        DateTimePickerAndroid.open({
        value: releaseDate ?? new Date(),
        onChange: onReleaseDateChange,
        mode: 'date',
        is24Hour: true,
        });
    };

    var submitText = release.id ? 'Update' : 'Create';

    var coverProps: ReleaseCoverProps = {
        color: theme.colors.onSurface,
        imageId: release.imageId,
        releaseType: release.type,
        size: 200,
        source: 'Details',
    };

    return <View style={baseViewStyle}>
            <GetDeleteButton release={release} navigation={props.navigation} color={theme.colors.onSurface} />
            <View style={{flex:4}}>
                <View style = {{ flex: 3, alignSelf: 'center' }}>
                    <ReleaseImage {...coverProps}/>
                </View>

                <View  style = {{ padding: 100, flex: 4 }}>
                    <TextInput
                        style={{ marginTop: 15 }}
                        value={title}
                        label={'Name'}
                        mode="outlined"
                        onChangeText={text => setTitle(text)}
                    />

                    <TextInput
                        style={{ marginTop: 15 }}
                        value={releaseDate?.toLocaleDateString()}
                        label={'Release Date'}
                        mode="outlined"
                        right={<TextInput.Icon forceTextInputFocus={false} icon="calendar" onPress={showMode} />}
                    />

                    <View style={{ marginTop: 15 }}>
                        <DropDownPicker
                            theme="DARK"
                            open={open}
                            value={type}
                            items={releaseTypes}
                            setOpen={setOpen}
                            setValue={setType}
                            />
                    </View>

                      <View style = {{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={{ alignSelf: 'center' }}>Check Date?</Text>
                        <Checkbox
                            status={checkDate ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setCheckDate(!checkDate);
                            }}
                            />
                      </View>

                      <Button mode="contained"  style={{ marginTop: 35 }} onPress={async () => {
                        var updatedRelease = release;

                        release.name = title;
                        release.type = type;
                        release.checkDate = checkDate;

                        if (releaseDate) {
                            release.releaseDate = Math.round(releaseDate.getTime() / 1000);
                        }

                        var response = release.id ? await updateRelease(updatedRelease) : await createRelease(updatedRelease);

                        if (response) {
                            props.navigation.goBack();
                        }
                      }
                     }>{submitText}</Button>

                </View>

            </View>
            <View style={{flex: 1}}/>
        </View>;
}

interface DeleteProps {
    release: Release, color: string, navigation: any
}

function GetDeleteButton(props: DeleteProps) {
    if (props.release.id){
        return <IconButton
            icon="delete"
            iconColor={props.color}
            size={35}
            style={{alignSelf:'flex-end', marginTop: 15, marginRight:15}}
            onPress={async () => {
                if (props.release.id){
                    var result = await deleteRelease(props.release);
                    if (result) {
                        props.navigation.goBack();
                    }
                }

            }}
        />;
    } else {
        return <></>;
    }

}
