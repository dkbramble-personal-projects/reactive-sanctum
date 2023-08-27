import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Game } from '../services/aws/api/games/models';
import { getGamesList } from '../services/aws/api/games/service';
import { GameRow } from '../components/games/games';
import DropDownPicker from 'react-native-dropdown-picker';
import _ from 'lodash';

export function GamesList() {
    const theme = useTheme();
    const baseViewStyle = { backgroundColor: theme.colors.surface, flex: 1 };

    const [games, setGames] = useState<Game[]>([]);
    const [listType, setListType] = useState('playing');
    const [open, setOpen] = useState(false);
    const items = [
        {label: 'Playing', value: 'playing'},
        {label: 'Backlog', value: 'backlog'},
        {label: 'Replays', value: 'replays'},
        {label: 'Completed', value: 'completed'},
        {label: 'Upcoming', value: 'custom'},
        {label: 'Scraps', value: 'custom2'},
        {label: 'Waiting On', value: 'custom3'},
        {label: 'Retired', value: 'retired'},
    ];
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        RefreshGames(false, listType, setGames);
    }, [listType]);

    return <View style={baseViewStyle} >
            <View style={{ marginTop: 25, marginHorizontal: 25}}>
            <DropDownPicker
                theme="DARK"
                open={open}
                value={listType}
                items={items}
                setOpen={setOpen}
                setValue={setListType}
                />
            </View>
         <FlatList
                onRefresh={async () =>  {
                    setIsRefreshing(true);
                    await RefreshGames(true, listType, setGames);
                    setIsRefreshing(false);
                } }
                refreshing={isRefreshing}
                data={games}
                renderItem={(row) => <GameRow game={row.item} />}
                keyExtractor={(item, index) => item.custom_title + index}
        />
    </View>;
}

async function RefreshGames(
    forceRefresh: boolean,
    listType: string,
    setGamesFunc: (value: React.SetStateAction<Game[]>) => void,
    ) {
    await getGamesList(listType, forceRefresh).then((result) => setGamesFunc(listType !== 'completed' ? _.sortBy(result, (game) => game.comp_all) : result));
}
