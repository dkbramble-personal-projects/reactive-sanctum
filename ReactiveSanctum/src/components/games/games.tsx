import React, { PureComponent } from 'react';
import { List } from 'react-native-paper';
import { Game } from '../../services/aws/api/games/models';
import { GameImage } from './cover';


interface GameRowProps {
    game: Game
}
export class GameRow extends PureComponent<GameRowProps> {
    render() {
        return <List.Item
                    key={this.props.game.id! + this.props.game.custom_title}
                    title={this.props.game.custom_title}
                    description={GetGameDescription(this.props.game)}
                    left={imageProps => GetGameImage(this.props.game, imageProps.color)}
        />;
    }
}

function GetGameImage(game: Game, color: string) {
    return <GameImage color={color} size={100} game={game} />;
}

function GetGameDescription(game: Game) {

    var description = '';
    if (game.comp_all > 0) {
        var hours = Math.floor(game.comp_all / (60 * 60));
        var minutes = Math.floor((game.comp_all % (60 * 60)) / 60);
        description += 'Est. Time: ' + hours + 'h ' + minutes + 'm';
    }

    if (game.platform) {
        if (game.comp_all > 0) {
            description += '\n';
        }
        description += 'Platform: ' + game.platform;
    }

    return description;
}
