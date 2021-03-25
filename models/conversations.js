var mongoose = require('mongoose');

var ConversationsSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  // archived: Boolean,
  // delete: Boolean,
  demand: Boolean,
});

const ConversationsModel = mongoose.model('conversations', ConversationsSchema);

module.exports = ConversationsModel;