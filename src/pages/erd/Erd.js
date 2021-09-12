import React from "react";
import {WorkSpaceProvider} from "../../context/WorkSpaceContext";
const Erd = (props) => {
    return (
        <>
            <WorkSpaceProvider props={props}/>
        </>
    )
}

export default Erd
