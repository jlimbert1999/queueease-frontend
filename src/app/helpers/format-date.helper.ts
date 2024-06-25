import moment from 'moment-timezone';

export const formatDate = (date: string) => {
  return moment.tz(date, 'America/La_Paz').format('D/MM/YYYY HH:mm');
};
