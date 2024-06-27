import moment from 'moment-timezone';
import 'moment/locale/es';
moment.locale("es");

export const formatDate = (
  date: string,
  format: string = 'D/MM/YYYY HH:mm'
) => {
  return moment.tz(date, 'America/La_Paz').format(format);
};
