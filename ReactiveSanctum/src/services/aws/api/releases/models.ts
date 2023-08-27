
export interface Release {
    id?: string,
    name?: string;
    type?: string;
    releaseDate?: number | null;
    checkDate?: boolean;
    imageId?: string | null
}

export interface ReleasesByTime {
    timeTitle: string,
    data: Release[],
}

export interface ReleasesResponse {
    releases: Release[],
}

export interface ReleaseResponse {
    release: Release,
}

export const RELEASE_STORAGE_KEY: string = 'releases';
