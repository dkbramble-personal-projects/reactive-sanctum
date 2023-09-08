import React, { PureComponent } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BASE_URL = 'https://images.igdb.com/igdb/image/upload/t_original/';

export interface ReleaseCoverProps {
    color: string;
    size: number;
    imageId: string | null | undefined;
    releaseType: string | undefined;
    source: string;
}

const releaseListStyles = StyleSheet.create({
    releaseImage: {
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 10,
      height: 125,
      width: 100,
    },
    placeholderImage: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 100,
        width: 100,
    },
});

const releaseDetailStyles = StyleSheet.create({
    releaseImage: {
      height: 250,
      width: 200,
      alignContent:'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    placeholderImage: {
        height: 200,
        width: 200,
        alignContent:'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});

export function GetImageStyle(isPlaceHolder: boolean, source: string): StyleProp<ImageStyle> {
    switch (source) {
        case 'List':
            return isPlaceHolder ? releaseListStyles.placeholderImage : releaseListStyles.releaseImage;
        case 'Details':
            return isPlaceHolder ? releaseDetailStyles.placeholderImage : releaseDetailStyles.releaseImage;
        default:
            return isPlaceHolder ? releaseListStyles.placeholderImage : releaseListStyles.releaseImage;
      }
}


function GetPlaceHolderImage(props: ReleaseCoverProps): React.ReactNode {
    var iconName: string;
    switch (props.releaseType) {
        case 'Game':
        case 'DLC':
            iconName = 'game-controller-outline';
            break;
        case 'Music':
            iconName = 'play-outline';
            break;
        case 'TV':
            iconName = 'tv-outline';
            break;
        case 'Movie':
            iconName = 'film-outline';
            break;
        default:
            iconName = '';
            break;
      }
      if (iconName === '') {
        return <View/>;
      }

    return <Ionicons name={iconName} style={GetImageStyle(true, props.source)} size={props.size} color={props.color} />;
}

export class ReleaseImage extends PureComponent<ReleaseCoverProps> {
    render() {
        if (this.props.imageId) {
            var url = BASE_URL + this.props.imageId + '.jpg';
            return <Image resizeMode="contain"  style={GetImageStyle(false, this.props.source)} source={{uri: url} }/>;
        } else {
            return GetPlaceHolderImage(this.props);
        }
    }
}

export class ReleaseImageWithProps extends PureComponent<ReleaseCoverProps> {
    render() {
        if (this.props.imageId) {
            var url = BASE_URL + this.props.imageId + '.jpg';
            return <Image resizeMode="contain"  style={GetImageStyle(false, this.props.source)} source={{uri: url} }/>;
        } else {
            return GetPlaceHolderImage(this.props);
        }
    }
}

