import React, { useState } from "react";
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
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  People,
  Apartment,
  Business,
  Event,
  RequestPage,
  AssignmentInd,
  Payments,
  Category,
  Devices,
} from "@mui/icons-material";

// Assets
import gymParkLogo from "../../public/logos/gympark.svg";

// Constants
const DRAWER_WIDTH = 240;

// Drawer Styles (Open & Closed States)
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

// Styled Components
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
  position: "sticky", // Ensures it's sticky
  top: 0, // Keeps it at the top
  backgroundColor: theme.palette.background.paper,
  zIndex: 1100, // Ensure it's on top of everything else
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
          overflow: "auto", // Enable scrolling
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar
          },
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          overflow: "auto", // Enable scrolling
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar
          },
        },
      }),
}));

// Menu Configuration
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
      { text: "Demande Congé", icon: <RequestPage />, path: "/demande-conge" },
      { text: "Absences", icon: <AssignmentInd />, path: "/absence" },
      { text: "Jour Ferie", icon: <AssignmentInd />, path: "/jour-ferie" },
    ],
  },
  {
    subheader: "Payroll & Administration",
    items: [
      { text: "Fiche de Paie", icon: <Payments />, path: "/fiche-de-paie" },
      { text: "Type Congé", icon: <Category />, path: "/type-conge" },
    ],
  },
  {
    subheader: "Devices",
    items: [{ text: "Appareil", icon: <Devices />, path: "/appareil" }],
  },
];

// Navbar Component
export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Toggle Drawer Open/Close
  const handleToggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
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

        {/* Menu Items */}
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
                    backgroundColor: "transparent", // Remove background color on hover when closed
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
        backgroundColor: "transparent", // Remove background color on hover and active when closed
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
                  />{" "}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
      </Drawer>
    </Box>
  );
}
