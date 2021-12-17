const chineseNumberArr: string[] = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
const unit: string[] = ["", "拾", "佰", "仟"];
const level: string[] = ['', '萬', '億'];

/**
 * @param num 需要转化的数字或者字符串
 * @returns
 */
const ConverNumToStr = (num: number | string): { integer: string[], decimal: string[]; } =>
{
    if (typeof num === 'string')
    {
        num = parseFloat(num);
    }
    //将数字拆分为两个数组(如果有的话).[0].[1]
    const numbers = num.toFixed(2).split('.');
    //小数点之前的数
    const integer = numbers[0].split('');
    //小数点之后的数
    const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split('');
    return ({ integer, decimal });
};

const toChineseNumber = (num: string | number) =>
{
    const { integer, decimal } = ConverNumToStr(num);
    const levels = integer.reverse().reduce((pre: string[], curr: string, index: number) =>
    {
        let level = pre[0] && pre[0].length < 4 ? pre[0] : [];

        let value = curr === '0'
            ? chineseNumberArr[Number.parseInt(curr)]
            : chineseNumberArr[Number.parseInt(curr)] + unit[index % 4];

        (level as any[]).unshift(value);

        if (level.length === 1)
        {
            pre.unshift(level as string);
        } else
        {
            pre[0] = level as string;
        }
        return pre;
    }, []);
    const _integer = levels.reduce((pre: string, item: string | string[], index: number) =>
    {
        let _level = level[levels.length - index - 1];
        let _item = (item as string[]).join("").replace(/(零)\1+/g, "$1");;
        if (_item === "零")
        {
            _item = "";
            _level = "";

            // 否则如果末尾为零字，则去掉这个零字
        } else if (_item[_item.length - 1] === "零")
        {
            _item = _item.slice(0, _item.length - 1);
        }
        return pre + _item + _level;
    }, "");
    let _decimal = decimal.map((item: string, index: number) =>
    {
        const unit = ["分", "角"];
        const _unit = item !== "0" ? unit[unit.length - index - 1] : "";

        return `${chineseNumberArr[Number.parseInt(item)]}${_unit}`;
    })
        .join("");
    return `${_integer}元` + (_decimal || "整");
};


export default toChineseNumber;
