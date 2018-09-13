// Grab the todo template from Handlebars.
var todoTemplate = Handlebars.templates.todo;

/*
 * This function creates an HTML string representing a new todo note given
 * the information that could be in the note.
 */
function generateTodoHTML(what, where, when, who, details) {

  // Start the todo note data with just the "what".
  var todoData = { what: what };

  // Only add a body to the todo if we have some info to put there.
  if (where || when || who || details) {
    todoData.body = {
      where: where,
      when: when,
      who: who,
      details: details
    };
  }

  // Render the todo from the template and return it.
  return todoTemplate(todoData);

}
