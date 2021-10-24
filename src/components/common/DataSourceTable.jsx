import { LoadingButton } from '@mui/lab'
import {
  Box, Button, Grid, Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField, Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDatabaseTest } from '../../hooks'
import API from '../../server/api'
import Modal from './Modal'

export default function BasicTable({
  data,
  columns,
  onRefetch,
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
                {row.isSelfConnect && <Modal renderOpenButton={(onOpen) => <Button component="span" variant="contained" onClick={onOpen}>{t('interface.edit')}</Button>}>
                  {(onClose) => {
                    return <>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('heading.workspaceEdit', { name: row.name })}
                      </Typography>
                      <WorkspaceEditForm id={row.id} onRefetch={onRefetch} onClose={onClose} />
                    </>
                  }}
                </Modal>}

                <Modal renderOpenButton={(onOpen) => <Button sx={{ ml: 1 }} component="span" variant="contained" color="error" onClick={onOpen}>{t('interface.delete')}</Button>}>
                  {(onClose) => <>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      {t('heading.workspaceDelete')}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      {t('text.workspaceDeleteWarming')}
                    </Typography>

                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                      <Button variant="contained" onClick={onClose}>{t('interface.cancel')}</Button>
                      <Button variant="outlined" sx={{ ml: 1 }} color="error" onClick={() => onDelete?.(row.id)}>{t('interface.delete')}</Button>
                    </Box>
                  </>}
                </Modal>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  )
}

const WorkspaceEditForm = ({ id, onRefetch, onClose }) => {
  const { t } = useTranslation(["api"])
  const { register, handleSubmit, watch, getValues, reset } = useForm({
    defaultValues: {
      databaseName: "",
      endpoint: "",
      port: "",
      username: "",
      password: "",
    }
  })
  const { test, status } = useDatabaseTest(getValues, watch)

  const submit = handleSubmit((value) =>
    API.updateResourceMysql(id, value)
      .then(() => {
        onRefetch?.()
        onClose?.()
        reset()
      })
      .catch(() => { })
      .finally(() => { })
  )

  return <>
    <Grid container sx={{ paddingTop: 2 }} rowSpacing={2} >
      <Grid item md={12}>
        <TextField {...register("databaseName", { required: true })} label={t('label.databaseName')} fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("endpoint", { required: true })} label="Endpoint" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("port", { required: true })} label="Port" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("username", { required: true })} label="Username" fullWidth />
      </Grid>
      <Grid item md={12}>
        <TextField {...register("password", { required: true })} label="Password" fullWidth />
      </Grid>
    </Grid>

    <Box sx={{ textAlign: 'right', mt: 2 }}>
      {status === "success" ? <Button variant="contained" onClick={submit} fullWidth>{t('interface.update')}</Button> : <LoadingButton
        variant="outlined" fullWidth
        color={status === 'fail' ? 'error' : undefined}
        loading={status === "loading"}
        onClick={test}
      >
        {t('interface.test')}
      </LoadingButton>}
    </Box>
  </>
}


