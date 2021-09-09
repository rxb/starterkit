export const TESTCOLORS1 = ["#193941", "#ff7864", "#041799", "#7ad1ee", "#D51C29", "#00A99D", "#00B7B7", "#ad0520", "#F22263", "#4C581A", "#4DB4D7", "#fcbf18", "#9b5260", "#bf5700", "#D44329", "#76B9E1", "#5A5A69", "#e61e00", "#ffd316", "#C4E538", "#FF8772", "#3A547C", "#DC6EDC", "#42AF89", "#7ba6ad", "#50c88c", "#F15D59", "#0ab99c", "#ab2525", "#8f4b21", "#FF6600", "#a51ec1", "#00C9BA", "#ff6633", "#AAD038", "#4d5d5b", "#64C8FF", "#e69866", "#748899", "#798f5a", "#6c64ff", "#ffd582", "#008fa7", "#48dacb", "#b3dae5", "#e5dd42", "#e8d41a", "#b39b90", "#005000", "#F985E8", "#f99973", "#BE9BD9", "#8ff2a6", "#7ED0E1", "#00a300", "#3f4a5d", "#7B2980", "#3d4f56", "#659d92", "#0DD6AF", "#b7c9e0", "#8C1928", "#0096C8", "#213e74", "#F37321", "#C1E0E5", "#E6EA5B", "#17214C", "#46c1b2", "#4D1970", "#096228", "#ffc83f", "#c1bc87", "#b20000", "#9C1E2C", "#FF4000", "#8AEB66", "#6B57A5", "#85e4f9", "#E2E000", "#2763ff", "#2BE0A8", "#564858", "#77C588", "#D20028", "#2a597e", "#3C266F", "#E2C207", "#93C840", "#c63030", "#01a19a", "#E11383", "#EE0000", "#E77038", "#DC8200", "#0f6800", "#faa819", "#c676ff", "#9D8931", "#00bea0", "#FF8B40", "#007C79", "#f8005b", "#BF206F", "#d04bdb", "#D2529E", "#2C8C79", "#008754", "#FF3C96", "#CC0000", "#FCC200", "#A5AE51", "#C02627", "#bd1a88", "#F2E36F", "#5d7850", "#4d07a8", "#f7941e", "#DC6E28", "#2EC9ED", "#C40505", "#451834", "#006ebf", "#F3859C", "#FF6D00", "#ec008c", "#3ca9b7", "#ff66cc", "#95D5D5", "#de0057", "#FCBA60", "#30602F", "#F7E503", "#F2781C", "#517abd", "#D31D52", "#F5844F", "#f4e11c", "#3e96d2", "#EC5A7D", "#8c61a8", "#5400AD", "#ff0000", "#009680", "#676760", "#FFF31A", "#216d40", "#ff5917", "#223e98", "#F15C30", "#5d4284", "#029874", "#EF6A63", "#FFB000", "#76163e", "#FFA501", "#0000cc", "#971d1f", "#842442", "#e5a735", "#ea5455", "#6a5770", "#4683B0", "#28c83c", "#00635a", "#d9e022", "#208cbc", "#283494", "#004E8B", "#8c222f", "#A50E27", "#0000e6", "#F27597", "#b56c23", "#ffe900", "#501596", "#E0B03C", "#7F0ACF", "#6ED2C8", "#d95f4c", "#65A9C1", "#73b84d", "#94a338", "#22ff22", "#6e1e46", "#C92A39", "#002d62", "#ebc9f4", "#96c7d7", "#2200aa", "#009900", "#144F59", "#79c416", "#1e315f", "#da4a75", "#C41E3A", "#c0c037", "#0baef7", "#96D698", "#ee3c2d", "#FFD400", "#ff51a7", "#0326F2", "#7a4fdc", "#669900", "#0646fa", "#2ff7d0", "#2C42D2", "#32aa32", "#00c800", "#89a527", "#3566b9", "#7f8000", "#ffcc00", "#FC93C6", "#6fa04f", "#DDB0A2", "#0074DD", "#cd5d28", "#ff5000", "#9C9C9D", "#58b74e", "#40B761", "#be0040", "#C1CF82", "#51BBB7", "#628481", "#006DC8", "#FF8500", "#FC9302", "#31B1CB", "#EF464E", "#0f4c81", "#00b2d9"]

