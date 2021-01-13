const mongoose = require('mongoose');


const AnswersWhoLikes = mongoose.model('AnswersWhoLike', new mongoose.Schema({
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answer',
        required: true
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        default: null
    }
}));
module.exports = {
    AnswersWhoLikes,
}