const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3011;
const { spawn } = require("child_process");

// Middlewares
const setHeaders = require("./app/middlewares/setHeaders");
app.use(express.json());
app.use(setHeaders);

// Code to run another file 
const anotherServer = spawn('node', ['./index.js'], {
    detached: false, 
    stdio: 'inherit',
});

anotherServer.on("error",(err)=>{
    console.error(`Error running another file: ${err.message}`);
});

anotherServer.on("exit", (code) => {
    console.log(`Another server exited with code ${code}`);
});

app.listen(PORT, "0.0.0.0", ()=>{ console.log(`Server started at PORT ${PORT}`)});
