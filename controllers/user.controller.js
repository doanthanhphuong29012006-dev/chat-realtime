const User = require('../models/user.model');

const uploadToCloudinaryHelper = require('../helpers/uploadToCloudinary');

// [GET]/user/edit
module.exports.edit = (req, res) => {
    res.render('pages/user/edit', {
        pageTitle: "Thông tin cá nhân"
    });
}

// [PATCH]/user/edit
module.exports.editPatch = async (req, res) => {
    if (req.file) {
        const link = await uploadToCloudinaryHelper(req.file.buffer);
        req.body.avatar = link;
    }
    
    const userId = res.locals.user.id;
    await User.updateOne({ _id: userId }, req.body);

    const currentUrl = req.get('Referer');
    res.redirect(currentUrl);
}