export const TESTCOLORS2 = ["ff595e", "ff924c", "ffca3a", "c5ca30", "8ac926", "36949d", "1982c4", "4267ac", "565aa0", "6a4c93"].map(color => `#${color}`)

const materialColors = [
   { "name": "Red", "hex": "#F44336" },
   { "name": "Pink", "hex": "#E91E63" },
   { "name": "Purple", "hex": "#9C27B0" },
   { "name": "Deep Purple", "hex": "#673AB7" },
   { "name": "Indigo", "hex": "#3F51B5" },
   { "name": "Blue", "hex": "#2196F3" },
   { "name": "Light Blue", "hex": "#03A9F4" },
   { "name": "Cyan", "hex": "#00BCD4" },
   { "name": "Green", "hex": "#4CAF50" },
   { "name": "Light Green", "hex": "#8BC34A" },
   { "name": "Amber", "hex": "#FFC107" },
   { "name": "Orange", "hex": "#FF9800" },
   { "name": "Deep Orange", "hex": "#FF5722" },
];
export const TESTCOLORS3 = materialColors.map(mc => mc.hex).sort(() => (Math.random() > .5) ? 1 : -1);

const yearColors = [
   { "name": "Greenery", "hex": "#88B04B" },
   { "name": "Serenity", "hex": "#93A9D1" },
   { "name": "Rose Quartz", "hex": "#F7CACA" },
   { "name": "Marsala", "hex": "#964F4C" },
   { "name": "Radiant Orchid", "hex": "#AD5E99" },
   { "name": "Emerald", "hex": "#009473" },
   { "name": "Tangerine Tango", "hex": "#DD4124" },
   { "name": "Honeysuckle", "hex": "#D94F70" },
   { "name": "Turquoise", "hex": "#45B5AA" },
   { "name": "Mimosa", "hex": "#F0C05A" },
   { "name": "Blue Iris", "hex": "#5A5B9F" },
   { "name": "Chili Pepper", "hex": "#9B1B30" },
   { "name": "Sand Dollar", "hex": "#DECDBE" },
   { "name": "Blue Turquoise", "hex": "#53B0AE" },
   { "name": "Tigerlily", "hex": "#E2583E" },
   { "name": "Aqua Sky", "hex": "#7BC4C4" },
   { "name": "True Red", "hex": "#BF1932" },
   { "name": "Fuchsia Rose", "hex": "#C74375" }
];
export const TESTCOLORS4 = yearColors.map(yc => yc.hex);

const metroColors = [
   { "name": "Light Green", "hex": "#99b433" },
   { "name": "Green", "hex": "#00a300" },
   { "name": "Dark Green", "hex": "#1e7145" },
   { "name": "Magenta", "hex": "#ff0097" },
   { "name": "Light Purple", "hex": "#9f00a7" },
   { "name": "Purple", "hex": "#7e3878" },
   { "name": "Dark Purple", "hex": "#603cba" },
   { "name": "Teal", "hex": "#00aba9" },
   { "name": "Blue", "hex": "#2d89ef" },
   { "name": "Dark Blue", "hex": "#2b5797" },
   { "name": "Yellow", "hex": "#ffc40d" },
   { "name": "Orange", "hex": "#e3a21a" },
   { "name": "Dark Orange", "hex": "#da532c" },
   { "name": "Red", "hex": "#ee1111" },
   { "name": "Dark Red", "hex": "#b91d47" },
];
export const TESTCOLORS5 = metroColors.map(c => c.hex);

