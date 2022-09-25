var colorPalette = d3.scaleLinear()
.domain(d3.ticks(-1.429, 3.6, 4))
.range(["#0000FF", "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#a01a1a"]);

export function colorPicker(colorIndex){
    return colors[colorIndex];
  }

const colors = ['red', 'orange', 'green', 'blue', 'indigo', 'violet', "purple",'yellow',"cyan", "maroon"];

export { colorPalette }