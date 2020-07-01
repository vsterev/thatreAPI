const mongoose = require('mongoose');
const playSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title !'],
        // match: [/^(\w\s?){3,}$/, 'Name should contains not less than 4 english letter, numbers, whitespase!']
    },
    description: {
        type: String,
        required: [true, 'Please enter a description !'],
        maxlength: [50, 'It is allow maximum 50 characters!']
    } || 'No description',
    imageUrl: {
        type: String,
        required: [true, 'Please add image !'],
        match: [/^(https?)\:\/\/.*/, 'Url should begin with http or https!']
    } || 'https://www.imghack/com/id?389872',
    isPublic: {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number },
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Play', playSchema);