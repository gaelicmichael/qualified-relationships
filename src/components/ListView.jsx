import React, { Fragment } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'

// App-specific components
import TimeSlider from './TimeSlider'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  divider: {
    margin: theme.spacing(2),
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
}))(TableCell);

function ListView({ inheritClasses, timeParams, qrManager }) {
  const listClasses = useStyles();

  return (
    <Fragment>
    <TimeSlider classes={inheritClasses} timeParams={timeParams} />

    <Typography variant="h4" component="h4">
      Entities
    </Typography>
    <TableContainer component={Paper}>
      <Table className={listClasses.table} size="small" aria-label="entity table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Entity Name</StyledTableCell>
            <StyledTableCell align="left">Type</StyledTableCell>
            <StyledTableCell align="left">Start</StyledTableCell>
            <StyledTableCell align="left">End</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qrManager.getEntities().map((entity) => (
            <TableRow key={entity.id}>
              <TableCell component="th" scope="row">
                {entity.label}
              </TableCell>
              <TableCell align="left">{entity.type}</TableCell>
              <TableCell align="left">{entity.start}</TableCell>
              <TableCell align="left">{entity.end}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Divider className={listClasses.divider} variant="middle" />

    <Typography variant="h4" component="h4">
      Relationships
    </Typography>
    <TableContainer component={Paper}>
      <Table className={listClasses.table} size="small" aria-label="relationship table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Relationship Type</StyledTableCell>
            <StyledTableCell align="left">Entity 1</StyledTableCell>
            <StyledTableCell align="left">Entity 2</StyledTableCell>
            <StyledTableCell align="left">Role 1</StyledTableCell>
            <StyledTableCell align="left">Role 2</StyledTableCell>
            <StyledTableCell align="left">Start</StyledTableCell>
            <StyledTableCell align="left">End</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { qrManager.getRelations().map((r) => {
            let fullRelation = qrManager.expandRelation(r)
            return (
            <TableRow key={r.id}>
              <TableCell component="th" scope="row">
                {fullRelation.type}
              </TableCell>
              <TableCell align="left">{fullRelation.entity1}</TableCell>
              <TableCell align="left">{fullRelation.entity2}</TableCell>
              <TableCell align="left">{fullRelation.role1}</TableCell>
              <TableCell align="left">{fullRelation.role2}</TableCell>
              <TableCell align="left">{fullRelation.start}</TableCell>
              <TableCell align="left">{fullRelation.end}</TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </Fragment>
  );
}

export default ListView;