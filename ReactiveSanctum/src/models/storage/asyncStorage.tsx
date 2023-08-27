export class AsyncStorageResponse<T> {
    constructor(
        public result: T,
        public lastUpdated: number
    ){}
}
