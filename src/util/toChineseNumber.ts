interface ChineseNumConfig
{
    [key: string]: any;
    CN_num: string[];
    CN_unit: string[];
    level: string[];
}


const config: ChineseNumConfig = {
    CN_num: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
    CN_unit: ['', '拾', '佰', '仟'],
    level: ['', '萬', '億', '兆'],
};

const NumToText = (num: string | number) =>
{
    if (typeof num === 'string')
    {
        num = Number.parseFloat(num);
    }
    const numbers = num.toFixed(2).split(".");

    const integer = numbers[0].split('');

    const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split('');

    return { integer, decimal };
};

const toChineseNum = (num: string | number) =>
{
    const { integer, decimal } = NumToText(num);

    const levels = integer.reverse().reduce((prve: string[][], curr: string, index: number) =>
    {
        //没装满四个就继续装,装满了就变为一个空数组
        const level: string[] = prve[0] && prve[0].length < 4 ? prve[0] : [];
        //判断数字是否为0,不为0则添加上单位
        const value = curr === '0' ? config.CN_num[Number.parseInt(curr)] : config.CN_num[Number.parseInt(curr)] + config.CN_unit[index % 4];

        level.unshift(value);

        if (level.length === 1)
        {
            prve.unshift(level);
        } else
        {
            prve[0] = level;
        }
        return prve;
    }, []);
    const _integer = levels.reduce((prve, curr, index) =>
    {
        let _level = config.level[levels.length - index - 1];

        //连续两个零的话换为一个零
        let items = curr.join('').replace(/(零)\1+/g, '$1');

        if (items === '零')
        {
            _level = '';
            items = '';
        }
        if (items[items.length - 1] === '零')
        {
            items = items.slice(0, items.length - 1);
        }

        return prve + items + _level;
    }, '');

    const _decimal = decimal.map((v, index) =>
    {
        const unit = ['分', '角'];

        const _unti = v !== '0' ? unit[unit.length - index - 1] : '';

        return `${config.CN_num[Number.parseInt(v)]}${_unti}`;
    }).join('');

    return `${_integer}${_decimal || '整'}`;
};
export default toChineseNum;
