import React from 'react';
import moment from 'moment/moment';
import styles from './Calendar.module.css';

export default class Calendar extends React.Component {
  state = {
    dateObject: moment(),
    allMonths: moment.months(),
    showMonthTable: false,
    selectedDay: null,
  };

  weekdayshort = moment.weekdaysShort();

  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject).startOf('month').format('d');
    return firstDay;
  };

  daysInMonth = () => {
    let dateObject = this.state.dateObject;
    let days = moment(dateObject).daysInMonth();
    return days;
  };

  months = () => {
    let months = moment.months();
    return months;
  };
  currentDay = () => {
    return this.state.dateObject.format('d');
  };

  month = () => {
    return this.state.dateObject.format('MMMM');
  };

  MonthList = (props) => {
    let months = [];
    let rows = [];
    let cells = [];
    props.data.map((data) => {
      months.push(
        <td
          className={styles['calendar-month']}
          key={data}
          onClick={(e) => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        // except zero index
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells); // add last row

    let monthlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className={styles['calendar-months']}>
        <thead>
          <tr>
            <th colSpan="4">Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };

  setMonth = (month) => {
    let monthNo = this.months().indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('month', monthNo);
    this.setState({
      dateObject: dateObject,
    });
  };

  showMonthSelector = (e, month) => {
    console.log('called');
    this.setState({
      showMonthTable: !this.state.showMonthTable,
    });
  };

  onDayClick = (e, day) => {
    this.setState({
      selectedDay: day,
    });
  };

  render() {
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{''}</td>);
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay = d == this.currentDay() ? 'today' : null; // Use === for strict equality
      daysInMonth.push(
        <td
          key={d}
          onClick={(e) => {
            this.onDayClick(e, d);
          }}
          className={`${styles['calendar-day']} ${
            currentDay ? styles[currentDay] : ''
          }`}
        >
          {d}
        </td>
      );
    }

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows
        cells = []; // empty container
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) {
        // when end loop we add remain date
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    let weekdayshortname = this.weekdayshort.map((day) => {
      return (
        <th key={day} className={styles['week-day']}>
          {day}
        </th>
      );
    });

    return (
      <div className={styles['calendar-container']}>
        <div
          className={styles['calendar-header']}
          onClick={this.showMonthSelector}
        >
          <p> {this.month()}</p>
        </div>

        {this.state.showMonthTable && (
          <div className={styles['calendar-date']}>
            <this.MonthList data={moment.months()} />
          </div>
        )}
        <table className={styles[`calendar`]}>
          <thead>
            <tr>{weekdayshortname}</tr>
          </thead>
          <tbody>{daysinmonth}</tbody>
        </table>
      </div>
    );
  }
}
