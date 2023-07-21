import { checkboxActionTypes, useCheckbox, useCheckboxDispatch } from "./CheckboxContext";

export const CheckBoxUI = () => {
  const selectAllOptionValue = "selectAll";
  const state = useCheckbox()
  const dispatch = useCheckboxDispatch()
  return (
    <>
      <input
        type="checkbox"
        id={selectAllOptionValue}
        checked={state.isAllOptionsSelected}
        onChange={e=> {
            dispatch({
                type: checkboxActionTypes.ALL_OPTIONS_TOGGLED,
                payload: e.target.id
            })
        }}
        value={selectAllOptionValue}
        key={selectAllOptionValue}
      />
      {state.options.map((option) => (
        <input type="checkbox" id={option.toString()} checked={state.checkedOptions.indexOf(option)!==-1} onChange={e => {
            dispatch({type: checkboxActionTypes.OPTION_TOGGLED, payload: e.target.id})
        }} key={option.toString()}/>
      ))}
    </>
  );
};
