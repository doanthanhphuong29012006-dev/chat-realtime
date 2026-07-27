const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
// End Config Cloudinary

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = async (buffer) => {
    if (!buffer) return null; 

    try {
        let result = await streamUpload(buffer);
        return result.secure_url;
    } catch (error) {
        console.error("Lỗi khi upload lên Cloudinary:", error);
        return null;
    }
}