import React from "react"
import { useTheme } from "@material-ui/styles"
import { Typography } from "@mui/material"

// styles
import useStyles from "./styles"

export default function UserAvatar({ color = "primary", ...props }) {
  var classes = useStyles()
  var theme = useTheme()

  var letters = props.name
    .split(" ")
    .map((word) => word[0])
    .join("")

  return (
    <div
      className={classes.avatar}
      style={{ backgroundColor: theme.palette[color].main }}
    >
      <Typography className={classes.text}>{letters}</Typography>
    </div>
  )
}
