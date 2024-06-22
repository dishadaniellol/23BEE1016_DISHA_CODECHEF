const today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let selectedDate = today;
const deadlines = {};

const prev = document.querySelector(".prev-month");
const next = document.querySelector(".next-month");

function isToday(date) {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatDateAsWords(date) {
  return date.toLocaleString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderCalendar() {
    const monthYearElement = document.getElementById("current-month-year");
    const calendarDaysElement = document.getElementById("calendar-days");
    calendarDaysElement.innerHTML =
      '<div class="weekday">Mo</div><div class="weekday">Tu</div><div class="weekday">We</div><div class="weekday">Th</div><div class="weekday">Fr</div><div class="weekday">Sa</div><div class="weekday">Su</div>';
  
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
  
    monthYearElement.textContent = firstDayOfMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  
    for (let i = 1; i < startDay; i++) {
      calendarDaysElement.insertAdjacentHTML(
        "beforeend",
        '<div class="calendar-day future"></div>'
      );
    }
  
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isDeadline = deadlines[day] && deadlines[day].length > 0;
      const isActive =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;
  
      let className = "calendar-day";
      if (isToday(date)) {
        className += " today";
      } else if (isActive) {
        className += " active";
      }
  
      if (isDeadline) {
        className += " deadline";
      }
  
      calendarDaysElement.insertAdjacentHTML(
        "beforeend",
        `<div class="${className}" onclick="selectDate(${day})">${day}</div>`
      );
    }
  }
  

function selectDate(day) {
  selectedDate = new Date(year, month, day);

  const dayElements = document.querySelectorAll(".calendar-day");
  dayElements.forEach((el) => {
    el.classList.remove("active");
    if (el.textContent == day) {
      el.classList.add("active");
    }
  });

  renderDeadlines();
  document.getElementById("deadline-input-container").style.display = "flex";
}

function addDeadline() {
  const deadlineInput = document.getElementById("deadline-input");
  const deadline = deadlineInput.value.trim();
  if (deadline && selectedDate) {
    const day = selectedDate.getDate();
    if (!deadlines[day]) {
      deadlines[day] = [];
    }
    deadlines[day].push(deadline);
    deadlineInput.value = "";
    renderDeadlines();
    renderCalendar();
  }
}

function renderDeadlines() {
  const todayDeadlinesElement = document.getElementById("today-deadlines");
  const upcomingDeadlinesElement = document.getElementById("upcoming-deadlines");
  todayDeadlinesElement.innerHTML = "";
  upcomingDeadlinesElement.innerHTML = "";

  const currentDay = today.getDate();

  if (deadlines[currentDay]) {
    deadlines[currentDay].forEach((deadline) => {
      const deadlineItem = document.createElement("div");
      deadlineItem.classList.add("today-item");
      deadlineItem.textContent = deadline;
      todayDeadlinesElement.appendChild(deadlineItem);
    });
  } else {
    const noDeadlinesItem = document.createElement("div");
    noDeadlinesItem.classList.add("today-item");
    noDeadlinesItem.textContent = "No deadlines today";
    todayDeadlinesElement.appendChild(noDeadlinesItem);
  }

  let hasUpcomingDeadlines = false;
  for (const day in deadlines) {
    const date = new Date(year, month, day);
    if (date > today) {
      const formattedDate = formatDateAsWords(date);
      deadlines[day].forEach((deadline) => {
        hasUpcomingDeadlines = true;
        const deadlineItem = document.createElement("div");
        deadlineItem.classList.add("deadline-item");
        deadlineItem.textContent = `${formattedDate}: ${deadline}`;
        upcomingDeadlinesElement.appendChild(deadlineItem);
      });
    }
  }

  if (!hasUpcomingDeadlines) {
    const noUpcomingDeadlinesItem = document.createElement("div");
    noUpcomingDeadlinesItem.classList.add("deadline-item");
    noUpcomingDeadlinesItem.textContent = "No upcoming deadlines";
    upcomingDeadlinesElement.appendChild(noUpcomingDeadlinesItem);
  }
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderCalendar();
  renderDeadlines();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderCalendar();
  renderDeadlines();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  renderDeadlines();
  document.getElementById("add-deadline-button").addEventListener("click", addDeadline);

  const dateContainer = document.querySelector(".date-container");
  const dayElement = dateContainer.querySelector(".date-day");
  const monthElement = dateContainer.querySelector(".date-month");
  const yearElement = dateContainer.querySelector(".date-year");

  dayElement.textContent = String(today.getDate()).padStart(2, "0");
  monthElement.textContent = today.toLocaleString("default", { month: "long" });
  yearElement.textContent = today.getFullYear();

  // Highlight today's date on page load
  const todayDayElement = document.querySelector(".calendar-day.today");
  if (todayDayElement) {
    todayDayElement.classList.add("active");
  }
});
