import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from "react";

export function useTimeout(callback: Function, delay: number): [() => void, () => void]
{
    const callBackRef: RefObject<Function> = useRef<Function>(callback);
    const timeoutRef: MutableRefObject<NodeJS.Timeout | undefined> = useRef<NodeJS.Timeout | undefined>();

    useEffect(() =>
    {
        (callBackRef.current as Function) = callback;
    }, [callback]);

    const set = useCallback<() => void>(() =>
    {
        (timeoutRef.current as NodeJS.Timeout) = setTimeout(() =>
        {
            if (callBackRef.current)
            {
                callBackRef.current();
            }
        }, delay);
    }, [delay]);

    const clear = useCallback(() =>
    {
        timeoutRef.current && clearTimeout(timeoutRef.current);
    }, []);

    useEffect(() =>
    {
        set();
        return clear;
    }, [delay, set, clear]);

    const reset = useCallback(() =>
    {
        clear();
        set();
    }, [clear, set]);

    return [reset, clear];
}
