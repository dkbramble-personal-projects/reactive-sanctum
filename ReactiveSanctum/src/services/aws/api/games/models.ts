
export interface Game {
    readonly id: number,
    readonly custom_title: string,
    readonly play_storefront: string,
    readonly platform: string,
    readonly game_image: string,
    readonly game_id: number,
    readonly game_type: string,
    readonly comp_all: number
}

export interface GameListResponse {
    readonly games: Game[]
}


export const GAMES_STORAGE_KEY: string = 'games';
