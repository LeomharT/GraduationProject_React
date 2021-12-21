import nProgress from "nprogress";

interface FetchParams
{
    url: string,
    method?: string,
    headers?: any,
    body?: BodyInit,
}

const IFetch = async <T>({ url, method = 'GET', headers, body }: FetchParams): Promise<T | string> =>
{
    let response: Promise<T | string>;
    nProgress.start();
    try
    {
        response = (await fetch(url, {
            method,
            headers,
            body
        })).json() as Promise<T>;
    } catch (e)
    {
        response = (await fetch(url, {
            method,
            headers,
            body
        })).text() as Promise<string>;
    }
    nProgress.done();
    return response;
};
export default IFetch;
