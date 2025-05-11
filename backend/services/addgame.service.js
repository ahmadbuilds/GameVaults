const AddGame = require('../models/addgame.model');

module.exports.RegisterGame = async({
    title,
    notes,
    status,
    priority,
    format,
    platform,
    region,
    userEmail
}) => {
    if(!title || !status || !priority || !format || !platform || !region || !userEmail) {
        throw new Error("All Fields are required");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        throw new Error("Invalid email format");
    }

    const NewGame = await AddGame.create({
        title,
        notes,
        status,
        priority,
        format,
        platform,
        region,
        userEmail
    });

    return NewGame;
};