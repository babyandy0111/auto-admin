import {
  Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { omit, toPairs } from 'ramda'

function FormTable({ columns, data }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, i) => <TableCell key={column.key} align={i === 0 ? 'inherit' : 'right'}>{column.title}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => {

            return <TableRow key={row.id}>
              {toPairs(omit(['id'], row)).map(([key, cellValue], i) => {

                return <TableCell key={`${row.id}_${key}`} align={i === 0 ? 'inherit' : 'right'}>
                  {columns[i].render?.(row) || cellValue}
                </TableCell>
              })}
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer >
  )
}

export default FormTable