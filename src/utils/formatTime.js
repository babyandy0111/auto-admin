import { format, formatDistanceToNow } from "date-fns"
import moment from "moment"

const fDate = (date) => {
  return format(new Date(date), "dd MMMM yyyy")
}

const fDateTime = (date) => {
  return format(new Date(date), "dd MMM yyyy HH:mm")
}

const fDateTimeSuffix = (date) => {
  return format(new Date(date), "dd/MM/yyyy hh:mm p")
}

const fToNow = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}

const diffDays = (days) => {
  let result = new Date()
  result.setDate(result.getDate() - days)
  return result
}

const getUTCDate = (date) => {
  return moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]")
}

export { fDate, fDateTime, fDateTimeSuffix, fToNow, diffDays, getUTCDate }
