import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

// import { useContext } from 'react';
import { useDarkTheme, useDarkThemeUpdate } from './ThemeContext';

import { Link } from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const darkTheme = useDarkTheme();
  const toggleDarkMode = useDarkThemeUpdate();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  return (
    <div className={classes.root} style={themeStyle}>
      {/* <CssBaseline /> */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        style={{background:'linear-gradient(205deg, rgba(63,99,255,1) 0%, rgba(54,54,193,1) 21%, rgba(231,117,117,1) 100%)', 
        // webkitUserSelect:'none',
        // userSelect: 'none',
        // webkitAppRegion: 'drag'
      }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            WunderQL
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        style={themeStyle}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <Link to="/" class='nav-list-item'>
              <ListItem button key={1}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='Home' />
              </ListItem>
            </Link>
            <Link to="/dashboard" class='nav-list-item'>
              <ListItem button key={2}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='URI Dashboard' />
              </ListItem>
            </Link>
            <Link to="/testquery" class='nav-list-item'>
              <ListItem button key={3}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='Test Query' />
              </ListItem>
            </Link>
            <Link to="/loadtest" class='nav-list-item'>
              <ListItem button key={4}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='Load Test' />
              </ListItem>
            </Link>
            <Link to="/previoussearches" class='nav-list-item'>
              <ListItem button key={5}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='Past Searches' />
              </ListItem>
            </Link>
            {/* <Link to="/login" class='nav-list-item'>
              <ListItem button key={5}>
                <ListItemIcon><InboxIcon /></ListItemIcon>
                <ListItemText primary='Login' />
              </ListItem>
            </Link> */}
        </List>    
        <Divider />  
        <FormControlLabel
          id='dark-switch'
          control={
            <Switch
              onChange={toggleDarkMode}
              name="dark-mode"
              color="primary"
            />
          }
          label="Dark Mode"
      />
      </Drawer>
    </div>
  );
}


// import { Link } from 'react-router-dom';

// const NavBar = () => {
//   return(
//     <div id='nav-bar'>
//       <nav>
//           <ul id='nav-list'>
//             <li className='nav-list-item'>
//               <Link to="/dashboard">Dashboard</Link>
//             </li>
//             <li className='nav-list-item'>
//               <Link to="/testquery">Test Query</Link>
//             </li>
//             <li className='nav-list-item'>
//               <Link to="/playground">Playground</Link>
//             </li>
//           </ul>
//         </nav>
//     </div>
//   )
// }

// export default NavBar;