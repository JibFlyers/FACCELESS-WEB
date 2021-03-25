var mongoose = require('mongoose');

var SignalementSchema = mongoose.Schema({
    type: String,
    reason: String,
    user_emitter_id: String,
    user_receiver_id: String,
});

const SignalementModel = mongoose.model('signalements', SignalementSchema);

module.exports = SignalementModel;