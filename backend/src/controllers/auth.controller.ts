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
   console.log(req.body);
   
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        return res.status(400).json({ error: "Please fill the fields" });
    }
    if(password!==confirmPassword ){
        return res.status(400).json({error:"password and confirm password do not match with each other"});
}

const user= await prisma.user.findUnique({
where :{username}
})
if(user){
    return res.status(400).json({error:"User exists"});
}

console.log(user);

//by crypting of the message 

const salt=await bcryptjs.genSalt(10);
const hashpasswor=await bcryptjs.hash(password,salt);
const profilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`;
// console.log(profilePic);
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
if (newUser) {
    generateToken(newUser.id, res);
    return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
    });
} else {
    return res.status(400).json({ error: "Invalid Data" });
}

} catch (error:any) {
    console.log("User not Created some error");
    res.status(500).json({error:"Error in creating the user"});
}
};



export const login = async (req: Request, res: Response): Promise<any> => {
    try {
      const { username, password } = req.body;
      console.log(req.body);
  
      // Find the user by username
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  
      // If the user does not exist, return an error
      if (!user) {
        return res.status(400).json({ error: "Invalid username" });
      }
  
      console.log(user.password); // Log the hashed password (for debugging)
  
      // Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  
      // If the password is incorrect, return an error
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate a JWT token for the user
      generateToken(user.id, res);
  
      // Respond with user data (excluding the password)
      res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        username: user.username, // Fixed typo here
        profilePic: user.profilePic,
      });
    } catch (error: any) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "An error occurred during login" });
    }
  };






export const logout = async (req: Request, res: Response)=> {
  try {
    res.cookie("jwt","",{ maxAge:0});
    res.status(200).json({message:"Logged Out successfully"});
  } catch (error:any) {
    console.log("Error in logout controller",error.message);
    res.status(500).json({error:"Internal error server Erro"});
  }
};




export const getMe = async (req: Request, res: Response): Promise<void> => {
	try {
	
		if (!req.user) {
			res.status(401).json({ error: "Unauthorized - User not authenticated" });
			return;
		}


		const user = await prisma.user.findUnique({ where: { id: req.user.id } });


		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}


		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error: any) {
			console.error("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default route;
