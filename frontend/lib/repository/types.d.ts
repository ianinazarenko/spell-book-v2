export type QueryParams = Record<string, string> | null;
export type BodyObj = Record<string, string | number | boolean | null> | null;

export interface FetchParams {
    route?: string;
    method?: 'GET' | 'POST' | 'DELETE';
    query?: QueryParams;
    body?: BodyObj;
    errorMessage?: string;
}
