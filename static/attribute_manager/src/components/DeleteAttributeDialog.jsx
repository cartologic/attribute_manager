import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  dialogHeader: {
    display: 'flex',
  },
  dialogTitle: {
    flexGrow: 1,
    minWidth: '400px',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  textField: {
    marginTop: 0,
    marginBottom: 0,
  },
}))
export default (props) => {
  const {
    open,
    handleClose,
    loading,
    attributes,
    onDelete,
    success,
    fail,
    onChange,
    attributeName,
  } = props
  const classes = useStyles()
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={false}
        maxWidth={'xl'}
      >
        <div className={classes.dialogHeader}>
          <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>Add Attribute:</DialogTitle>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            <CloseIcon />
          </Button>
        </div>
        <DialogContent>
          {
            success &&
            <FormHelperText>{`Attribute deleted Successfully!`}</FormHelperText>
          }
          {
            fail &&
            <FormHelperText error>{`Failed to delete attribute!`}</FormHelperText>
          }
          <form className={classes.root} autoComplete="off" id={'publish-select-form'}>
            <FormControl className={classes.formControl}>
              <Select
                value={attributeName}
                onChange={onChange}
                input={<Input name="attributeName" id="attribute-name-helper" />}
              >
                {
                  attributes.map(
                    (t, index) => <MenuItem key={index} value={t.name}>
                      {t.name} | {t.type}
                    </MenuItem>
                  )
                }
              </Select>
              <FormHelperText>Select Attribute Type</FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          {loading && <CircularProgress size={20} />}
          <Button onClick={onDelete} color="primary" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
