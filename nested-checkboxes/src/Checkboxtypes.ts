/** Option Id to be used for identifying particular checkbox and mapping it comes from fakeApi to load data */
export type OptionId = number;

/** Option Id to string to be used for identifying particular checkbox and mapping */
type OptionIdString = string;

/** Checkbox state with options array
 * 
 * checked options array &
 * 
 * isAllOptionsSelected flage */
export type CheckboxState = {
/** Options Id array for loading options */
  options: Array<OptionId>;
  /** Checked options array list */
  checkedOptions: Array<OptionId>;
  /** Boolean flag for all options selected state */
  isAllOptionsSelected: boolean;
};

export enum checkboxActionTypes {
  LOAD_OPTIONS,
  OPTION_TOGGLED,
  ALL_OPTIONS_TOGGLED,
}
export type CheckboxAction =
  | {
      type: checkboxActionTypes.LOAD_OPTIONS;
      payload: Array<OptionIdString>;
    }
  | { type: checkboxActionTypes.OPTION_TOGGLED; payload: OptionIdString }
  | { type: checkboxActionTypes.ALL_OPTIONS_TOGGLED; payload: OptionIdString };
export const initialState: CheckboxState = {
  options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  checkedOptions: [],
  isAllOptionsSelected: false,
};
