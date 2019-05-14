module.exports = (timestamp) => {
    let interval = ( Date.parse(new Date()) - Date.parse(timestamp) ) / 1000;
    if (interval < 3600) {
        return '刚刚';
    }
    if ((interval/3600) < 24) {
        return parseInt(interval/3600) + '小时前';
    }
    if ((interval/86400) < 8) {
        return parseInt(interval/86400) + '天前';
    }
    return timestamp.getFullYear() + '.' + (timestamp.getMonth()+1) + '.' + timestamp.getDate();
};
