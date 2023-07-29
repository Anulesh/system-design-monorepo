import React, { createContext, useReducer, useContext } from "react";
import { CheckboxAction, checkboxActionTypes, CheckboxState, initialState } from "./Checkboxtypes";

export const CheckboxContext = createContext<CheckboxState>(initialState);
export const CheckboxDispatchContext = createContext<
  React.Dispatch<CheckboxAction>
>(() => {});
export function CheckBoxProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkBoxReducer, initialState);
  return (
    <CheckboxContext.Provider value={state}>
      <CheckboxDispatchContext.Provider value={dispatch}>
        {children}
      </CheckboxDispatchContext.Provider>
    </CheckboxContext.Provider>
  );
}
function checkBoxReducer(
  state: CheckboxState,
  action: CheckboxAction
): CheckboxState {
  switch (action.type) {
    case checkboxActionTypes.LOAD_OPTIONS: {
      return initialState;
    }
    case checkboxActionTypes.OPTION_TOGGLED: {
      const optionId = Number(action.payload);
      const optionIdIndex = state.checkedOptions.indexOf(optionId);
      let partial: Partial<CheckboxState> = {};
      if (optionIdIndex === -1) {
        const checkedOptions = [...state.checkedOptions, optionId];
        partial = {
          checkedOptions,
          isAllOptionsSelected: checkedOptions.length === state.options.length,
        };
      } else {
        partial = {
          checkedOptions: [
            ...state.checkedOptions.slice(0, optionIdIndex),
            ...state.checkedOptions.slice(optionIdIndex + 1),
          ],
          isAllOptionsSelected: false,
        };
      }
      debugger
      return {
        ...state,
        ...partial,
      };
    }
    case checkboxActionTypes.ALL_OPTIONS_TOGGLED: {
      let partial: Partial<CheckboxState> = {};
      if (state.isAllOptionsSelected) {
        partial = { checkedOptions: [], isAllOptionsSelected: false };
      } else {
        partial = {
          checkedOptions: [...state.options],
          isAllOptionsSelected: true,
        };
      }
      debugger
      return {
        ...state,
        ...partial,
      };
    }
  }
}
export function useCheckbox() {
  return useContext(CheckboxContext);
}

export function useCheckboxDispatch() {
  return useContext(CheckboxDispatchContext);
}
