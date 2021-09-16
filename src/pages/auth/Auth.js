import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import Form from "@rjsf/material-ui";
import Chip from '@material-ui/core/Chip';
import Draggable from 'react-draggable'; // The default

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    section1: {
        margin: theme.spacing(3, 2),
    },
    section2: {
        margin: theme.spacing(2),
    },
    section3: {
        margin: theme.spacing(3, 1, 1),
    },
}));
const Auth = () => {

    const classes = useStyles();
    const schema = {
        "title": "A registration form",
        "description": "A simple form example.",
        "type": "object",
        "required": [
            "firstName",
            "lastName"
        ],
        "properties": {
            "firstName": {
                "type": "string",
                "title": "First name",
                "default": "Chuck"
            },
            "lastName": {
                "type": "string",
                "title": "Last name"
            },
            "telephone": {
                "type": "string",
                "title": "Telephone",
                "minLength": 10
            }
        }
    };

    const uiSchema = {
        "firstName": {
            "ui:autofocus": true,
            "ui:emptyValue": "",
            "ui:autocomplete": "family-name"
        },
        "lastName": {
            "ui:emptyValue": "",
            "ui:autocomplete": "given-name"
        },
        "age": {
            "ui:widget": "updown",
            "ui:title": "Age of person",
            "ui:description": "(earthian year)"
        },
        "bio": {
            "ui:widget": "textarea"
        },
        "password": {
            "ui:widget": "password",
            "ui:help": "Hint: Make it strong!"
        },
        "date": {
            "ui:widget": "alt-datetime"
        },
        "telephone": {
            "ui:options": {
                "inputType": "tel"
            }
        }
    };

    const log = (type) => console.log.bind(console, type);

    return (
        <>
            <div>
                <Chip className={classes.chip} label="Extra Soft"/>
                <Chip className={classes.chip} color="primary" label="Soft"/>
                <Chip className={classes.chip} label="Medium"/>
                <Chip className={classes.chip} label="Hard"/>
            </div>
            <Form schema={schema} uiSchema={uiSchema}
                  onChange={log("changed")}
                  onSubmit={log("submitted")}
                  onError={log("errors")}/>
            <Draggable
                axis="x"
                handle=".handle"
                defaultPosition={{x: 0, y: 0}}
                position={null}
                grid={[25, 25]}
                scale={1}
                onStart={log("onStart")}
                onDrag={log("onDrag")}
                onStop={log("onStop")}>
                <div>
                    <div className="handle">Drag from here</div>
                    <div>This readme is really dragging on...</div>
                </div>
            </Draggable>
        </>
    );
}

export default Auth
