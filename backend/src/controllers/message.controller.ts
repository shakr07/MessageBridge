import { Request, Response } from "express";
import prisma from "../db/prisma";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    // receiving as a id and rename as receiverId
    const { id: receiverId } = req.params;
    const senderId :any = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    // this is the very first message being sent and that's why we created a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantsIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    res.status(200).json(newMessage);

  } catch (error: any) {
    console.log("Error in sending Message", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
       const { id: userToChatId } = req.params;  // Extract the userId from the params
       const senderId = req.user.id;  // Extract sender's ID from the request
 
       // Find the conversation with the specified participants
       const conversation = await prisma.conversation.findFirst({
          where: {
             participantsIds: {
                hasEvery: [senderId, userToChatId],  // Ensure both participants are in the conversation
             },
          },
          include: {
             messages: {
                orderBy: {
                   createdAt: 'asc',  // Order messages by creation date (ascending)
                },
             },
          },
       });
 
       // If no conversation found, return a 404 error
       if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
       }
 
       // Return the conversation messages if found
       res.status(200).json(conversation.messages);
    } catch (error: any) {
       console.log('Error in getMessages:', error.message);
       res.status(500).json({ error: 'Internal Server Error' });
    }
 };

 export const getUserForSideBar = async (req: Request, res: Response) => {
    try {
      const authUserId = req.user?.id;
      
      // Query to fetch users excluding the authenticated user
      const users = await prisma.user.findMany({
        where: {
          id: {
            // Ensure the authenticated user is not included
            not: authUserId
          }
        },
        select: {
          id: true,
          fullName: true,
          profilePic: true
        }
      });
  
      // Send the response with the list of users
      res.status(200).json(users);
    } catch (error: any) {
      // Log the error message for debugging purposes
      console.error("Error in getUserForSideBar", error.message);
      
      // Respond with a 500 status and an error message
      res.status(500).json({ error: "Internal Server Error" });
    }
  };