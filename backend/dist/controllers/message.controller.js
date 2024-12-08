"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserForSideBar = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        // receiving as a id and rename as receiverId
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        // this is the very first message being sent and that's why we created a new conversation
        if (!conversation) {
            conversation = yield prisma_1.default.conversation.create({
                data: {
                    participantsIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        const newMessage = yield prisma_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = yield prisma_1.default.conversation.update({
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
    }
    catch (error) {
        console.log("Error in sending Message", error.message);
        res.status(500).json({ error: "Internal server Error" });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userToChatId } = req.params; // Extract the userId from the params
        const senderId = req.user.id; // Extract sender's ID from the request
        // Find the conversation with the specified participants
        const conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, userToChatId], // Ensure both participants are in the conversation
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc', // Order messages by creation date (ascending)
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
    }
    catch (error) {
        console.log('Error in getMessages:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getMessages = getMessages;
const getUserForSideBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Query to fetch users excluding the authenticated user
        const users = yield prisma_1.default.user.findMany({
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
    }
    catch (error) {
        // Log the error message for debugging purposes
        console.error("Error in getUserForSideBar", error.message);
        // Respond with a 500 status and an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUserForSideBar = getUserForSideBar;
