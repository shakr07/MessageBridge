import { Prisma } from "@prisma/client";
import { error } from "console";
import { Request, Response } from "express"; // Importing types
import { Router } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generatetoken";
const route = Router();  
export const signup = async (req: Request, res: Response): Promise<any> => {
try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
        return res.status(400).json({ error: "Please fill the fields" });
    }
    if(password!==confirmPassword ){
        return res.status(400).json({error:"password and confirm password do not match with each other"});
}

const user= await prisma.user.findUnique({
where :{
    username
}
})
if(user){
    return res.status(400).json({error:"User exists"});
}

//by crypting of the message 

const salt=await bcryptjs.genSalt(10);
const hashpasswor=await bcryptjs.hash(password,salt);

const profilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`;

const newUser=await prisma.user.create({
    data:{
        fullName,
        username,
        password:hashpasswor,
        gender,
        profilePic:profilePic

    }
});

//if newuser is created
if(newUser){
newUser

  //generating the token for Jwt
generateToken(newUser.id,res)


    res.status(201).json({
        id:newUser.id,
        fullName:newUser.fullName,
        username:newUser.username,
        profilePic:newUser.profilePic,

    })

}
else{
   
    
    res.status(400).json({error:"Invalid Data"});
}

} catch (error:any) {
    console.log("User not Created some error");
    res.status(500).json({error:"Error in creating the user"});
}
};


//        --login Code--



export const login = async (req: Request, res: Response): Promise<any> => {
    try{
     const {username,password}=req.body;
     const user:any=await prisma.user.findUnique({
        where:{
            username:username
        }
     })
     if(!user){
        return res.send(400).json({error:"Invalid usename"})
     }
     const ispasswordCorrect=await bcryptjs.compare(password,user.password);
     if(ispasswordCorrect===true){
        return res.status(400).json({error:"Invalid credentials"})
     }
     generateToken(user.id,res);

     res.status(200).json({
        id:user.id,
        fullName:user.fullName,
        username:user.usename,
        profilePic:user.profilePic
     });

    }
    catch(error:any){
             console.log(error);
    }
   
    res.send("Login route");
};






export const logout = async (req: Request, res: Response): Promise<void> => {
    console.log("logout");
 
    res.send("Logout route");
};


export default route;
