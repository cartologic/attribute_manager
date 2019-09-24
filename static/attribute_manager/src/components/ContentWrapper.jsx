import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PublishForm from './PublishForm'
import ResourceSelectInput from './ResourceSelectInput'
import ResourceSelectDialog from './ResourceSelectDialog'
import AttributesTable from './AttributesTable'
import AddAttributeDialog from './AddAttributeDialog'
import DeleteAttributeDialog from './DeleteAttributeDialog'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(6, 1),
    marginTop: '50px',
  },
}));
export default (props) => {
  const {
    resourceSelectInput,
    resourceSelectDialog,
    attributeManager,
    addAttributeDialog,
    deleteAttributeDialog
  } = props
  const classes = useStyles();
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md">
        <Paper className={classes.root}>
          <ResourceSelectInput {...resourceSelectInput}/>
          <ResourceSelectDialog {...resourceSelectDialog}/>
          <AttributesTable {...attributeManager}/>
          <AddAttributeDialog {...addAttributeDialog}/>
          <DeleteAttributeDialog {...deleteAttributeDialog}/>
        </Paper>
      </Container>
    </div>
  );
}
