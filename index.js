const express = require('express')
const app = express()
const secret = "SwapanGadhaHai"
const jwt = require('jsonwebtoken')
app.use(express.json())

// import Login Schema here to Login
const port = 9000

app.post('/login',async(req,res)=>{
    try{

        const user = await schema.findOne({name:req.body.name})
        if(user?.password !== req.body.password) return res.status(400).send("BAD REQUEST")
        const accessToken = generateToken(req.body)
        const refreshToken = jwt.sign(req.body,secret)
        res.status(200).cookie("refreshToken",refreshToken,{httpOnly:true}).json({accessToken})
        // const refreshToken = await jwt.sign({_id:user._id,email:user.email,admin:user.isAdmin},secret)
    }
    catch(err){
        res.status(500).send("Internal Server Error")
    }
})



app.post('/createSomething',Authorize,async(req,res)=>{
    res.status(200).json({message:"You are Authorized to createSomething",detailsAre:req.token})
})

function generateToken(body){
    const token = jwt.sign(body,secret,{expiresIn : "30min"})
    return token
}
function Authorize(req,res,next){
    try{

        const headers = req.headers['Authorization']
        const accessToken = headers && headers.split(' ')[1]
        const isValid = jwt.verify(accessToken,secret)
        if(!isValid || !isValid.iat) return res.status(401).send("Unauthorized Access") 
        req.token = isValid;
        if(!req.token.isAdmin) return res.status(403).send("ACCESS FORBIDDEN")
        next()
        
    }catch(err){
        res.status(500).send("Internal Server Error")
    }
}





app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})