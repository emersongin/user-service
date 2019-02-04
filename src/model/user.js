const mongooseModule = require('mongoose');
const mongooseSchema = mongooseModule.Schema;

const SchemaOptions = {
    timestamps: true
};

const cardSchema = new SchemaMongoose({
    cvv: {
        type: String
    },
    limit: {
        type: String
    }
});
const documentSchema = new SchemaMongoose({
    type: {
        type: String
    },
    identifier: {
        type: String
    },
    complement: {
        type: String
    }
});
const contactSchema = new SchemaMongoose({
    code: {
        type: Number
    },
    prefix: {
        type: Number
    },
    phone: {
        type: Number
    }
});
const addressSchema = new SchemaMongoose({
    postalCode: {
        type: String
    },
    addressType: {
        type: String
    },
    address: {
        type: String
    },
    number: {
        type: Number
    },
    district: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    complement: {
        type: String
    }
});
const userDataSchema = new SchemaMongoose({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    nickName: {
        type: String
    },
    gender: {
        type: String
    },
    birthday: {
        type: Date
    },
    email: {
        type: String
    },
    creatAt: {
        type: Date
    },
    address: [addressSchema],
    contact: [contactSchema],
    docs: [documentSchema],
    cards: [cardSchema]
});
const userSchema = new SchemaMongoose({
    username: {
        type: String
    },
    password: {
        type: String
    },
    access: {
        type: Number
    },
    data: [userDataSchema]
}, SchemaOptions);

module.exports = mongooseModule.model('User', userSchema);

/*

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

*/