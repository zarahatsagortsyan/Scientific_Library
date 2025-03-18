// // // // import { useState } from "react";
// // // // import axios from "axios";
// // // // import "./Chatbot.css"; // Chatbot styles

// // // // interface Message {
// // // //   text: string;
// // // //   sender: "user" | "bot";
// // // // }

// // // // const Chatbot = () => {
// // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // //   const [input, setInput] = useState("");
// // // //   const [isOpen, setIsOpen] = useState(false); // Chat window toggle

// // // //   const sendMessage = async () => {
// // // //     if (!input.trim()) return;

// // // //     const userMessage: Message = { text: input, sender: "user" };
// // // //     setMessages((prev) => [...prev, userMessage]);

// // // //     try {
// // // //       const response = await axios.post(
// // // //         "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
// // // //         {
// // // //           contents: [{ role: "user", parts: [{ text: input }] }],
// // // //         },
// // // //         {
// // // //           headers: {
// // // //             "Content-Type": "application/json",
// // // //           },
// // // //           params: {
// // // //             key: "AIzaSyBJnKZjlhhkKZtpo8YHfliilPLA_aOmSwk",
// // // //           },
// // // //         }
// // // //       );
// // // //       const botMessage: Message = {
// // // //         text:
// // // //           response.data.candidates[0]?.content?.parts[0]?.text ||
// // // //           "I couldn't process that.",
// // // //         sender: "bot",
// // // //       };
// // // //       setMessages((prev) => [...prev, botMessage]);
// // // //     } catch (error) {
// // // //       console.error("Chatbot error:", error);
// // // //     }

// // // //     setInput("");
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {/* Floating Chat Icon */}
// // // //       {!isOpen && (
// // // //         <div className="chat-icon" onClick={() => setIsOpen(true)}>
// // // //           💬
// // // //         </div>
// // // //       )}

// // // //       {/* Chat Window */}
// // // //       {isOpen && (
// // // //         <div className="chat-container">
// // // //           <div className="chat-header">
// // // //             <span>Chatbot Assistant</span>
// // // //             <button className="close-btn" onClick={() => setIsOpen(false)}>
// // // //               ✖
// // // //             </button>
// // // //           </div>
// // // //           <div className="chat-messages">
// // // //             {messages.map((msg, idx) => (
// // // //               <div key={idx} className={`chat-bubble ${msg.sender}`}>
// // // //                 {msg.text}
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //           <div className="chat-input">
// // // //             <input
// // // //               value={input}
// // // //               onChange={(e) => setInput(e.target.value)}
// // // //               placeholder="Type a message..."
// // // //             />
// // // //             <button onClick={sendMessage} className="send-btn">
// // // //               ➤
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </>
// // // //   );
// // // // };

// // // // export default Chatbot;
// // // import { useState, useEffect } from "react";
// // // import axios from "axios";
// // // import "./ChatBot.css";

// // // interface Message {
// // //   text: string;
// // //   sender: "user" | "bot";
// // // }

// // // const Chatbot = () => {
// // //   const [messages, setMessages] = useState<Message[]>([]);
// // //   const [input, setInput] = useState("");
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const [loading, setLoading] = useState(false); // Track AI response loading

// // //   // Load chat history from local storage on component mount
// // //   useEffect(() => {
// // //     const savedMessages = localStorage.getItem("chatHistory");
// // //     if (savedMessages) {
// // //       setMessages(JSON.parse(savedMessages));
// // //     }
// // //   }, []);

// // //   // Save chat history to local storage when messages update
// // //   useEffect(() => {
// // //     localStorage.setItem("chatHistory", JSON.stringify(messages));
// // //   }, [messages]);

// // //   const sendMessage = async () => {
// // //     if (!input.trim()) return;

// // //     const userMessage: Message = { text: input, sender: "user" };
// // //     setMessages((prev) => [...prev, userMessage]);
// // //     setInput("");
// // //     setLoading(true); // Show loading message

// // //     try {
// // //       const response = await axios.post(
// // //         "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
// // //         {
// // //           contents: [{ role: "user", parts: [{ text: input }] }],
// // //         },
// // //         {
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //           },
// // //           params: {
// // //             key: "AIzaSyBJnKZjlhhkKZtpo8YHfliilPLA_aOmSwk",
// // //           },
// // //         }
// // //       );
// // //       // try {
// // //       //   const response = await axios.post(
// // //       //     "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
// // //       //     {
// // //       //       contents: [{ role: "user", parts: [{ text: input }] }],
// // //       //     },
// // //       //     {
// // //       //       headers: {
// // //       //         "Content-Type": "application/json",
// // //       //       },
// // //       //       params: {
// // //       //         key: "AIzaSyBJnKZjlhhkKZtpo8YHfliilPLA_aOmSwk", // Replace with your API key
// // //       //       },
// // //       //     }
// // //       //   );
// // //       console.log(response);
// // //       setLoading(false); // Hide loading message
// // //       const botResponse =
// // //         response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
// // //         "I couldn't process that.";
// // //       const botMessage: Message = { text: botResponse, sender: "bot" };
// // //       setMessages((prev) => [...prev, botMessage]);
// // //     } catch (error) {
// // //       setLoading(false);
// // //       console.error("Chatbot error:", error);
// // //       const errorMessage: Message = {
// // //         text: "Sorry, I couldn't get a response.",
// // //         sender: "bot",
// // //       };
// // //       setMessages((prev) => [...prev, errorMessage]);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {!isOpen && (
// // //         <div className="chat-icon" onClick={() => setIsOpen(true)}>
// // //           💬
// // //         </div>
// // //       )}

