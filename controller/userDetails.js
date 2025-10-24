const supabase = require('../db');


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
        password,
        deviceId
    } = req.body;
    try {
        const { data, error } = await supabase.from('userdetails')
            .insert([
                {
                    userid: userId,
                    userphone: userPhone,
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
    const { phone } = req.query;
    try {
        const { data, error } = await supabase.from('userdetails')
            .select().eq('userphone', phone);
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
        password
    } = req.body;
    try {
        const { data, error } = await supabase.from('userdetails')
            .update({
                userphone: userPhone,
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



module.exports = { getAllUser, insertUser, getSingleUser, updateUser };