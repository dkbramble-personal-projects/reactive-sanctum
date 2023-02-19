import {IGDB_CLIENT_ID, IGDB_CLIENT_SECRET} from '@env';
import {GetReleases} from '@dkbramble-personal-projects/sanctum-core';

export const GetGameRelease = (): string | undefined => {
  return GetReleases(IGDB_CLIENT_ID, IGDB_CLIENT_SECRET);
};
