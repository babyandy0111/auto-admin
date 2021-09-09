import React from "react";
import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@material-ui/core";
import useStyles from "../../styles";

const states = {
    sent: "success",
    pending: "warning",
    declined: "secondary",
};

export default function TableComponent({data}) {
    const classes = useStyles();
    const keys = Object.keys(data[0]).map(i => i.toUpperCase());
    keys.shift(); // delete "id" key

    return (
        <Table className="mb-0">
            <TableHead>
                <TableRow>
                    {keys.map(key => (
                        <TableCell key={key}>{key}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(({type, level, method, uri, message, ip, request_length, post_body, query_string, response_length, api_response_time}) => (
                    <TableRow>
                        <TableCell className="pl-3 fw-normal">{type}</TableCell>
                        <TableCell>{level}</TableCell>
                        <TableCell>{method}</TableCell>
                        <TableCell>{uri}</TableCell>
                        <TableCell>{message}</TableCell>
                        <TableCell>{ip}</TableCell>
                        <TableCell>{request_length}</TableCell>
                        <TableCell>{post_body}</TableCell>
                        <TableCell>{query_string}</TableCell>
                        <TableCell>{response_length}</TableCell>
                        <TableCell>{api_response_time}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
