/***
 * Qualified Relationships -- Visualiations
 *  By Michael Newton April 2020 (drawing on my earlier work in UNC Digital Innovation Lab)
 * 
 * NOTES
 *    Technique of using reducer with Context from https://www.sitepoint.com/replace-redux-react-hooks-context-api/
 *    See also https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
 * TODO
 *     Create Relationship type filter?
 *  */

import React, { useState } from 'react';

// Material-UI
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';

//===============================
// Components defined by this App
import { TimeContextProvider } from './TimeConstraintsContext';
import QRManager from './relationships/QRManager';
import { dataEntities, entityDefs, dataRelationDefs, dataRelations, dataTimeSettings } from './relationships/dataset';
import ListView from './components/ListView.jsx';
import EgoTimeRadar from './components/EgoTimeRadar.jsx';
import EgoRings from './components/EgoRings.jsx';
import ChordConnections from './components/ChordConnections.jsx';

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
  egoTimeRadar: "View As Ego Time Radar",
  egoRings: "View As Ego Rings",
  chords: 'View as Chorded Ring',
}

const qrManager = QRManager(entityDefs, dataEntities, dataRelationDefs, dataRelations);

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

  return (
    <ThemeProvider theme={darkTheme}>
      <TimeContextProvider initialState={dataTimeSettings}>
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
            <List dense>
              <ListItem button selected={displayMode === displayModes.desc} onClick={() => setDisplayMode(displayModes.desc)}>
                <ListItemText primary={displayModes.desc} />
              </ListItem>
              <ListItem button selected={displayMode === displayModes.list} onClick={() => setDisplayMode(displayModes.list)}>
                <ListItemText primary={displayModes.list} />
              </ListItem>
              <ListItem button selected={displayMode === displayModes.egoTimeRadar} onClick={() => setDisplayMode(displayModes.egoTimeRadar)}>
                <ListItemText primary={displayModes.egoTimeRadar} />
              </ListItem>
              <ListItem button selected={displayMode === displayModes.egoRings} onClick={() => setDisplayMode(displayModes.egoRings)}>
                <ListItemText primary={displayModes.egoRings} />
              </ListItem>
              <ListItem button selected={displayMode === displayModes.chords} onClick={() => setDisplayMode(displayModes.chords)}>
                <ListItemText primary={displayModes.chords} />
              </ListItem>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {{ 
              [displayModes.desc]: descriptionText(),
              [displayModes.list]: <ListView inheritClasses={classes} qrManager={qrManager} />,
              [displayModes.egoTimeRadar]: <EgoTimeRadar inheritClasses={classes} qrManager={qrManager} />,
              [displayModes.egoRings]: <EgoRings inheritClasses={classes} qrManager={qrManager} />,
              [displayModes.chords]: <ChordConnections inheritClasses={classes} qrManager={qrManager} />,
            }[displayMode]}
          </main>
        </div>
      </TimeContextProvider>
    </ThemeProvider>
  );
}

export default App;
