import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';

// Icons
import { ChevronLeft, ChevronRight, Dashboard, People, Apartment, Business, Event, AccessTime, RequestPage, AssignmentInd, Payments, Category, Devices } from '@mui/icons-material';

// Assets
import gymParkLogo from '../../public/logos/gympark.svg';

// Constants
const DRAWER_WIDTH = 240;

// Drawer Styles (Open & Closed States)
const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Styled Components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open ? {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        overflow: 'auto',  // Enable scrolling
        '&::-webkit-scrollbar': {
          display: 'none',  // Hide scrollbar
        },
      },
    } : {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        overflow: 'auto',  // Enable scrolling
        '&::-webkit-scrollbar': {
          display: 'none',  // Hide scrollbar
        },
      },
    }),
  })
);


// Menu Configuration
const MENU_GROUPS = [
  {
    subheader: null,
    items: [{ text: 'Dashboard', icon: <Dashboard color="primary" />, path: '/' }],
  },
  {
    subheader: 'Employee Management',
    items: [
      { text: 'Personnel', icon: <People color="secondary" />, path: '/employe' },
      { text: 'Departement', icon: <Apartment color="secondary" />, path: '/departement' },
      { text: 'Service', icon: <Business color="secondary" />, path: '/service' },
    ],
  },
  {
    subheader: 'Attendance & Leave',
    items: [
      { text: 'Planning', icon: <Event color="secondary" />, path: '/planning' },
      { text: 'Demande Congé', icon: <RequestPage color="secondary" />, path: '/demande-conge' },
      { text: 'Absences', icon: <AssignmentInd color="secondary" />, path: '/absence' },
      { text: 'Jour Ferie', icon: <AssignmentInd color="secondary" />, path: '/jour-ferie' }
    ],
  },
  {
    subheader: 'Payroll & Administration',
    items: [
      { text: 'Fiche de Paie', icon: <Payments color="secondary" />, path: '/fiche-de-paie' },
      { text: 'Type Congé', icon: <Category color="secondary" />, path: '/type-conge' },
    ],
  },
  {
    subheader: 'Devices',
    items: [{ text: 'Appareil', icon: <Devices color="secondary" />, path: '/appareil' }],
  },
];

// Navbar Component
export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle Drawer Open/Close
  const handleToggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Sidebar Drawer */}
      <Drawer variant="permanent" open={isOpen}>
        <DrawerHeader>
          {isOpen && <img src={gymParkLogo} alt="GymPark Logo" />}
          <IconButton onClick={handleToggleDrawer}>
            {isOpen ? (theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />) 
                    : (theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />)}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* Menu Items */}
        {MENU_GROUPS.map((group, index) => (
          <List key={index} subheader={isOpen && group.subheader ? <ListSubheader>{group.subheader}</ListSubheader> : null}>
            {group.items.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton onClick={() => navigate(path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: isOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
            {!isOpen && <Divider />}
          </List>
        ))}
      </Drawer>
    </Box>
  );
}
