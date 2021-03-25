var mongoose = require('mongoose');

var DeletedUserSchema = mongoose.Schema({
    id: String,
    email : String,
});

const DeletedUserModel = mongoose.model('DeletedUsers', DeletedUserSchema);

module.exports = DeletedUserModel;