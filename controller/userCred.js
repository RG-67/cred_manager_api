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
        description
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
                    description: description
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
    const { internalId, generatedUserId, userId, localCredId } = req.query;
    const {
        userPhone,
        deviceId,
        title,
        userName,
        password,
        description
    } = req.body;
    try {
        const { data, error } = await supabase.from('usercred')
            .update({
                userphone: userPhone,
                deviceid: deviceId,
                title: title,
                username: userName,
                password: password,
                description: description
            }).eq('internal_id', internalId).eq('generateduserid', generatedUserId)
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
    const { internalId, generatedUserId, userId, localCredId } = req.query;
    try {
        const response = await supabase.from('usercred')
            .delete().eq('internal_id', internalId).eq('generateduserid', generatedUserId)
            .eq('userid', userId).eq('local_cred_id', localCredId).select();
        if (!response.data || response.data.length === 0) return res.status(404).json({ status: false, msg: "User cred not found" });
        res.status(201).json({ status: true, msg: "User cred deleted successfully" });
    } catch (err) {
        console.log("Server error: ", err);
        res.status(500).json({ status: false, msg: "Server error" });
    }
}



module.exports = { getAllCred, insertUserCred, updateUserCred, deleteUserCred };