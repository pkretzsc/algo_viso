export const optionsAlgo = [
  { value: "dijkstra", label: "Dijkstras Algorithm" },
  { value: "aStar", label: "A* Algorithm" },
  { value: "vanilla", label: "Vanilla" },
];
export const selectAlgoStyle = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: "1px dotted pink",
    color: state.isSelected ? "red" : "blue",
    padding: 15,
  }),
  control: (styles) => ({
    ...styles,
    // none of react-select's styles are passed to <Control />
    width: 250,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    return { ...provided, opacity, transition };
  },
};