export const TESTCOLORS6 = ["#c63030","#EE0000","#CC0000","#C40505","#ff0000","#F15D59","#EF6A63","#ee3c2d","#ff7864","#e61e00","#d95f4c","#FF8772","#D44329","#F15C30","#ff6633","#FF4000","#ff5917","#ff5000","#F5844F","#E77038","#cd5d28","#DC6E28","#F37321","#FF8B40","#FF6600","#FF6D00","#F2781C","#FF8500","#f7941e","#FCBA60","#FC9302","#faa819","#FFA501","#ffd582","#FFB000","#ffc83f","#fcbf18","#FCC200","#ffcc00","#ffd316","#FFD400","#f4e11c","#ffe900","#F7E503","#FFF31A","#E2E000","#d9e022","#C1CF82","#C4E538","#4C581A","#89a527","#AAD038","#669900","#93C840","#6fa04f","#73b84d","#5d7850","#8AEB66","#0f6800","#58b74e","#30602F","#005000","#00a300","#009900","#32aa32","#00c800","#96D698","#28c83c","#77C588","#8ff2a6","#40B761","#096228","#216d40","#50c88c","#008754","#42AF89","#2BE0A8","#029874","#2C8C79","#659d92","#2ff7d0","#0DD6AF","#0ab99c","#00bea0","#009680","#4d5d5b","#46c1b2","#48dacb","#6ED2C8","#00635a","#00C9BA","#00A99D","#01a19a","#51BBB7","#007C79","#00B7B7","#95D5D5","#3ca9b7","#C1E0E5","#7ba6ad","#008fa7","#144F59","#31B1CB","#7ED0E1","#00b2d9","#85e4f9","#2EC9ED","#193941","#b3dae5","#96c7d7","#7ad1ee","#0096C8","#4DB4D7","#65A9C1","#208cbc","#0baef7","#64C8FF","#76B9E1","#3e96d2","#006ebf","#4683B0","#004E8B","#2a597e","#006DC8","#748899","#0f4c81","#0074DD","#002d62","#3A547C","#517abd","#3566b9","#213e74","#1e315f","#2763ff","#0646fa","#223e98","#17214C","#0326F2","#2C42D2","#041799","#283494","#0000cc","#0000e6","#6c64ff","#2200aa","#6B57A5","#3C266F","#7a4fdc","#5d4284","#4d07a8","#501596","#5400AD","#c676ff","#7F0ACF","#4D1970","#8c61a8","#a51ec1","#d04bdb","#7B2980","#DC6EDC","#F985E8","#bd1a88","#ff66cc","#D2529E","#ec008c","#E11383","#BF206F","#ff51a7","#FF3C96","#de0057","#f8005b","#be0040","#F22263","#da4a75","#D31D52","#F27597","#EC5A7D","#F3859C","#D20028","#C41E3A","#C92A39","#D51C29","#EF464E","#ea5455","#C02627"]


export const TESTCOLORS7 = ["#c63030","#e61e00","#DC6E28","#F37321","#FF6D00","#f7941e","#FFA501","#FFB000","#FCC200","#4C581A","#89a527","#6fa04f","#73b84d","#0f6800","#30602F","#32aa32","#77C588","#096228","#029874","#0ab99c","#009680","#00635a","#00A99D","#007C79","#3ca9b7","#144F59","#00b2d9","#0096C8","#208cbc","#0baef7","#64C8FF","#006ebf","#004E8B","#006DC8","#283494","#3C266F","#7a4fdc","#4d07a8","#7F0ACF","#4D1970","#a51ec1","#d04bdb","#7B2980","#bd1a88","#FF3C96","#D31D52","#C41E3A","#C92A39","#D51C29","#EF464E","#C02627"];

