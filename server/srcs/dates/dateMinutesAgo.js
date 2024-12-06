function dateMinutesAgo(minutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutes);
    return date;
  }

module.exports = { dateMinutesAgo };
