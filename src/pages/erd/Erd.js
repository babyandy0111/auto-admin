import React from "react";
import 'grapesjs/dist/css/grapes.min.css';
import {GrapesjsReact} from "grapesjs-react";
import 'grapesjs-custom-code'

const Erd = (props) => {
    return (
        <>
            <GrapesjsReact
                id='grapesjs-react'
                plugins={[
                    'grapesjs-custom-code',
                    'gjs-preset-webpage',
                ]}
            />
        </>
    )
}

export default Erd