export const TESTCOLORS8 = ["#283494","#b20000","#005000","#FF8B40","#ee3c2d","#7F0ACF","#d04bdb","#9C1E2C","#01a19a","#9b5260","#00b2d9","#f8005b","#0096C8","#cd5d28","#e61e00","#e5dd42","#D51C29","#96c7d7","#FCC200","#00B7B7","#FF3C96","#ffd316","#EE0000","#A50E27","#7ED0E1","#EF464E","#0646fa","#F27597","#BE9BD9","#28c83c","#008754","#096228","#041799","#FF8772","#A5AE51","#0ab99c","#2C8C79","#6ED2C8","#008fa7","#0f6800","#BF206F","#48dacb","#8c61a8","#faa819","#E0B03C","#517abd","#F15D59","#7ba6ad","#d9e022","#50c88c","#3A547C","#7a4fdc","#C92A39","#DC6E28","#FF4000","#3566b9","#73b84d","#40B761","#00A99D","#D31D52","#FC93C6","#216d40","#ea5455","#c676ff","#FFA501","#C02627","#659d92","#144F59","#ff66cc","#0f4c81","#3e96d2","#C41E3A","#F15C30","#FF8500","#748899","#0000e6","#da4a75","#be0040","#f99973","#ad0520","#FFB000","#ff5000","#93C840","#FFD400","#00a300","#F5844F","#bf5700","#32aa32","#FF6D00","#5400AD","#ffc83f","#65A9C1","#F2781C","#C40505","#F985E8","#fcbf18","#EC5A7D","#00c800","#5d7850","#4683B0","#223e98","#029874","#AAD038","#971d1f","#2200aa","#451834","#0000cc","#ffcc00","#bd1a88","#D44329","#0326F2","#30602F","#0DD6AF","#4DB4D7","#DC6EDC","#2a597e","#004E8B","#3C266F","#DC8200","#1e315f","#006DC8","#79c416","#F37321","#7B2980","#669900","#FC9302","#FCBA60","#2EC9ED","#31B1CB","#2BE0A8","#213e74","#d95f4c","#208cbc","#ff51a7","#FF6600","#42AF89","#ab2525","#ec008c","#58b74e","#E2C207","#4D1970","#e5a735","#F22263","#6B57A5","#ff6633","#842442","#8C1928","#007C79","#EF6A63","#5d4284","#009680","#D2529E","#0baef7","#3ca9b7","#D20028","#4C581A","#009900","#798f5a","#2C42D2","#E11383","#ff0000","#94a338","#f7941e","#7ad1ee","#64C8FF","#002d62","#3f4a5d","#00C9BA","#c63030","#4d07a8","#76163e","#17214C","#51BBB7","#46c1b2","#CC0000","#6c64ff","#628481","#00bea0","#a51ec1","#e69866","#F3859C","#0074DD","#85e4f9","#ff5917","#C1CF82","#E77038","#de0057","#6fa04f","#ff7864","#2763ff","#501596","#89a527","#006ebf","#00635a","#76B9E1"];

