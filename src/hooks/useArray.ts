import { useState } from "react";

export function useArray(arr: any[])
{
    const [array, setArray] = useState<any[]>(arr);

    const push = (args: any): void =>
    {
        setArray(arr => [...arr, ...args]);
    };

    const filter = (callback: any): void =>
    {
        setArray(arr => arr.filter(callback));
    };

    const update = (index: number, args: any): void =>
    {
        setArray((arr) =>
        {
            return (
                [
                    ...arr.slice(0, index),
                    ...args,
                    ...arr.slice(index + 1, arr.length - 1)
                ]
            );
        });
    };

    const remove = (index: number): void =>
    {
        setArray((arr) =>
        {
            return (
                [
                    ...arr.slice(0, index),
                    ...arr.slice(index + 1, arr.length - 1)
                ]
            );
        });
    };

    const clear = (): void =>
    {
        setArray([]);
    };

    return { array, set: setArray, push, filter, update, remove, clear };
}
