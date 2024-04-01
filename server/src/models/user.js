const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const CustomError = require("../config/errors/CustomError");

// Pull in Environment variables
const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
const RESET_PASSWORD_TOKEN = {
    expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

// create user schema
const User = mongoose.Schema;
const UserSchema = new User({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {required: true, type: String},
        }
    ],
    resetpasswordtoken: String,
    resetpasswordtokenexpiry: Date,
}) 

// set schema option
UserSchema.set("toJSON", {
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.tokens;
        return ret;
    },
});


// attach middleware
UserSchema.pre("save", async function(next) {
    try{
        if(this.isModified("password")){
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch(error){
        next(error);
    }
})


// attach custom static methods
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if(!user){
        throw new CustomError(
            "Wrong credentials!",
            400,
            "Email or password is wrong!"
        )
    }
    const passwdMatch = await bcrypt.compare(password, user.password);
    if(!passwdMatch){
        throw new CustomError(
            "Wrong credentials!",
            400,
            "Email or password is wrong!"
        )
    }
    return user;
}


// attach custom instance methods

// 1st instance method
UserSchema.methods.generateAccessToken = function(){
    const user = this;

    // create signed access token
    const accessToken = jwt.sign(
        {
            _id: user._id.toString(),
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
        },
        ACCESS_TOKEN.secret,
        {
            expiresIn: ACCESS_TOKEN.expiry,
        }
    );
    return accessToken;
}

// 2nd instance method


module.exports = UserModel;