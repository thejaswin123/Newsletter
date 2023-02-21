const express = require("express");
const bodyParser = require('body-parser');
const https = require('https')
const request = require('request');
const app = express();

require('dotenv').config()
console.log(process.env)

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get('/', function (req, res){
    res.sendFile(__dirname+"/signup.html")
});

app.post('/failure',function(req,res){
    res.redirect("/")
});

app.post("/",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            },
        ]
    };

    const jsondata = JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/46be4f9828"

    const options={
        method:"POST",
        auth:process.env.api_key
    };

    const request = https.request(url, options, function(response){
        if(response.statusCode==200)
        res.sendFile(__dirname+"/success.html");
        else
        res.sendFile(__dirname+"/failure.html");

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsondata);
    request.end();
});

app.listen((3000 || process.env.PORT),function(){
    console.log("Server running on port 3000...");
});



