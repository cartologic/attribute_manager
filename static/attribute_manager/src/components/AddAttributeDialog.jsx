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
    error,
    attributeName,
    attributeType,
    onChange,
    onAdd
  } = props
  const OGRFieldTypes = [
    { name: 'OFTString', readableName: 'Text', code: '4' },
    { name: 'OFTInteger', readableName: 'Number (Integer)', code: '0' },
    { name: 'OFTReal', readableName: 'Number (Float)', code: '2' },
  ]
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
            error &&
            <FormHelperText error>{`Error: Invalid attribute name! Must be Alphanumeric Ex: table_name_1, Max length: 63 character`}</FormHelperText>
          }
          <form className={classes.root} autoComplete="off" id={'publish-select-form'}>
            <FormControl className={classes.formControl} error={false}>
              <TextField
                id="table-name"
                label="Name"
                className={classes.textField}
                value={attributeName}
                name="attributeName"
                onChange={onChange}
                margin="normal"
              />
              <FormHelperText>Enter Attribute Name</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <Select
                value={attributeType}
                onChange={onChange}
                input={<Input name="attributeType" id="attribute-type-helper" />}
              >
                {
                  OGRFieldTypes.map(
                    (t) => <MenuItem key={t.code} value={t.code}>{t.readableName}</MenuItem>
                  )
                }
              </Select>
              <FormHelperText>Select Attribute Type</FormHelperText>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          {loading && <CircularProgress size={20} />}
          <Button onClick={onAdd} color="primary" disabled={loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
