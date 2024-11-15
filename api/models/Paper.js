const mongoose = require("mongoose");
const Question = require("./Question")
const paperSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    GroupID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group',
    },
    paperTitle:{
        type: String,
        required: true
    },
    TimeLimit : {
        type: Number,
        required: true
    },
    sharedWith:[],
    questions: [],
    answers: [],
    optionImages: [],
    Private: {
        type: Boolean,
        default: true
    },
    attemptedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes_users:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes_users:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model("Paper", paperSchema);