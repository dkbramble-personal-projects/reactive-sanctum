import { RetrieveData, StoreData } from '../../../storage/asyncStorage';
import { deleteRequest, getRequest, patchRequest, putRequest } from '../base/service';
import { RELEASE_STORAGE_KEY, Release, ReleaseResponse, ReleasesResponse } from './models';
import _ from 'lodash';


const BASE_RELEASES_URL = '/releases';

export const getReleases = async (forceRetrieve: boolean): Promise<Release[]> => {

    if (!forceRetrieve){
        var storedResult = await RetrieveData<Release[]>(RELEASE_STORAGE_KEY);

        if (storedResult != null) {
            var lastUpdated = storedResult.lastUpdated;
            var currentTime = new Date().getTime();
            var minuteDiff = ((currentTime - lastUpdated) / 1000) / 60;

            if (minuteDiff < 60 * 24) {
                console.log('Returning stored release data');
                return storedResult.result;
            }
        }
    }

    var result = await getRequest<ReleasesResponse>(BASE_RELEASES_URL);
    if (!result || result.releases.length < 1)  {
        return [];
    }

    await StoreData<Release[]>(RELEASE_STORAGE_KEY, result!.releases);

    //For some release date parsing issues
    result!.releases.forEach(function (release) {
        if (release.releaseDate && release.checkDate){
            release.releaseDate += 18000;
        }
    });

   return result!.releases;
};

export const createRelease = async (newRelease: Release): Promise<Release | null> => {

    var result = await putRequest<ReleaseResponse>(BASE_RELEASES_URL, JSON.stringify(newRelease));

    var isPopulated = result && result.release;
    if (isPopulated) {
        var storedResult = await RetrieveData<Release[]>(RELEASE_STORAGE_KEY);

        if (storedResult != null) {
            var listToUpdate = storedResult.result;
            var updatedList = listToUpdate.concat([result!.release]);

            await StoreData<Release[]>(RELEASE_STORAGE_KEY, updatedList);
        }
    }


    return isPopulated ? result!.release : null;
};

//
export const updateRelease = async (releaseToUpdate: Release): Promise<boolean> => {
    var result = await patchRequest(BASE_RELEASES_URL + '/' + releaseToUpdate.id, JSON.stringify(releaseToUpdate));
    if (result){
        var storedResult = await RetrieveData<Release[]>(RELEASE_STORAGE_KEY);

        if (storedResult != null) {
            var listToUpdate = storedResult.result;
            _.remove(listToUpdate, (item) => item.id === releaseToUpdate.id);
            var updatedList = listToUpdate.concat([releaseToUpdate]);

            await StoreData<Release[]>(RELEASE_STORAGE_KEY, updatedList);
        }
    }

    return result;
};

export const deleteRelease = async (releaseToDelete: Release): Promise<boolean> => {
    var result = await deleteRequest(BASE_RELEASES_URL + '/' + releaseToDelete.id);
    if (result){
        var storedResult = await RetrieveData<Release[]>(RELEASE_STORAGE_KEY);

        if (storedResult != null) {
            var listToUpdate = storedResult.result;
            _.remove(listToUpdate, (item) => item.id === releaseToDelete.id);

            await StoreData<Release[]>(RELEASE_STORAGE_KEY, listToUpdate);
        }
    }

    return result;
};
