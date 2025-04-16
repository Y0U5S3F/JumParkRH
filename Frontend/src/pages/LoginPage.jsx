import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { styled, ThemeProvider } from '@mui/material/styles';
import { useThemeToggle } from "../App"; // Import theme context
import { darkTheme, whiteTheme } from '../theme/Theme'; // Import both themes
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after login
import Loading from '../components/Loading'; // Import the Loading component
import ThemeToggle from '../components/ThemeToggle'; // Import the theme toggle



const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 5px 15px 0px rgba(0, 0, 0, 0.5), 0 15px 35px -5px rgba(0, 0, 0, 0.1)'
    : '0 5px 15px 0px rgba(0, 0, 0, 0.05), 0 15px 35px -5px rgba(0, 0, 0, 0.05)',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  backgroundImage: `url(${theme.backgroundImage.main})`, // Use theme background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative', // For positioning the theme toggle
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { isDarkMode } = useThemeToggle(); // Get current theme mode
  const navigate = useNavigate(); // for redirecting after login

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const rememberMe = data.get('remember') !== null; // This will be true if checkbox is checked

    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/employe/login/', {
        email: email,
        password: password,
      });

      if (response.data.access && response.data.refresh) {
        if (rememberMe) {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
        } else {
          sessionStorage.setItem('access_token', response.data.access);
          sessionStorage.setItem('refresh_token', response.data.refresh);
        }
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setEmailError(true);
      setEmailErrorMessage('Invalid email or password');
      setPasswordError(true);
      setPasswordErrorMessage('Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : whiteTheme}>
      <CssBaseline enableColorScheme />
      {isLoading && <Loading />} {/* Show Loading component when isLoading is true */}
      <SignInContainer direction="column" justifyContent="space-between">
        {/* Theme Toggle in top-right corner */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>
        
        <Card variant="outlined">
        <Box sx={{ display: 'flex' }}>
  <img 
    src={isDarkMode ? darkTheme.logo.main : whiteTheme.logo.main} 
    alt="GymPark Logo" 
    style={{ maxWidth: '100%', height: '15px' }} 
  />
</Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ 
              width: '100%', 
              fontSize: 'clamp(2rem, 10vw, 2.15rem)', 
              fontWeight: 'bold',
              color: theme => theme.palette.text.primary 
            }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email" sx={{ mb: '3px', color: theme => theme.palette.text.secondary }}>Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                size="small"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password" sx={{ mb: '3px', color: theme => theme.palette.text.secondary }}>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                size="small"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                      edge="end"
                      sx={{
                        color: 'inherit', // Ensure the icon inherits the input's color
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                sx={{
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: theme => `0 0 0 100px ${theme.palette.mode === 'dark' ? 'rgba(33, 34, 44, 0.8)' : 'rgba(248, 250, 252, 0.8)'} inset`,
                    WebkitTextFillColor: theme => theme.palette.text.primary,
                    transition: 'background-color 5000s ease-in-out 0s',
                  },
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox name="remember" value="true" color="primary" />}
              label={<Typography color="text.secondary">Remember me</Typography>}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              color="primary"
              sx={{
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </ThemeProvider>
  );
}