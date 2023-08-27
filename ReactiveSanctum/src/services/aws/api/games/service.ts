
import { RetrieveData, StoreData } from '../../../storage/asyncStorage';
import { getRequest } from '../base/service';
import { GAMES_STORAGE_KEY, Game, GameListResponse } from './models';

const BASE_RELEASES_URL = '/games';

export const getGamesList = async (listType: string, forceUpdate: boolean): Promise<Game[]> => {
    var storedResult = await RetrieveData<Game[]>(GAMES_STORAGE_KEY + '/' + listType);

    if (!forceUpdate){
        if (storedResult != null) {
            var lastUpdated = storedResult.lastUpdated;
            var currentTime = new Date().getTime();
            var minuteDiff = ((currentTime - lastUpdated) / 1000) / 60;

            if (minuteDiff < 60 * 24) {
                console.log('Returning stored games data');
                return storedResult.result;
            }
        }
    }

    var result = await getRequest<GameListResponse>(BASE_RELEASES_URL + '/list?listType=' + listType);
    if (!result || result.games.length < 1)  {
        return [];
    }

    await StoreData<Game[]>(GAMES_STORAGE_KEY + '/' + listType, result!.games);

    return result!.games;
};

