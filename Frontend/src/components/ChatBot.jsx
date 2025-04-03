import React, { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { Box, Fab, Paper,Divider, Typography, TextField, Button, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from "@mui/material/styles"; // Import useTheme to access the current theme

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const theme = useTheme(); // Access the current theme

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
      // Add dummy bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "This is a dummy response from the bot." },
        ]);
      }, 1000);
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
            
            boxShadow: theme.shadows.md, // Apply medium shadow from theme
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
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 300,
            height: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper, // Sync with theme
            color: theme.palette.text.primary, // Sync with theme
            boxShadow: theme.shadows.lg,
            border: `1px solid ${theme.palette.background.paper}`, // Add border with primary color

             // Apply large shadow from theme
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.default, // Sync with theme
              color: theme.palette.text.primary, // Sync with theme
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p:1
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", ml:1, gap:1  }}>
                <AutoAwesomeIcon />
                <Typography variant="body1">AI Assist</Typography>
            </Box>
            <IconButton
              onClick={toggleChat}
              sx={{ color: theme.palette.text.primary }} // Sync with theme
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
    backgroundColor: theme.palette.background.default, // Sync with theme
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for WebKit browsers
    },
    "-ms-overflow-style": "none", // Hide scrollbar for IE and Edge
    "scrollbar-width": "none", // Hide scrollbar for Firefox
  }}
>
  {messages.map((msg, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        justifyContent: msg.sender === "bot" ? "flex-start" : "flex-end",
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
              ? theme.palette.background.paper // Bot message background
              : theme.palette.primary.main, // User message background
          color:
            msg.sender === "bot"
              ? theme.palette.text.primary // Bot message text
              : theme.palette.primary.contrastText, // User message text
          boxShadow: theme.shadows.sm, // Apply small shadow for message bubbles
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
            //   borderTop: `1px solid ${theme.palette.divider}`, // Sync with theme
              backgroundColor: theme.palette.background.default, // Sync with theme
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
      e.preventDefault(); // Prevents the default behavior of the Enter key
      handleSend(); // Call the send function
    }
  }}
  placeholder="Type a message..."
  sx={{
    mr: 1,
    "& .MuiOutlinedInput-root": {
      color: theme.palette.text.primary, // Sync with theme
    },
  }}
/>
            {/* <Button
              variant="contained"
              onClick={handleSend}
              sx={{
                backgroundColor: theme.palette.primary.main, // Sync with theme
                color: theme.palette.primary.contrastText, // Sync with theme
              }}
            >
              <SendIcon/>
            </Button> */}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ChatBot;