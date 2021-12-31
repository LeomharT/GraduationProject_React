export default class TimeUtil
{
    static Sleep = async (time: number) => new Promise((reslove, reject) => { setTimeout((reslove), time); });
}
