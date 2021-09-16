import {format, formatDistanceToNow} from 'date-fns';
import moment from "moment";

export const fDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy');
}

export const fDateTime = (date) => {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export const fDateTimeSuffix = (date) => {
    return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export const fToNow = (date) => {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true
    });
}

export const diffDays = (days) => {
    let result = new Date();
    result.setDate(result.getDate() - days);
    return result;
}

export const getUTCDate = (date) => {
    return moment(new Date(date)).utc().format("YYYY-MM-DDThh:mm:ss[Z]")
}

