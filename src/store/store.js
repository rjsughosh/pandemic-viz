const initialState = {
  ages: ["21", "41", "61"],
  cities: [
    "Aleppo",
    "Colombia",
    "Iran",
    "Karachi",
    "Lebanon",
    "Nairobi",
    "Saudi",
    "Thailand",
    "Turkey",
    "Venezuela",
    "Yemen",
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_AGES":
      return {
        ...state,
        ages: action.ages,
      };
    case "CHANGE_CITIES":
      return {
        ...state,
        cities: action.cities,
      };
    default:
      return state;
  }
};

export default reducer;
