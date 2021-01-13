const { compress } = require('../../../tools/tools');
const rmFile = require('util').promisify(require('fs').unlink);
module.exports = async (req, res) => {
    try {
        let imgArr = {};
        for (let index in req.files) {
            imgArr[index] = await processFile(req.files[index]);
        }
        res.send(imgArr);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

};
async function processFile(file) {
    // 判断文件是否为空
    if (file.size == 0) {
        // 删除空文件
        try {
            await rmFile(file.path);
        } catch (error) { console.log('图像删除失败：', error); }
        return '';
    } else {
        // 压缩新文件
        const error = compress(file.path, 50);
        if (!(error instanceof Promise)) console.log('图像压缩失败：', error);
        return file.path.split('public')[1];
    }
}