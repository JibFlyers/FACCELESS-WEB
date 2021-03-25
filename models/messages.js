var mongoose = require('mongoose');

var MessagesSchema = mongoose.Schema({
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations' },
    from_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    to_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    date: Date,
    read: Boolean,
    // delete_user_id1: Boolean,
    // delete_user_id2: Boolean,
});

const MessagesModel = mongoose.model('messages', MessagesSchema);

module.exports = MessagesModel;