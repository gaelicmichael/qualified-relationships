import React, { useState } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//===============================
// Components defined by this App
import QRManager from './relationships/QRManager';
import { dataEntities, dataRelationDefs, dataRelations } from './relationships/dataset';
import ListView from './components/ListView.jsx';

const drawerWidth = 170;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const displayModes = {
  desc: "Description",
  list: "View As List",
  graph: "View As Graph"
}

const timeParams = {
  start: 1000,
  end: 1700,
  default: 1300,
  step: 10
}

const qrManager = QRManager(dataEntities, dataRelationDefs, dataRelations);

function descriptionText() {
  return <React.Fragment>
    <Typography variant="h5" gutterBottom>
      Description
    </Typography>
    <Typography paragraph>
      This is a workbench demonstration of Qualified Relationships between entities.
      There is a number of different kinds of defined relationships and roles in those relationships,
      and they can also be qualified by time period.
    </Typography>

    <Typography variant="h5" gutterBottom>
      Views
    </Typography>
    <Typography paragraph>
      The list view simply provides a simple spreadsheet-like view of the various relationships.
    </Typography>

    <Typography variant="h5" gutterBottom>
      Data Structures
    </Typography>
    <Typography paragraph>
      The entities in this demonstration data set have the following attributes: id, label, start, end.
    </Typography>
    <Typography paragraph>
      Each relationship type definition has the following attributes: label, types, roles, and colors for types and roles.
    </Typography>
    <Typography paragraph>
      Each relationship has the following attributes: type, entity1, entity2, role1, role2, start, end.
    </Typography>
  </React.Fragment>
} // descriptionText()

function App() {
  const [displayMode, setDisplayMode] = useState(displayModes.desc);
  const classes = useStyles();

  // Add useState for visible entities and relations, initially empty
  // Add useEffect for creating default settings

  return (
    <ThemeProvider theme={darkTheme}>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Qualified Relationship Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} >
        <div className={classes.toolbar} />
        <List>
          <ListItem button selected={displayMode === displayModes.desc} onClick={() => setDisplayMode(displayModes.desc)}>
            <ListItemText primary={displayModes.desc} />
          </ListItem>
          <ListItem button selected={displayMode === displayModes.list} onClick={() => setDisplayMode(displayModes.list)}>
            <ListItemText primary={displayModes.list} />
          </ListItem>
          <ListItem button selected={displayMode === displayModes.graph} onClick={() => setDisplayMode(displayModes.graph)}>
            <ListItemText primary={displayModes.graph} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {{ 
           [displayModes.desc]: descriptionText(),
           [displayModes.list]: <ListView inheritClasses={classes} timeParams={timeParams} qrManager={qrManager} />,
           [displayModes.graph]: <div>Graph</div>,
         }[displayMode]}
      </main>
    </div>
    </ThemeProvider>
  );
}

export default App;