export const TESTCOLORS9 = ["#EE0000","#FF3C96","#006ebf","#a51ec1","#FF8772","#89a527","#C92A39","#041799","#FF8B40","#f8005b","#ff7864","#AAD038","#008fa7","#F985E8","#f99973","#FFA501","#7F0ACF","#E0B03C","#2BE0A8","#0000cc","#ea5455","#5400AD","#00b2d9","#4683B0","#FF6D00","#DC6EDC","#bd1a88","#7ad1ee","#F15C30","#3A547C","#ffcc00","#be0040","#32aa32","#798f5a","#28c83c","#EF464E","#ff5917","#00C9BA","#008754","#3C266F","#30602F","#2200aa","#4D1970","#748899","#0ab99c","#00c800","#79c416","#1e315f","#0096C8","#E77038","#3f4a5d","#42AF89","#3ca9b7","#ee3c2d","#31B1CB","#FC9302","#F27597","#e5a735","#4DB4D7","#EC5A7D","#208cbc","#D2529E","#7a4fdc","#7ba6ad","#2C42D2","#842442","#029874","#FF6600","#4d07a8","#C41E3A","#2763ff","#006DC8","#D31D52","#ab2525","#FFD400","#096228","#ff5000","#ffc83f","#01a19a","#6c64ff","#da4a75","#FCC200","#F3859C","#00B7B7","#65A9C1","#d04bdb","#E11383","#7B2980","#501596","#FCBA60","#93C840","#2a597e","#0f4c81","#F22263","#2EC9ED","#3566b9","#9C1E2C","#40B761","#00A99D","#F15D59","#94a338","#659d92","#F37321","#ff6633","#e61e00","#0326F2","#faa819","#0000e6","#BF206F","#64C8FF","#451834","#ff66cc","#8c61a8","#2C8C79","#517abd","#005000","#007C79","#628481","#223e98","#f7941e","#0baef7","#c676ff","#17214C","#6fa04f","#de0057","#FF4000","#5d4284","#FC93C6","#00a300","#009680","#6B57A5","#213e74","#85e4f9","#D20028","#D51C29","#C40505","#004E8B","#76B9E1","#CC0000","#b20000","#3e96d2","#669900","#283494","#e69866","#00bea0","#F2781C","#EF6A63","#ff0000","#c63030","#ffd316","#FFB000","#4C581A","#51BBB7","#FF8500","#48dacb","#ad0520","#58b74e","#d95f4c","#fcbf18","#0074DD","#C1CF82","#0f6800","#216d40","#7ED0E1","#46c1b2","#50c88c","#73b84d","#C02627","#6ED2C8","#144F59","#ec008c","#0DD6AF","#009900","#0646fa","#F5844F","#BE9BD9","#96c7d7","#ff51a7","#00635a","#5d7850"];

export const TESTCOLORS10 = ["#76B9E1","#EF464E","#2200aa","#fcbf18","#EF6A63","#041799","#2EC9ED","#7ED0E1","#d04bdb","#007C79","#DC6EDC","#58b74e","#de0057","#FC9302","#0f6800","#004E8B","#D31D52","#6B57A5","#F3859C","#50c88c","#d95f4c","#669900","#42AF89","#4C581A","#ff6633","#216d40","#51BBB7","#1e315f","#F37321","#c63030","#FFA501","#EE0000","#32aa32","#4d07a8","#17214C","#00bea0","#008754","#2BE0A8","#0000cc","#b20000","#0f4c81","#0000e6","#D51C29","#7a4fdc","#ea5455","#00b2d9","#ffcc00","#FCBA60","#6c64ff","#f8005b","#223e98","#79c416","#FF8500","#213e74","#ad0520","#E0B03C","#8c61a8","#7ad1ee","#31B1CB","#C92A39","#F2781C","#bd1a88","#CC0000","#FCC200","#ff5917","#ffd316","#6fa04f","#ff7864","#f7941e","#FF8B40","#5d4284","#40B761","#009680","#00c800","#006ebf","#096228","#501596","#EC5A7D","#e5a735","#283494","#5d7850","#2763ff","#da4a75","#a51ec1","#5400AD","#005000","#30602F","#F985E8","#208cbc","#D2529E","#00635a","#7B2980","#FF6D00","#3f4a5d","#3566b9","#be0040","#F22263","#451834","#F15D59","#7ba6ad","#006DC8","#029874","#89a527","#ffc83f","#ff66cc","#0ab99c","#AAD038","#4DB4D7","#FFB000","#00A99D","#2C42D2","#ff0000","#6ED2C8","#46c1b2","#48dacb","#00C9BA","#f99973","#65A9C1","#008fa7","#BE9BD9","#0326F2","#E11383","#01a19a","#96c7d7","#517abd","#BF206F","#009900","#D20028","#FF4000","#c676ff","#3e96d2","#0074DD","#ee3c2d","#FF6600","#e61e00","#7F0ACF","#FF8772","#ec008c","#144F59","#3ca9b7","#C40505","#faa819","#64C8FF","#E77038","#F27597","#0646fa","#FFD400","#28c83c","#4D1970","#3C266F","#FF3C96","#ff5000","#93C840","#94a338","#0096C8","#00a300","#F5844F","#00B7B7","#ff51a7","#F15C30","#0baef7","#FC93C6"];

