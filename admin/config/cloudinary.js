const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

module.exports ={
    uploadSingle: async function (file, folder) {
        const res = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
            resource_type: "auto",
            folder: folder,
        });
        return res;
    },

    uploadMultiple: async function(files, folder) {
        const uploads = files.map((file) =>
            cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
                resource_type: "image",
                folder: folder,
            })
        );
        return Promise.all(uploads); // Wait for all uploads to complete
    },

    reSizeImage: (id, h, w) => {
        return cloudinary.url(id, {
            height: h,
            width: w,
            crop: 'scale',
            format: 'jpg'
        })
    },
} 