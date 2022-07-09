const BLOCKED = "rgb(51, 51, 51)"
const CHECKED = "rgb(36, 171, 133)"
const WHITE = "rgb(255, 255, 255)"
const WHITE_A = "rgba(0, 0, 0, 0)"
const calendarhtml = document.getElementById("calendar")
const OFFSET = 2022;
let days = ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
let days_ = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вск"]
let months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
//тыкаешь на день и выпадает какой проект
//сводная таблица по месяцам
//

class MemoryDay {
    constructor(day, project) {
        this.day = day;
        this.project = project;
    }
};
class MemoryPage {
    constructor() {
      this.mem =[]
    }

    add(year,month,memday){
      if(!this.mem[(year-OFFSET)*12+month])
        this.mem[(year-OFFSET)*12+month] = []
    this.mem[(year-OFFSET)*12 + month][memday.day-1] = memday;
    }
    remove(year,month,memday){
      this.mem[(year-OFFSET)*12+month][memday.day-1] = undefined;
    }
    find(year,month,day){
      if(!this.mem[(year-OFFSET)*12+month])
      return false;
      return this.mem[(year-OFFSET)*12+month].find(function(element,index,array){
         if(element)
         if(element.day == day)
            return true;
         return false;

      })
    }
};
class Calendar {
    constructor(year = undefined, month = undefined) {
        this.notInitialized = true
        this.initialize(year, month)
    }
    initialize(year = undefined, month = undefined) {
        if (!this.notInitialized) {
         calendarhtml.innerHTML = "";
      }
            let now = new Date();
            this.year = (year || now.getFullYear())
            if(month==undefined)
               this.month=now.getMonth()
            else
               this.month = month
            this.addHead()
            this.addWrongDays()
            this.addDays()
        }
    

    addWrongDays() {
        let lastMonday = false;
        let i = getLastDate(this.year, this.month - 1)

        while (true) {
            let tempDate = new Date(this.year, this.month - 1, i)
            lastMonday = days[tempDate.getDay()] == "Пн" ? i : lastMonday
            if (lastMonday)
                break;
            i--
        }
        for (i; i <= getLastDate(this.year, this.month - 1); i++) {
            calendarhtml.insertAdjacentHTML("beforeend", `<div class ="day-wrong">${i}</div>`)
        }
    }

    addDays() {
        for (let i = 1; i <= getLastDate(this.year, this.month); i++) {
         let dayFromMemory = mem.find(this.year,this.month,i)
         if(dayFromMemory){
            let currentProject = document.getElementById("projectselect").value
            switch(dayFromMemory.project){
            case currentProject:
            calendarhtml.insertAdjacentHTML("beforeend",`<div class ="day" style = "background-color:${CHECKED}">${i}</div>`)
            break;
            default:
            calendarhtml.insertAdjacentHTML("beforeend",`<div class ="day" style = "background-color:${BLOCKED}">${i}</div>`)
         }
            continue;
         }
      
       
            calendarhtml.insertAdjacentHTML("beforeend", `<div class="day">${i}</div>`)
       
         
        }
    }

    addHead() {
        calendarhtml.insertAdjacentHTML("beforeend", `<div class = "headinfo">${this.year}\t${months[this.month]}</div>`)
            this.notInitialized = false;
            let self = this
            let leftButton = document.createElement("button")
            let rightButton = document.createElement("button")
            leftButton.innerHTML = "left"
            leftButton.className = "button"
            leftButton.id = "left-button"
            rightButton.innerHTML = "right"
            rightButton.className = "button"
            rightButton.id = "right-button"
            document.querySelector(".headinfo").appendChild(leftButton)
            document.querySelector(".headinfo").appendChild(rightButton)
            document.getElementById("left-button").addEventListener("click", function() {
               console.log(self.month)
                if (self.month == 0) {
                    self.month = 11;
                    self.year -= 1;
                } else
                    self.month -= 1;
                self.initialize(self.year, self.month);     
                bindClicks()
            })
            document.getElementById("right-button").addEventListener("click", function() {
                if (self.month == 11) {
                    self.month = 0;
                    self.year += 1;
                } else
                    self.month += 1;
                self.initialize(self.year, self.month);
                bindClicks()
            })
        for (let day of days_) {
            calendarhtml.insertAdjacentHTML("beforeend", `<div class ="dayhead">${day}</div>`)
        }
    }

};

let mem = new MemoryPage()
let calendar = new Calendar()
bindClicks()

document.getElementById("counter").addEventListener("click",function()
{
})


function getFirstDay(year, month) {
    return new days[Date(year, month, 0).getDay()];
}

function getLastDate(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function bindClicks() {
    let daysdiv = document.querySelectorAll('.day')
    for (let day of daysdiv) {
        day.addEventListener('click', function() {
            if (day.getAttribute("class") != "day")
                return;
            if (window.getComputedStyle(day).backgroundColor == BLOCKED)
                return;
            if (window.getComputedStyle(day).backgroundColor == WHITE || window.getComputedStyle(day).backgroundColor == WHITE_A) {

                day.style.backgroundColor = CHECKED
                document.getElementById("counter").textContent = Number(document.getElementById("counter").textContent) + 1;
                day.lastUsedProject = document.getElementById("projectselect").value
                mem.add(calendar.year,calendar.month,new MemoryDay(day.textContent,day.lastUsedProject))
            } else {
                day.style.backgroundColor = WHITE
                document.getElementById("counter").textContent = Number(document.getElementById("counter").textContent) - 1;
                //day.lastUsedProject = false;
                mem.remove(calendar.year,calendar.month,new MemoryDay(day.textContent))
            }


        });
    }
    document.getElementById("projectselect").addEventListener('change', function() {
      let daysdiv = document.querySelectorAll('.day')
        for (let day of daysdiv) {
            if (day.style.backgroundColor == CHECKED) {
                day.style.backgroundColor = BLOCKED;
                day.setAttribute("status", "blocked")
                let a = 1
            }
            if (mem.find(calendar.year,calendar.month,day.textContent)?.project == document.getElementById("projectselect").value) {
                day.style.backgroundColor = CHECKED
                day.setAttribute("status", "checked")
            }
        }
    })
}
