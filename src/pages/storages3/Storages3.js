import React, {useState} from "react";
import PageTitle from "../../components/PageTitle";
import {Button, Grid} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import API from "../../server/api";

const StorageS3 = (props) => {
    const [storageData, setStorageData] = useState([])
    const getStorageListHandle = () => {
        API.getStorage({path: '/'})
            .then(res => {
                setStorageData(res.files);
            });
    }

    return (
        <>
            <PageTitle title="My Storage" button={<Button
                variant="contained"
                size="medium"
                color="secondary"
                onClick={getStorageListHandle}
            >
                Latest Reports
            </Button>}/>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <MUIDataTable
                        title="Log List"
                        data={storageData}
                        columns={["full_name", "name", "size", "type", "LastUpdatedAt"]}
                        options={{
                            filterType: "checkbox",
                        }}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default StorageS3
