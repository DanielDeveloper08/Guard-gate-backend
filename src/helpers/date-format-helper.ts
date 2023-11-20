import moment from 'moment';

export class DateFormatHelper {

  constructor() {
    moment.locale('es');
  }

  getCurrentDateTime() {
    const date = new Date().toISOString();
    return moment(date).subtract(0, 'hour').format();
  }

  getDateFormat(date: Date | string, format = 'LLL'): string {
    return moment(date).subtract(0, 'hour').format(format);
  }

  getDiffInMinutes(date: Date) {
    const dateStart = moment(date);
    const dateEnd = moment(this.getCurrentDateTime());

    return dateEnd.diff(dateStart, 'minutes');
  }
}
