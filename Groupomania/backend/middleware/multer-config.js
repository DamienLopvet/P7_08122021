const multer = require('multer');

//allowing those extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'video/mp4':'mp4',

};

//create and config the storage path
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
    callback(null, 'attachments');
  },

  //config filename
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//set files size limit to 30 mb

module.exports = multer({storage: storage, limits: {
  fileSize: 30000000 // 30000000 Bytes = 30 MB
  }}).single('attachmentUrl');