// // //       {isOpen && (
// // //         <div className="chat-container">
// // //           <div className="chat-header">
// // //             <span>Chatbot Assistant</span>
// // //             <button className="close-btn" onClick={() => setIsOpen(false)}>
// // //               ✖
// // //             </button>
// // //           </div>
// // //           <div className="chat-messages">
// // //             {messages.map((msg, idx) => (
// // //               <div key={idx} className={`chat-bubble ${msg.sender}`}>
// // //                 {msg.text}
// // //               </div>
// // //             ))}
// // //             {loading && (
// // //               <div className="chat-bubble bot loading">Thinking...</div>
// // //             )}
// // //           </div>
// // //           <div className="chat-input">
// // //             <input
// // //               value={input}
// // //               onChange={(e) => setInput(e.target.value)}
// // //               placeholder="Type a message..."
// // //             />
// // //             <button onClick={sendMessage} className="send-btn">
// // //               ➤
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default Chatbot;
// // import React, { useState } from "react";
// // import { createChatBotMessage, Chatbot } from "react-chatbot-kit";
// // import "react-chatbot-kit/build/main.css";
// // import api from "../../api/api";

// // const config = {
// //   botName: "ReaderBot",
// //   initialMessages: [
// //     createChatBotMessage(
// //       "Hello! How can I assist you today? You can report an issue by mentioning your email.",
// //       {
// //         delay: 500,
// //       }
// //     ),
// //   ],
// //   customStyles: {
// //     botMessageBox: {
// //       backgroundColor: "#007bff",
// //     },
// //     chatButton: {
// //       backgroundColor: "#007bff",
// //     },
// //   },
// // };

// // const MessageParser = ({ children, actions }: any) => {
// //   const parse = (message: string) => {
// //     if (message.includes("@")) {
// //       actions.handleUserMessage(message);
// //     } else {
// //       actions.handleUnknownMessage();
// //     }
// //   };

// //   return (
// //     <>
// //       {React.Children.map(children, (child) =>
// //         React.cloneElement(child, { parse })
// //       )}
// //     </>
// //   );
// // };

// // const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
// //   const handleUserMessage = async (message: string) => {
// //     const emailMatch = message.match(/\S+@\S+\.\S+/);
// //     const email = emailMatch ? emailMatch[0] : "";

// //     if (email) {
// //       await api
// //         .post(`${import.meta.env.VITE_API_URL}/messages`, {
// //           email,
// //           content: message,
// //         })
// //         .catch((err) => console.error("Error saving message:", err));

// //       const botMessage = createChatBotMessage(
// //         "Thank you! Your message has been recorded. An admin will reach out via email.",
// //         {
// //           delay: 500,
// //         }
// //       );
// //       setState((prev: any) => ({
// //         ...prev,
// //         messages: [...prev.messages, botMessage],
// //       }));
// //     }
// //   };

// //   const handleUnknownMessage = () => {
// //     const botMessage = createChatBotMessage(
// //       "Please include your email in the message.",
// //       {
// //         delay: 500,
// //       }
// //     );
// //     setState((prev: any) => ({
// //       ...prev,
// //       messages: [...prev.messages, botMessage],
// //     }));
// //   };

// //   return (
// //     <>
// //       {React.Children.map(children, (child) =>
// //         React.cloneElement(child, {
// //           actions: { handleUserMessage, handleUnknownMessage },
// //         })
// //       )}
// //     </>
// //   );
// // };

// // const ReaderChatBot: React.FC = () => {
// //   const [opened, setOpened] = useState(false);

// //   return (
// //     <div>
// //       {opened && (
// //         <div className="chat-container">
// //           <Chatbot
// //             config={config}
// //             messageParser={MessageParser}
// //             actionProvider={ActionProvider}
// //           />
// //         </div>
// //       )}
// //       <button
// //         onClick={() => setOpened((prev) => !prev)}
// //         className="chat-button"
// //       >
// //         {opened ? "❌" : "💬"}
// //       </button>
// //     </div>
// //   );
// // };

// // export default ReaderChatBot;
// import React, { useState } from "react";
// import { createChatBotMessage, Chatbot } from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";
// import api from "../../api/api";

