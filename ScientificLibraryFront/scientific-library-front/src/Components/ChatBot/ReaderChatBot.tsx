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
