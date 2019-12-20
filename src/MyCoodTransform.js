import coordtransform from 'coordtransform';

const bd09ToGcj02 = coordtransform.bd09togcj02;
const gcj02ToBd09 = coordtransform.gcj02tobd09;
const wgs84ToGcj02 = coordtransform.wgs84togcj02;

const toGcj02 = function (location,oriType) {
    let ret = null;
    if(oriType==='bd09') {
        ret = bd09ToGcj02(location.lng,location.lat)
    }
    else if(oriType==='wgs84')
        ret =  wgs84ToGcj02(location.lng,location.lat)
    return {lng:ret[0],lat:ret[1]}
}
const toBd09 = function (location,oriType) {
    let ret = null;
    if(oriType==='gcj02') {
        ret = gcj02ToBd09(location.lng,location.lat)
    }
    return {lng:ret[0],lat:ret[1]}
}

export {toGcj02,toBd09};
