const sharp = require('sharp');
const fs = require('fs');

module.exports = async (req, res, next) => {
    fs.access("./images", (error) => {
        if (error) {
            fs.mkdirSync("./images");
        }
    });
    if (!req.file) {
        return next();
    }
    try {
        const { buffer, originalname } = req.file;
        const timeStamp = Date.now();
        const fileName = originalname.split(' ').join('_').split('.')[0];
        const ref = `${timeStamp}-${fileName}.webp`;
        await sharp(buffer).webp().toFile("./images/" + ref);
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${ref}`;
        req.body.imageUrl = imageUrl;
        next();
    } catch (error) {
        res.status(400).json({ error });
    }
};