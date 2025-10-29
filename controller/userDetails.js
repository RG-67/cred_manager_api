const nodemailer = require('nodemailer');
const supabase = require('../db');


let otpStore = {};

require('dotenv').config();


const transPorter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

const getAllUser = async (req, res) => {
    try {
        const { data, error } = await supabase.from('userdetails')
            .select("*");
        if (error) {
            console.log("Supabase get users error: ", error);
            return res.status(500).json({ status: false, msg: "Failed to get users", data: [] });
        }
        res.status(200).json({ status: true, msg: "Users retrieved successfully", data: data });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: [] });
    }
}


const insertUser = async (req, res) => {
    const {
        userId,
        userPhone,
        userEmail,
        password,
        deviceId
    } = req.body;
    try {
        const { data, error } = await supabase.from('userdetails')
            .insert([
                {
                    userid: userId,
                    userphone: userPhone,
                    email: userEmail,
                    password: password,
                    deviceid: deviceId
                }
            ]).select();
        if (error) {
            console.log("Supabase insert error: ", error);
            return res.status(500).json({ status: false, msg: "Failed to insert user", data: {} });
        }
        res.status(201).json({ status: true, msg: "User insert successfully", data: data[0] });
    } catch (err) {
        console.log("Unexpected error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: {} });
    }
}


const getSingleUser = async (req, res) => {
    const { phone, email } = req.query;
    try {
        const { data, error } = await supabase.from('userdetails')
            .select().eq('userphone', phone).eq('email', email);
        if (error) {
            console.log("Supabase get user error: ", error);
            return res.status(500).json({ status: false, msg: "Failed to get user", data: {} });
        }
        if (!data || data.length === 0) return res.status(404).json({ status: false, msg: "User not found", data: {} });
        res.status(200).json({ status: true, msg: "User retrieved successfully", data: data[0] });
    } catch (err) {
        console.log("Server error: ", err);
        return res.status(500).json({ status: false, msg: "Server error", data: {} });
    }
}


const updateUser = async (req, res) => {
    const {
        internalId,
        userOldPhone,
        userPhone,
        userEmail,
        password
    } = req.body;
    try {
        const { data, error } = await supabase.from('userdetails')
            .update({
                userphone: userPhone,
                email: userEmail,
                password: password
            }).eq('internal_id', internalId).select();

        const { data: credData, error: credError } = await supabase.from('usercred')
            .update({
                userphone: userPhone
            }).eq('userphone', userOldPhone).select();

        if (error || credError) {
            console.log("Supabase update user error: ", error);
            return res.status(500).json({ status: false, msg: "Falied to update user", data: {} });
        }
        if (!data || data.length === 0 || !credData || credData.length === 0) {
            console.log("UserData: ", data);
            console.log("CredData: ", credData);
            return res.status(404).json({ status: false, msg: "User not found", data: {} });
        }

        res.status(201).json({ status: true, msg: "User updated successfully", data: data[0] });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: {} });
    }
}


const sendOtp = async (req, res) => {
    const { email } = req.query;
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;
    const mailOptions = {
        from: `Cred Manager Support ${process.env.EMAIL}`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. Expires in 5 minutes.`
    };
    try {
        await transPorter.sendMail(mailOptions);
        res.status(200).json({ status: true, msg: "OTP send to your email id" });
    } catch (error) {
        console.log("SendMailError: ", error);
        res.status(500).json({ status: false, msg: "Failed to send OTP" });
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.query;
    if (otpStore[email] && otpStore[email] == otp) {
        delete otpStore[email];
        res.status(200).json({ status: true, msg: "OTP verification successfull" });
    } else {
        res.status(404).json({ status: false, msg: "Invalid or expired otp" });
    }
}


const passwordChange = async (req, res) => {
    const { email, phone, password } = req.query;
    try {
        const { data, error } = await supabase.from('userdetails')
            .update({ 'password': password }).eq('email', email).eq('userphone', phone).select();
        if (error) {
            return res.status(500).json({ status: false, msg: "Failed to change password" });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        res.status(200).json({ status: true, msg: "Password change successfully" });
    } catch (error) {
        console.error("PasswordChangeErr: ", error);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}


module.exports = { getAllUser, insertUser, getSingleUser, updateUser, sendOtp, verifyOtp, passwordChange };