import sm2 from './sm-crypto/sm2'
const encryptMode = 0; //加密模式：0: C1C2C3、1: C1C3C2   
const publicUiKey = '048E17A1181A19BA6E0F6AAEDD8D71724A11437B30FC1E10F43F6325B2EB4C3C0333C5AD881002E23FDCEFC6538B3C6439D80AA12BF6E2050D42FD164DD7676419';

//加密数据
function EncryptedData(data) {
    let obj;
    if (data && (typeof data === 'string') && (data.constructor === String)) {
        obj =  '04'.concat(sm2.doEncrypt(data, publicUiKey, encryptMode));
    }
    return obj;
}

export default EncryptedData;