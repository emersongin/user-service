const mongooseModule = require('mongoose');
const mongooseSchema = mongooseModule.Schema;

const SchemaOptions = {
    timestamps: true
};

const userSchema = new mongooseSchema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "Username is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    }
}, SchemaOptions);

module.exports = mongooseModule.model('User', userSchema);