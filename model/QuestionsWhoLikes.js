const mongoose = require('mongoose');


const QuestionsWhoLikes = mongoose.model('questionsWhoLike', new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        default: null
    }
}));
module.exports = {
    QuestionsWhoLikes
}