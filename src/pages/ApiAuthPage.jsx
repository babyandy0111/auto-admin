import {
  Box, Button, Grid, Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import ApiTable from '../components/common/ApiTable'
import Modal from '../components/common/Modal'

const ApiAuthPage = () => {
  const { t } = useTranslation(["api"])
  // const { isLoading, data: databaseTypes } = useQuery('databaseTypes', API.getResourceDBType)
  // const { data: dataResource, refetch } = useQuery('dataResource', API.getResourceMysql)

  return <>
    <Grid container spacing={2}>
      <Grid item md={12}>

      </Grid>
      <Grid item md={12}>
        <ApiTable
          data={[
            {
              id: 1,
              workspaceName: 11,
              isSelfConnect: true
            },
            {
              id: 2,
              workspaceName: 22,
              isSelfConnect: false
            },
          ]}
          columns={
            [
              {
                title: t('table.workspaceName'),
                key: "workspaceName"
              },
              {
                title: "",
                key: 'button',
                render: (row) => {

                  return <>
                    {row.isSelfConnect && <Modal renderOpenButton={(onOpen) => <Button component="span" variant="contained" onClick={onOpen}>{t('interface.edit')}</Button>}>
                      {(onClose) => {
                        return <></>
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
                          <Button variant="outlined" sx={{ ml: 1 }} color="error" onClick={() => { }}>{t('interface.delete')}</Button>
                        </Box>
                      </>}
                    </Modal>
                  </>
                }
              }
            ]
          } />
      </Grid>
    </Grid>
  </>
}



export default ApiAuthPage