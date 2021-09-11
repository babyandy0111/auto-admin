import React from "react";
import {TextField, Button, Select, MenuItem} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";

const Auth = () => {
    const CreateAuthHandle = (e) => {
        console.log(e)
    }

    return (
        <>
            <PageTitle title="Auth" button={<Button variant="contained" size="medium" color="secondary"
                                                    onClick={CreateAuthHandle}>Create</Button>}/>

            <TextField
                required
                id="filled-required"
                label="Required"
                defaultValue="Hello World"
                variant="filled"
            />

            <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                // open={open}
                // onClose={handleClose}
                // onOpen={handleOpen}
                // value={age}
                // onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>

        </>
    )
}

export default Auth
