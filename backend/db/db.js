const mongoose=require('mongoose');

 const ConnectToDatabase=async()=>{
    try{
        const conn=await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to the Database "+conn);
    }catch(error)
    {
        console.log("Failed to connect to the database "+error);
    }
}

module.exports=ConnectToDatabase;