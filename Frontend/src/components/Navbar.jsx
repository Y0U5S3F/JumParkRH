import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Avatar,
  Typography,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from "@mui/icons-material/Description";
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MuiDrawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CategoryIcon from '@mui/icons-material/Category';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  People,
  Apartment,
  Business,
  Event,
  Payments,
} from "@mui/icons-material";
import gymParkLogo from "../../public/logos/gympark.svg";
import {jwtDecode} from "jwt-decode";

const DRAWER_WIDTH = 240;

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1100,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      }),
}));

const MENU_GROUPS = [
  {
    items: [{ text: "Dashboard", icon: <Dashboard />, path: "/" }],
  },
  {
    subheader: "Employee Management",
    items: [
      { text: "Personnel", icon: <People />, path: "/employe" },
      { text: "Departement", icon: <Apartment />, path: "/departement" },
      { text: "Service", icon: <Business />, path: "/service" },
    ],
  },
  {
    subheader: "Attendance & Leave",
    items: [
      { text: "Planning", icon: <Event />, path: "/planning" },
      { text: "Demande Congé", icon: <Payments />, path: "/demande-conge" },
      { text: "Absences", icon: <EventBusyOutlinedIcon />, path: "/absence" },
      { text: "Jour Ferie", icon: <EventAvailableIcon />, path: "/jour-ferie" },
    ],
  },
  {
    subheader: "Payroll & Administration",
    items: [
      { text: "Fiche de Paie", icon: <DescriptionIcon/>, path: "/fiche-de-paie" },
      { text: "Type Congé", icon: <CategoryIcon />, path: "/type-conge" },
    ],
  },
  {
    subheader: "Devices",
    items: [{ text: "Appareil", icon: <PhonelinkSetupIcon />, path: "/appareil" }],
  },
];

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState({ nom: "John Doe", role: "Admin" });

  useEffect(() => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({ nom: decodedToken.nom, role: decodedToken.role });
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleToggleDrawer = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={isOpen}>
        <DrawerHeader>
          {isOpen && <img src={gymParkLogo} alt="GymPark Logo" />}
          <IconButton onClick={handleToggleDrawer}>
            {isOpen ? (
              theme.direction === "rtl" ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
              )
            ) : theme.direction === "rtl" ? (
              <ChevronLeft />
            ) : (
              <ChevronRight />
            )}
          </IconButton>
        </DrawerHeader>

        {MENU_GROUPS.map((group, index) => (
          <List
            key={index}
            subheader={
              isOpen && group.subheader ? (
                <ListSubheader>{group.subheader}</ListSubheader>
              ) : null
            }
          >
            {group.items.map(({ text, icon, path }) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "block",
                  mb: "6px",
                  ...(isOpen && {
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "8px",
                      width: "calc(100% - 20px)",
                      marginLeft: "10px",
                      "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                        color: theme.palette.background.paper,
                      },
                    },
                  }),
                  ...(!isOpen && {
                    "&:hover": {
                      backgroundColor: "transparent",
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                  }),
                }}
              >
                <ListItemButton
                  onClick={() => navigate(path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isOpen ? "initial" : "center",
                    px: 2.5,
                    ...(isActive(path) && {
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    }),
                    ...(isOpen &&
                      isActive(path) && {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "8px",
                        marginLeft: "10px",
                        marginRight: "10px",
                        "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                          color: theme.palette.background.paper,
                        },
                      }),
                    ...(!isOpen && {
                      "&:hover, &.Mui-selected": {
                        backgroundColor: "transparent",
                      },
                      "&:hover .MuiListItemIcon-root,": {
                        color: theme.palette.primary.main,
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive(path)
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      opacity: isOpen ? 1 : 0,
                      color: isOpen ? theme.palette.common.white : "inherit",
                      ...(isOpen && {
                        "&:hover, &.Mui-selected": {
                          color: theme.palette.background.default,
                        },
                      }),
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}

        {/* User Box */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1100,

          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" ,}}>
            <Avatar alt="User Avatar"   sx={{ width: 37, height: 37,  bgcolor: (theme) => theme.palette.primary.main}}
            size="small "src="/path/to/avatar.jpg" >{user.nom[0]}</Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body1" sx={{color: (theme) => theme.palette.text.primary}} fontWeight={700}>
                {user.nom}
              </Typography>
              <Typography variant="body2" sx={{color: (theme) => theme.palette.text.secondary}}>{user.role}</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
}