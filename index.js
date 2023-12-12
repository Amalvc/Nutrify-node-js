const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userModel = require('./Models/userModel');

mongoose.connect('mongodb://localhost:27017/Nutrify')
.then(()=>{
    console.log('Database connected ');
})
.catch((err)=>{
    console.log(err)
})

const app = express();
app.use(express.json());

app.post('/register', async (req,res)=>{
    const{name,email,password,age}=req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
            age
        });
        await newUser.save();
        res.status(201).send('User registered successfully.');
    }
    catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/login', async (req,res)=>{
    let{email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            res.status(404).send({message:'User not found'});
        }
        const isValid=bcrypt.compare(password,user.password);
        if(isValid){
            console.log(process.env.JWT_SECRET);
            const token=jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'1h'});
            res.json({token});
        }
        else{
            res.status(401).send({message:"Wrong credential"});
        }  

    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.listen(8000,()=>{
    console.log('server is running')
})