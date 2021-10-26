import {
  Box, Button, Grid, TextField, Typography
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { ApiTable, Modal } from '../components/common'
import API from '../server/api'

const ApiAuthPage = () => {
  const { t } = useTranslation(["api"])
  const { data: authKeys = [] } = useQuery('authKeys', API.getAuthKey)
  const [keyName, setKeyName] = useState('')
  const [encryption, setEncryption] = useState({
    name: '',
    publicKey: "",
    privateKey: ''
  })

  return <>
    <Grid container spacing={2}>
      <Grid item container xs={12} columnSpacing={2}>
        <Grid item container xs={9}></Grid>
        <Grid item container xs={2}>
          <TextField label={t('label.keyName')} variant="outlined" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
        </Grid>
        <Grid item container xs={1}>
          <Modal renderOpenButton={(onOpen) => <Button variant="contained" onClick={() => API.postAuthKeys({ keyName }).then(res => {
            if (!res.code) {
              onOpen()
            }
            setEncryption({
              name: res.name,
              publicKey: res.public_key,
              privateKey: res.private_key
            })
          })}>{t('interface.createKey')}</Button>}>
            {(onClose) => {
              return <>
                <div>{encryption.name}</div>
                <div>{encryption.publicKey}</div>
                <div>{encryption.privateKey}</div>
              </>
            }}
          </Modal>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <ApiTable
          columns={
            [
              {
                title: t('table.keyName'),
                key: "keyName"
              },
              {
                title: t('table.key'),
                key: "key"
              },
              {
                title: t('table.createTime'),
                key: "createTime"
              },
              {
                title: "",
                key: 'mutation',
                render: (row) => {
                  return !row.isDisabled && <>
                    <Modal renderOpenButton={(onOpen) => <Button component="span" variant="contained" onClick={onOpen}>{t('interface.edit')}</Button>}>
                      {(onClose) => {
                        return <></>
                      }}
                    </Modal>
                    <Modal renderOpenButton={(onOpen) => <Button sx={{ ml: 1 }} component="span" variant="contained" color="error" onClick={onOpen}>{t('interface.stop')}</Button>}>
                      {(onClose) => <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          {t('heading.deactivate')}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          {t('text.keyDeleteWarming')}
                        </Typography>

                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                          <Button variant="contained" onClick={onClose}>{t('interface.cancel')}</Button>
                          <Button variant="outlined" sx={{ ml: 1 }} color="error" onClick={() => { }}>{t('interface.stop')}</Button>
                        </Box>
                      </>}
                    </Modal>
                  </>
                }
              }
            ]
          }
          data={authKeys.map(authKey => ({
            id: authKey.id,
            keyName: authKey.name,
            key: authKey.publicKey,
            createTime: authKey.createdAt,
            isDisabled: authKey.isDisabled
          }))}
        />
      </Grid>
    </Grid>
  </>
}



export default ApiAuthPage