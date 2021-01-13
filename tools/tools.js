// 打包对象
function pick(obj, keys) {
    let resultObj = {};
    keys.filter(key => key in obj).forEach(key => resultObj[key] = obj[key]);
    return resultObj;
}

// 图片压缩
const sharp = require('sharp');
const fs = require('fs');
async function compress(path, quality) {
    try {
        let { data } = await sharp(path)
            .jpeg({ quality })
            .toBuffer({ resolveWithObject: true });
        await fs.writeFileSync(path, data);
    } catch (e) {
        return e;
    }
};

// 验证 id
const joi = require('joi');

function validateId(id, errStr) {
    return joi.validate(id, joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error(errStr)))
}



module.exports = {
    pick,
    compress,
    validateId
}