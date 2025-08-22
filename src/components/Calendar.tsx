import React from "react";
import "./styles/Calendar.css";

function Calendar({ onDayClick }) {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const currentDay = today.getDate(); 

  const monthNames = {
    0: "January", 1: "February", 2: "March", 3: "April",
    4: "May", 5: "June", 6: "July", 7: "August",
    8: "September", 9: "October", 10: "November", 11: "December"
  };

  const formatMonth = (monthIndex) => {
    const monthNum = monthIndex + 1;               
    return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
  };

  const formatDay = (day) => {
  return day < 10 ? `0${day}` : `${day}`;
};

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return (
    <div className="CalendarLayout">
      <h1>{monthNames[monthIndex]} {year}</h1>

      <div className="CalendarGrid">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = day === currentDay;

          return (
            <button
              key={day}
              type="button"
              className={`DayCell${isToday ? " is-today" : ""}`}
              onClick={() => {
                const month = formatMonth(monthIndex);                 
                const fullDate = `${year}-${month}-${formatDay(day)}`;
                onDayClick?.(fullDate);
              }}
            >
              <span className="DayNumber">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;


