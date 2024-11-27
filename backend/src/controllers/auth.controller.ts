import { Prisma } from "@prisma/client";
import { error } from "console";
import { Request, Response } from "express"; // Importing types
import { Router } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
const route = Router();  
export const signup = async (req: Request, res: Response): Promise<any> => {
try {
    const {fullName, username,password,confirmPassoword,gender}=req.body;
    if(!fullName||!username||!password||!confirmPassoword||!gender){
            return res.status(400).json({error:"PLease fill the fields"});
    }
    if(password!==confirmPassoword){
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


  //generating the token for Jwt
generateToke(newUser.id,)


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


export const login = async (req: Request, res: Response): Promise<void> => {
    console.log("login");
   
    res.send("Login route");
};


export const logout = async (req: Request, res: Response): Promise<void> => {
    console.log("logout");
 
    res.send("Logout route");
};


export default route;
