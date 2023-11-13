import { format, isToday, isYesterday } from 'date-fns';

const FormatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
        return `Today, ${format(date, 'h:mma')}`;
    } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'h:mma')}`;
    } else {
        return format(date, 'MMMM d, yyyy, h:mma');
    }
}

export default FormatDate;