export const TESTCOLORS_SCRATCH = ["#029874","#4d07a8","#009900","#FFA501","#FF6D00","#FCC200","#2763ff","#0096C8","#004E8B","#01a19a","#283494","#FFB000","#7F0ACF","#F37321","#D31D52","#e61e00","#d04bdb","#a51ec1","#0baef7","#c63030","#0f6800","#007C79","#f7941e","#006DC8","#ff5000","#32aa32"];

export const SHORTLIST1 = ["#FCC200","#005000","#4d07a8","#32aa32","#FF4000","#EE0000","#FF3C96","#0baef7","#00bea0","#50c88c","#FF8500","#6c64ff","#00635a","#7a4fdc","#2200aa","#213e74","#64C8FF","#a51ec1","#c676ff","#2763ff","#ff5000","#FC93C6"];


export const STARBRITE = [
"#F898C8",
"#E91E63",
"#D62518",
"#AD0000",
"#FA7A00",
"#CDDC39",
"#00D8A0",
"#1BA77B",
"#004C71",
"#1AADE0",
"#0069BD",
"#333399",
"#56418C",
"#212321",
"#E63300",
"#DE6900",
]

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);


export const PSEUDORANDOM = [
   "#549EFF",
   "#229B49",
   "#F7A927",
   "#F56D98",
   "#F02424",
   "#D38334",
   "#474780",
   "#215DE5",
   "#C9A284",
   "#9D4EE0",
   "#18C1ED",
   "#DC3600",
   "#799AFF",
   "#41B65B",
   "#686C33",
   "#FF7968",
   "#B19067",
   "#E32A6D",
   "#1888EC",
   "#05D7B8"
]


//export const CATEGORY_COLORS = TESTCOLORS3;
export const CATEGORY_COLORS = PSEUDORANDOM;


// 3 color interpolate
//export const CATEGORY_COLORS = ['#ffa500', '#fa9c2c', '#f59341', '#ef8a52', '#e98161', '#e2786f', '#dc6f7b', '#d46688', '#cc5d94', '#c354a0', '#b94bac', '#ae41b8', '#a138c4', '#932ed0', '#8224db', '#6c19e7', '#4e0df3', '#0000ff'];

// 3 color interpolate
//export const CATEGORY_COLORS = ['#ff0000', '#f80023', '#f10038', '#ea004a', '#e3005b', '#db006b', '#d2007a', '#c90089', '#c00097', '#b600a5', '#aa00b2', '#9f00be', '#9100cb', '#8300d6', '#7200e1', '#5d00ec', '#4200f6', '#0000ff']

// MAP KEY 1
//export const CATEGORY_COLORS = [ "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#abdda4","#66c2a5","#3288bd","#5e4fa2"]

// wes anderson shortlist
// export const CATEGORY_COLORS = ['#258CD6', '#159417', '#F0BA2A', '#F52D3C']

// hot colors shortlist
// export const CATEGORY_COLORS = ["#FF4000","#009922","#0646fa"];


// ###############################
// FUCK COLORS, MY SOUL IS GRAY
// ###############################

// NO COLOR
// kind of meh, but also whatever. could get icons for visual interest
// export const CATEGORY_COLORS = [];

// PERIODIC TABLE / DEWEY DECIMAL 
// major groupings of categories share a color
// export const CATEGORY_COLORS = []; // TODO

// PERIODIC TABLE-ISH
// groupings share a color, but L values are unique
// export const CATEGORY_COLORS = []; // TODO

// BIPHASIC COLORS OR OTHER CARTOGRAPHIC 
// export const CATEGORY_COLORS = []; // TODO

// CRAYOLA BOX / CREATIVE MORNINGS
// just color explosion, who cares
// but are there enough categories to seem like an explosion?
// export const CATEGORY_COLORS = []; // TODO

// TRUE RAINBOW / SPECTRUM
// just rotate through hue bro
// export const CATEGORY_COLORS = []; // TODO