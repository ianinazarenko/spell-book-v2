export type QueryParams = Record<string, string> | null;
export type BodyObj = object | null;

export interface FetchParams<T = BodyObj> {
    route?: string;
    method?: 'GET' | 'POST' | 'DELETE';
    query?: QueryParams;
    body?: BodyObj;
    errorMessage?: string;
}
