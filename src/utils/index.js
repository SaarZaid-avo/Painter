export const randomIntFromRange = (min, max) => {
  return Math.round(Math.random() * max + min);
};

export const colorsArray = [
  "#049DBF",
  "#F2EFDF",
  "#F2B544",
  "#D97C2B",
  "#BF4417",
];

export const randomColor = (colorsArray) => {
  return colorsArray[Math.floor(Math.random() * colorsArray.length)];
};

export const distance = (x1, x2, y1, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};
