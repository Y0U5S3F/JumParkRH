import React, { useState } from "react";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTheme } from "@mui/material/styles";
import { ACCESS_TOKEN } from "../constants";

// Helper function to get the token from local storage
const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)
  );
};

const CHATBOT_API_URL = "http://127.0.0.1:8000/api/appareil/chatbot/";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Bonjour ! Comment puis-je vous aider aujourd’hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
      setLoading(true);

      try {
        const token = getAccessToken();
        const response = await axios.post(
          CHATBOT_API_URL,
          { message: input },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: response.data.result || "No response from server",
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, something went wrong!" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 25, right: 25 }}>
      {/* Floating Button */}
      {!isOpen && (
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            width: {
              xs: "60vw", // 90% of the viewport width for extra-small screens
              sm: "50vw", // 70% for small screens
              md: "30vw", // 40% for medium screens
              lg: "25vw", // 30% for large screens
            },
            height: {
              xs: "40vh", // 50% of the viewport height for extra-small screens
              sm: "40vh", // 60% for small screens
              md: "60vh", // 70% for medium screens
              lg: "50vh", // 60% for large screens
            },
            maxWidth: "500px", // Limit the maximum width
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${theme.palette.secondary.main}`, 

            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 1,
                gap: 1,
                color: theme.palette.primary.main,
              }}
            >
              <AutoAwesomeIcon />
              <Typography variant="body1">Assistant IA</Typography>
            </Box>
            <IconButton
              onClick={toggleChat}
              sx={{ color: theme.palette.text.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              backgroundColor: theme.palette.background.default,
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "bot" ? "flex-start" : "flex-end",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    maxWidth: "70%",
                    p: 1,
                    borderRadius: 2,
                    backgroundColor:
                      msg.sender === "bot"
                        ? theme.palette.background.paper
                        : theme.palette.primary.main,
                    color:
                      msg.sender === "bot"
                        ? theme.palette.text.primary
                        : theme.palette.primary.contrastText,
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              display: "flex",
              p: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Poser une question..."
              sx={{
                mr: 1,
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.text.primary,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.paper,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24} // Match the size of the SendIcon
                  sx={{
                    color: theme.palette.background.paper, // Match the color of the SendIcon
                  }}
                />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ChatBot;
