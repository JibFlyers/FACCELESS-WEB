var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    token: String,
    email : String,
    password : String,
    pseudo: String,
    birthDate : Date,
    subscriptionDate: Date,
    is_adult: Boolean,
    problems_types: [String],
    problem_description: String,
    localisation: Object,
    gender : String,
    avatar : String,
    statut: String,
    blocked_user_id: [String],
    blocked_by_id: [String],
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;