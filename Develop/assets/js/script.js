// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));



// Todo: create a function to generate a unique task id
function generateTaskId() {
    const id = nextId++; //increments the nextId by 1 and assigns it to id
    localStorage.setItem('nextId', JSON.stringify(nextId)) //saves the nextId to local storage
    return id;


}
console.log(generateTaskId());

// Todo: create a function to create a task card
function createTaskCard(task) {
    //create a new task card element 
    const taskCard = $("<div>").addClass("card draggable").attr("id", task.id);
    const taskCardHeader = $("<div>").addClass("card-header").text(task.title);
    const taskCardBody = $("<div>").addClass("card-body");
    const taskCardFooter = $("<div>").addClass("card-footer");
    const taskDescription = $("<p>").addClass("card-text").text(task.description);
    const taskDueDate = $("<p>").addClass("card-text").text("Due Date: " + task.dueDate);
    const deleteButton = $("<button>").addClass("btn btn-danger delete").text("Delete");
    
    //change the appearance of the card based on the due date
    if(task.status === "to-do"){
        const now = dayjs();
        const dueDate = dayjs(task.dueDate);

        if(now.isSame(dueDate, 'day')){
            taskCard.addClass('bg-warning text-white');

        }else if(now.isAfter(dueDate)){
            taskCard.addClass('bg-danger text-white');
            deleteButton.addClass('border-light')
        }
    }
    //append the elements to the card
    taskCardBody.append(taskDescription, taskDueDate);
    taskCardFooter.append(deleteButton);
    taskCard.append(taskCardHeader, taskCardBody, taskCardFooter);

    return taskCard;
}




// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //selects the columns 
    const todoList = $("#todo-cards");
    const inProgressList = $("#in-progress-cards");
    const completedList = $("#done-cards");

    //clear out any existing task cards
    todoList.empty();
    inProgressList.empty();
    completedList.empty();
    //loop through the tasklist and create a card for each task
    for (let task of taskList) {
        const taskCard = createTaskCard(task);

        if (task.status === "to-do") {
            todoList.append(taskCard);
        } else if (task.status === "in-progress") {
            inProgressList.append(taskCard);
        } else {
            completedList.append(taskCard);
        }
    }

    // make the cards draggable
    $('.draggable').draggable({
        opacity: 0.8,
        zIndex: 100,
        helper: function (e){
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
                return original.clone().css('width', original.outerWidth());
        }
})

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const title = $("#task-name").val().trim();
    const description = $("#task-description").val().trim()
    const dueDate = $("#task-due-date").val().trim();
    //create new task object
    const newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "to-do"
    }
    //add the new task to the task list
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
    //clear the inputs 
    $('#task-name').val('');
    $('#task-description').val('');
    $('#task-due-date').val('');



}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    //get the id of the task to delete
    const cardId = $(event.target).closest('.card').attr('id');
    //remove the task from the taskList
    taskList = taskList.filter(task => task.id !== parseInt(cardId));
    //save the updated taskList to local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    
    

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    //get the id of the card to be dragged
    const cardId = ui.helper.attr("id");
    //set a new status for the task based on the lane it was dropped in
    const newStatus = $(this).attr("id").replace("-cards", "");
    //find the task in the taskList and update its status
    const task = taskList.find(task => task.id === parseInt(cardId));
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
   
  
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    //make the lanes droppable
    $(".lane").droppable({
        accept: ".card",
        drop: handleDrop
    });
    //setup the event listener to add new task 
    $("#add-task").on("click", handleAddTask);
    //event listener for deleting a task 
    $(document).on('click', '.delete', handleDeleteTask);
    
    //hide the modal after adding a task
    $("#add-task").on("click", function(){
        $("#formModal").modal("hide");
    })


});
