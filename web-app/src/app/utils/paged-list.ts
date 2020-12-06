
export class PagedList<T> {

    constructor(
        public collection: T[],
        public count: number,
        public pageSize: number,
        public pageIndex: number
    ) {

    }
    static build<T>({ collection, count, pageSize, pageIndex }: PagedList<T>): PagedList<T> {
        return new PagedList<T>(collection, count, pageSize, pageIndex);
    }
}