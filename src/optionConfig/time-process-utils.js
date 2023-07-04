export function getNowTime(type){
    switch (type){
        case "yyyy-mm-dd hh:mm" :
            return getNowNormalAndHH_MM()
    }
}
export function getUnixOnNewDateAndProcess(type,date){
    switch (type){
        case "yyyy-mm-dd hh:mm" :
            return getUnixOnNewDateAndHH_MM(date)
    }
}

const getNowNormalAndHH_MM  = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return Date.parse(timeString)
}

const getUnixOnNewDateAndHH_MM = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}