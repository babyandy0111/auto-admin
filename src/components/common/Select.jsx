import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from "@mui/material"

function Select({ variant = "standard", disabled, label, value = "", options, onChange }) {

  return <FormControl variant={variant} disabled={disabled} fullWidth>
    <InputLabel>{label}</InputLabel>
    <MuiSelect
      label={label}
      value={value}
      onChange={onChange}
    >
      {options.map((option, i) => <MenuItem key={`${options.value}${i}`} value={option.value}>{option.name}</MenuItem>)}
    </MuiSelect>
  </FormControl>
}

export default Select
