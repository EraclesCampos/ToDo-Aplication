"use strict";
//mostrar input agregar tarea
const add = document.querySelector(".add").addEventListener("click",modalAddShow)
const cancel = document.querySelector(".cancelForm").addEventListener("click",modalAddShow)
const agregar = document.querySelector(".agregar")
let tasks = JSON.parse(localStorage.getItem("task") || "[]")
let tasksCompleted = JSON.parse(localStorage.getItem("task-completed") || "[]")

// --manejo de fechas--
const ahora = new Date()
const year = ahora.getFullYear()
const month = String(ahora.getMonth() + 1).padStart(2, '0')
const day = String(ahora.getDate()).padStart(2, '0')
const hours = String(ahora.getHours()).padStart(2, '0')
const minutes = String(ahora.getMinutes()).padStart(2, '0')

const fechaActual = `${year}-${month}-${day}T${hours}:${minutes}`
console.log(fechaActual)
document.getElementById('date-input').min = fechaActual


let task = document.querySelector("#add-input")
let description = document.querySelector("#descripcion-input")
let date = document.querySelector("#date-input")

document.querySelector(".form-modal-container").addEventListener("submit", (e)=>{
    e.preventDefault()
    if(task.value !== ""){
        addTask(task.value,description.value,date.value)
        vaciarInputs(task,description,date)
    }
})

document.querySelector(".completadas").addEventListener("click",modalHistoryShow)

function modalAddShow(){
    vaciarInputs(task,description,date)
    document.querySelector(".add-modal").classList.toggle("showed")
}
function modalHistoryShow(){
    document.querySelector(".completed-modal").classList.toggle("showed")
}
function closeModal(e){
    let container = e.parentNode.parentNode
    container.classList.toggle("showed")
}
function showModalDetails(){
    document.querySelector(".details-task-modal").classList.add("showed")
}
function mostrarInput(){
    agregar.classList.toggle("hidden")
}
function vaciarInputs(task,description,date){
    task.value = "";description.value = "";date.value = ""
}
function addTask(task,description,date){
    tasks.push({
        text: task,
        descripcion: description,
        fecha: date
    })
    localStorage.setItem("task",JSON.stringify(tasks))
    modalAddShow()
    getTasks()
}
function confirmDelete() {
    return new Promise((resolve) => {
        document.querySelector(".confirm-modal-delete").classList.add("showed");
        document.querySelector(".btn-delete-confirm").addEventListener("click", () => {
            document.querySelector(".confirm-modal-delete").classList.remove("showed");
            resolve(true);
        }, { once: true });
        document.querySelector(".btn-delete-cancel").addEventListener("click", () => {
            document.querySelector(".confirm-modal-delete").classList.remove("showed");
            resolve(false); 
        }, { once: true });  
    });
}
async function delTasks(e,validate){
    if(validate){
        let taskName = e.parentNode.parentNode.children[0].children[0].textContent
        tasks = tasks.filter(obj => obj.text !== taskName)
        localStorage.setItem("task", JSON.stringify(tasks))
        getTasks()
    }
    else{
        let res = await confirmDelete()
        if(res){
            let taskName = e.parentNode.parentNode.children[0].children[0].textContent
            tasks = tasks.filter(obj => obj.text !== taskName)
            localStorage.setItem("task", JSON.stringify(tasks))
            getTasks()
        }
    }
}
function confirmCompleted() {
    return new Promise((resolve) => {
        document.querySelector(".confirm-modal-complete").classList.add("showed");
        document.querySelector(".btn-complete-confirm").addEventListener("click", () => {
            document.querySelector(".confirm-modal-complete").classList.remove("showed");
            resolve(true);
        }, { once: true });
        document.querySelector(".btn-complete-cancel").addEventListener("click", () => {
            document.querySelector(".confirm-modal-complete").classList.remove("showed");
            resolve(false); 
        }, { once: true });  
    });
}
async function markCompleted(e){
    let res = await confirmCompleted()
    console.log(res)
    if(res){
        let taskName = e.parentNode.parentNode.children[0].children[0].textContent
        console.log(tasksCompleted.length)
        if(tasksCompleted.length >= 10){
            tasksCompleted.splice(9,Infinity)
            localStorage.setItem("task-completed",JSON.stringify(tasksCompleted))
        }
        tasksCompleted.unshift({
            text: taskName,
            completed: "completed"
        })
        localStorage.setItem("task-completed",JSON.stringify(tasksCompleted))
        delTasks(e,true)
    }

}
function detailsTask(e){
    vaciarParrafos()
    showModalDetails()
    let taskName = e.parentNode.parentNode.children[0].children[0].textContent
    let data = tasks.find(obj => obj.text == taskName)

    document.querySelector(".taskName").innerHTML = data.text
    document.querySelector(".taskDescription").innerHTML = data.descripcion || "Sin descripcion"
    document.querySelector(".taskDate").innerHTML = data.fecha || "Sin fecha"
    // console.log(parrafName)
}
function vaciarParrafos(){
    document.querySelector(".taskName").innerHTML = ""
    document.querySelector(".taskDescription").innerHTML = ""
    document.querySelector(".taskDate").innerHTML = ""
}
function getTasks(){
    let tareas = JSON.parse(localStorage.getItem("task") || "[]")
    let tareasCompletadas = JSON.parse(localStorage.getItem("task-completed") || "[]")
    let tasksContainer = document.querySelector(".tareas-container")
    let tasksCompletedContainer = document.querySelector(".tareas-completadas-container")
    tasksContainer.innerHTML = ""
    tasksCompletedContainer.innerHTML = ""
    if(tareas.length == 0){
        tasksContainer.innerHTML = "<p>No hay tareas pendientes</p>"
    }
    else{
        tareas.forEach(task => {
            if(task.complete === undefined){
            tasksContainer.innerHTML += `
                <div class="tarea">
                    <div class="h3-container">
                        <h3>${task.text}</h3>
                    </div>
                    <div class="check-delete">
                        <button class='check' onclick="markCompleted(this)"><img src='check.png'/></button>   
                        <button class="delete" onclick="delTasks(this,false)"><img src='delete.png'/></button>
                        <button class='edit'><img src='edit.png'/></button>
                        <button class="details" onclick="detailsTask(this)"><img src='info.png'/></button>
                    </div>
                </div>`    
            }
        })
    }
    if(tareasCompletadas.length == 0){
        tasksCompletedContainer.innerHTML = "<p>No hay tareas completadas</p>"
    }
    else{
        tareasCompletadas.forEach(task => {
            if(task.complete === undefined){
                tasksCompletedContainer.innerHTML += `
                <div class="tarea completada">
                    <div class="h3-container-completed">
                        <h3>${task.text}</h3>
                    </div>
                </div>`    
            }
        }) 
    }
}
getTasks()


// ---Manejo de notificaciones---

setInterval(() => {
    const tareas = JSON.parse(localStorage.getItem('task')) || []
    const ahora = new Date()

    tareas.forEach(tarea => {
        const fechaRecordatorio = new Date(tarea.fecha)
        if (fechaRecordatorio <= ahora) {
        mostrarNotificacion(tarea.text)
        }
    })
    console.log("verificado")
}, 60000)

function mostrarNotificacion(tarea) {
    if (Notification.permission === 'granted') {
      new Notification('Tarea pendiente', {
        body: `Recordatorio de tarea: ${tarea}`,
        icon: './checked.ico'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Tarea pendiente', {
            body: `Recordatorio de tarea: ${tarea}`,
            icon: './checked.ico'
          });
        }
      });
    }
  }
