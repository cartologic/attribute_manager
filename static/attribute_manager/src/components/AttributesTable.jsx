import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        width: '80%',
        margin: 'auto',
        position: "relative",
        paddingBottom: '60px',
    },
    table: {
        minWidth: 650,
    },
    tableWrapper: {
        maxHeight: '300px',
        overflow: 'auto',
    },
    fab: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
    },
    title: {
        margin: '8px',
        color: '#616161',
    },
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default (props) => {
    const classes = useStyles();
    const {
        attributes,
        selectedResource,
        onAddAttr,
    } = props
    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" className={classes.title}>2. Add Attribute</Typography>
            <div className={classes.tableWrapper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Attribute</TableCell>
                            <TableCell align="center">Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attributes.map(a => (
                            <TableRow key={a.name}>
                                <TableCell align="center">{a.name}</TableCell>
                                <TableCell align="center">{a.type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {
                selectedResource &&
                <Fab color="primary" onClick={onAddAttr} className={classes.fab} size={'small'}>
                    <AddIcon />
                </Fab>
            }
        </div>
    );
}