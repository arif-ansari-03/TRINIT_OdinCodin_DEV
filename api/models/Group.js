const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupID:{
        type: String,
        unique: true,
        required: true
    },
    users:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ]
});

module.exports = mongoose.model("Group", groupSchema);