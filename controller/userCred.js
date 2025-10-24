const supabase = require('../db');


const getAllCred = async (req, res) => {
    const { generatedUserId, userId } = req.query;
    try {
        const { data, error } = await supabase.from('usercred')
            .select("*").eq('generateduserid', generatedUserId)
            .eq('userid', userId);
        if (error) {
            console.log("Supabase getAllCred error: ", error);
            return res.status(500).json({ status: false, msg: "Failed to get users cred", data: [] });
        }
        if (!data || data.length === 0) return res.status(201).json({ status: true, msg: "Users cred not found", data: [] });
        res.status(201).json({ status: true, msg: "Users cred retrieved successfully", data: data });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: [] });
    }
}


const insertUserCred = async (req, res) => {
    const {
        localCredId,
        generatedUserId,
        userId,
        userPhone,
        deviceId,
        title,
        userName,
        password,
        description,
        created_at,
        updated_at
    } = req.body;

    try {
        const { data, error } = await supabase.from('usercred')
            .insert([
                {
                    local_cred_id: localCredId,
                    generateduserid: generatedUserId,
                    userid: userId,
                    userphone: userPhone,
                    deviceid: deviceId,
                    title: title,
                    username: userName,
                    password: password,
                    description: description,
                    created_at: created_at,
                    updated_at: updated_at
                }
            ]).select();
        if (error) {
            console.log("Supabase insert user cred failed: ", error);
            return res.status(500).json({ status: false, msg: "Failed to insert user cred", data: {} });
        }
        res.status(201).json({ status: true, msg: "User cred insert successfully", data: data[0] });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: {} });
    }
}


const updateUserCred = async (req, res) => {
    const { generatedUserId, userId, localCredId, created_at } = req.query;
    const {
        userPhone,
        deviceId,
        title,
        userName,
        password,
        description,
        updated_at
    } = req.body;
    try {
        const { data, error } = await supabase.from('usercred')
            .update({
                userphone: userPhone,
                deviceid: deviceId,
                title: title,
                username: userName,
                password: password,
                description: description,
                updated_at: updated_at
            }).eq('created_at', created_at).eq('generateduserid', generatedUserId)
            .eq('userid', userId).eq('local_cred_id', localCredId).select();
        if (error) {
            console.log("Supabase user cred update error: ", error);
            return res.status(500).json({ status: false, msg: "Failed to update user cred", data: {} });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ status: false, msg: "User cred not found", data: {} });
        }
        res.status(201).json({ status: false, msg: "User cred update successfully", data: data[0] });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error", data: {} });
    }
}


const deleteUserCred = async (req, res) => {
    const { generatedUserId, userId, localCredId, createdAt, updatedAt } = req.query;
    try {
        const response = await supabase.from('usercred')
            .delete().eq('generateduserid', generatedUserId)
            .eq('userid', userId).eq('local_cred_id', localCredId).eq('created_at', createdAt)
            .eq('updated_at', updatedAt).select();
        if (!response.data || response.data.length === 0) return res.status(404).json({ status: false, msg: "User cred not found" });
        res.status(201).json({ status: true, msg: "User cred deleted successfully" });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}



module.exports = { getAllCred, insertUserCred, updateUserCred, deleteUserCred };