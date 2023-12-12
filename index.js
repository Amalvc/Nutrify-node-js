const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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



app.listen(8000,()=>{
    console.log('server is running')
})