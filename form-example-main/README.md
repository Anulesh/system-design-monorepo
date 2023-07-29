# Form Example

This is an example for a form component that can be used in different circumstances. The fields of the forms are defined by a form field definition object that is passed to the Form component.

There are deliberate imperfections that will not cause problems on a small forms but that will put a strain on machines when rendering many larger forms at once.

## Local State Example

The form will be used as a login screen that will store the forms state in the component's state. The form's values will be "submitted" when the user clicks the submit button. It can display errors related to a specific field or independent of any fields.

The input of the form that is being submitted will be displayed on the side along with controls for showing errors and resetting those.

## Redux-Based State Example

The form will be used to display and modify instance data which is stored in a Redux store. The forms values will be committed to the `instanceChanges` store slice immidiately by its parent component.
The controlling component around the form offers buttons to clear changes for the displayed instance or for sending the changes to the server for storage. Saving changes may result in an error that the form will have to display.

There is a list of available instances on the left side. Clicking one of them will make the form on the right side display its data with the changes form the Redux store merged into them.

Unsaved changed will be indicated with an asterisk at the end of the corresponding instance's label.

# The Problem

The current implementation of the Form component takes all field values as a single prop and one onChange callback for all fields, which causes the form to rerender all fields once either of the two changes.

Make the form rerender only fields that have actually changed.

You may change any component you seem necessary as long as you stay within the following constraints:

-   The contents of the `constants.ts` file are not to be changed. Consider this input from a server that you do not control.
-   The Form component doesn't directly know the context it is used in (i.e. manipulating local or Redux state). There could be a third use-case similar to the other two that we did not outline here in which the Form component could used. This should be doable with little to none modifications to the overall code-base.
-   Components created or modified by you should state their responsibilities in a doc-string above the components definition.

# Manual

This project has been created with Create React App. You will most likely be familiar with CRA but in case you struggle with running the project, you will find a brief manual below.

You need to make sure you have installed the dependencies first: `npm install`

-   **Run the project:** `npm run start`
-   **Test the project:** `npm run test`
-   **Test the project with Coverage:** `npm run test -- --coverage`

**Note:** This project's test coverage is nowhere close to 100% and we do not expect you do change that.
