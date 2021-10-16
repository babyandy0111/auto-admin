import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from "@mui/material"

function Select({ label, value, options, onChange }) {
  return <FormControl fullWidth>
    <InputLabel>{label}</InputLabel>
    <MuiSelect
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, i) => <MenuItem key={`${options.value}${i}`} value={option.value}>{option.name}</MenuItem>)}
    </MuiSelect>
  </FormControl>
}

export default Select
