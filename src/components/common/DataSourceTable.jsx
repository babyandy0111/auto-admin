import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material'
import Modal from './Modal'
import { useTranslation } from 'react-i18next'

export default function BasicTable({
  data,
  columns,
  onDelete
}) {
  const { t } = useTranslation(["api"])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, i) => <TableCell align={i === 0 ? 'inherit' : 'right'}>{column.title}</TableCell>)}
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">{row.updatedAt}</TableCell>
              <TableCell align="right">{row.isSelfConnect ? 'YES' : 'NO'}</TableCell>
              <TableCell align="right">
                <Modal renderOpenButton={(onOpen) => <Button variant="contained" color="error" onClick={onOpen}>{t('interface.delete')}</Button>}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t('heading.workspaceDelete')}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {t('text.workspaceDeleteWarming')}
                  </Typography>

                  <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" color="error" onClick={() => onDelete?.(row.id)}>{t('interface.delete')}</Button>
                  </Box>
                </Modal>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  )
}
