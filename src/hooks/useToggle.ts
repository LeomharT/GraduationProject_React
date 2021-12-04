import { useState } from "react";

export default function useToggle(defaultValue: boolean): [boolean, Function]
{
    const [toggle, setToggle] = useState<boolean>(defaultValue);

    function toggleValue(value: boolean)
    {
        setToggle((prveValue: boolean) =>
        {
            return (
                typeof value === 'boolean' ? value : !prveValue
            );
        });
    }
    return [toggle, toggleValue];
}
