import React from "react"
import { Typography } from "@mui/material"

import useStyles from "./styles"

// components

export default function PageTitle(props) {
  const classes = useStyles()

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant="h1" size="sm">
        {props.title}
      </Typography>
      {props.button && props.button}
    </div>
  )
}
