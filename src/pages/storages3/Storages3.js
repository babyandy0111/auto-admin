import React from "react";
import PageTitle from "../../components/PageTitle";
import {Button} from "@material-ui/core";

const StorageS3 = (props) => {

    return (
        <PageTitle title="My Storage" button={<Button
            variant="contained"
            size="medium"
            color="secondary"
        >
            Latest Reports
        </Button>}/>
    )
}

export default StorageS3
