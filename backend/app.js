//setting the dotenv to get the request dynamically
const dotenv=require('dotenv');
dotenv.config();
//setting the express js and cors
const express=require('express');
const cors=require('cors');
const app=express();
const GameRoutes=require('./routes/addgame.routes');
//connecting to the database when the server starts

const ConnectToDatabase=require('./db/db');
ConnectToDatabase();

//setting where the api can get access from
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/AddGame',GameRoutes);

app.get('/',(req,res)=>{
    res.send('Hello World');
});

module.exports=app;