//setting the dotenv to get the request dynamically
const dotenv=require('dotenv');
dotenv.config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

//setting the express js and cors
const express=require('express');
const cors=require('cors');
const app=express();
const GameRoutes=require('./routes/addgame.routes');
const collectionRoutes = require('./routes/collection.routes');
const PlatformRoutes=require('./routes/platform.routes');  // Added platform routes
//connecting to the database when the server starts
const ConnectToDatabase=require('./db/db');
ConnectToDatabase();

//setting where the api can get access from
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/AddGame', GameRoutes);
app.use('/collections', collectionRoutes);
app.use('/platform', PlatformRoutes);  // Added platform routes middleware

app.get('/',(req,res)=>{
    res.send('Hello World');
});

module.exports=app;