// const config = {
//   botName: "ReaderBot",
//   initialMessages: [
//     createChatBotMessage("Hello! Please enter your email to continue.", {
//       delay: 500,
//     }),
//   ],
//   customStyles: {
//     botMessageBox: {
//       backgroundColor: "#007bff",
//     },
//     chatButton: {
//       backgroundColor: "#007bff",
//     },
//   },
// };

// const MessageParser = ({ children, actions }: any) => {
//   const parse = (message: string) => {
//     actions.handleUserMessage(message);
//   };
//   return (
//     <>
//       {React.Children.map(children, (child) =>
//         React.cloneElement(child, { parse })
//       )}
//     </>
//   );
// };

// const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
//   const [email, setEmail] = useState("");
//   const [content, setContent] = useState("");

//   const handleUserMessage = (message: string) => {
//     if (!email) {
//       if (message.includes("@")) {
//         setEmail(message);
//         const botMessage = createChatBotMessage(
//           "Thank you! Now enter your message."
//         );
//         setState((prev: any) => ({
//           ...prev,
//           messages: [...prev.messages, botMessage],
//         }));
//       } else {
//         const botMessage = createChatBotMessage("Please enter a valid email.");
//         setState((prev: any) => ({
//           ...prev,
//           messages: [...prev.messages, botMessage],
//         }));
//       }
//     } else if (!content) {
//       setContent(message);
//       sendMessage(email, message, setState);
//     }
//   };

//   const sendMessage = async (email: string, content: string, setState: any) => {
//     try {
//       await api.post(`${import.meta.env.VITE_API_URL}/messages`, {
//         email,
//         content,
//       });
//       const botMessage = createChatBotMessage(
//         "Your message has been sent. An admin will reach out via email."
//       );
//       setState((prev: any) => ({
//         ...prev,
//         messages: [...prev.messages, botMessage],
//       }));
//     } catch (err) {
//       console.error("Error saving message:", err);
//       const botMessage = createChatBotMessage(
//         "There was an error sending your message. Please try again later."
//       );
//       setState((prev: any) => ({
//         ...prev,
//         messages: [...prev.messages, botMessage],
//       }));
//     }
//   };

//   return (
//     <>
//       {React.Children.map(children, (child) =>
//         React.cloneElement(child, { actions: { handleUserMessage } })
//       )}
//     </>
//   );
// };

// const ReaderChatBot: React.FC = () => {
//   const [opened, setOpened] = useState(false);

//   return (
//     <div>
//       {opened && (
//         <div className="chat-container">
//           <Chatbot
//             config={config}
//             messageParser={MessageParser}
//             actionProvider={ActionProvider}
//           />
//         </div>
//       )}
//       <button
//         onClick={() => setOpened((prev) => !prev)}
//         className="chat-button"
//       >
//         {opened ? "❌" : "💬"}
//       </button>
//     </div>
//   );
// };

// export default ReaderChatBot;
import React, { useState, useEffect, useRef } from "react";
import { createChatBotMessage, Chatbot } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import api from "../../api/api";
import "./ChatBot.css";
const config = {
  botName: "ReaderBot",
  initialMessages: [
    createChatBotMessage("Hello! Please enter your email to continue.", {
      delay: 500,
    }),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#007bff",
    },
    chatButton: {
      backgroundColor: "#007bff",
    },
  },
};

const MessageParser = ({ children, actions }: any) => {
  const parse = (message: string) => {
    actions.handleUserMessage(message);
  };
  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { parse })
      )}
    </>
  );
};

const ActionProvider = ({ createChatBotMessage, setState, children }: any) => {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleUserMessage = (message: string) => {
    if (!email) {
      if (message.includes("@")) {
        setEmail(message);
        const botMessage = createChatBotMessage(
          "Thank you! Now enter your message."
        );
        setState((prev: any) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      } else {
        const botMessage = createChatBotMessage("Please enter a valid email.");
        setState((prev: any) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }
    } else if (!content) {
      setContent(message);
      sendMessage(email, message, setState);
    }
  };

  const sendMessage = async (email: string, content: string, setState: any) => {
    try {
      await api.post(`${import.meta.env.VITE_API_URL}/messages`, {
        email,
        content,
      });
      const botMessage = createChatBotMessage(
        "Your message has been sent. An admin will reach out via email."
      );
      setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (err) {
      console.error("Error saving message:", err);
      const botMessage = createChatBotMessage(
        "There was an error sending your message. Please try again later."
      );
      setState((prev: any) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    }
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { actions: { handleUserMessage } })
      )}
    </>
  );
};

const ReaderChatBot: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (opened && chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [opened]);

  return (
    <div>
      {opened && (
        <div className="chat-container" ref={chatContainerRef}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
      <button
        onClick={() => setOpened((prev) => !prev)}
        className="chat-button"
      >
        {opened ? "❌" : "💬"}
      </button>
    </div>
  );
};

export default ReaderChatBot;
