import React, { PureComponent } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Game } from '../../services/aws/api/games/models';

export interface GameCoverProps {
    color: string;
    size: number;
    game: Game
}

const gameListStyles = StyleSheet.create({
    gameImage: {
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 10,
      height: 125,
      width: 125,
    },
    placeholderImage: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
});

export function GetImageStyle(isPlaceHolder: boolean): StyleProp<ImageStyle> {
    return isPlaceHolder ? gameListStyles.placeholderImage : gameListStyles.gameImage;
}

export class GameImage extends PureComponent<GameCoverProps> {
    render() {
        if (this.props.game.game_image) {
            return <Image resizeMode="contain" style={GetImageStyle(false)} source={{uri: this.props.game.game_image} }/>;
        } else {
            return <Ionicons name={'game-controller-outline'} style={GetImageStyle(true)} size={this.props.size} color={this.props.color} />;
        }
    }
}

