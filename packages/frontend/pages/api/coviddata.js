const fetch = require('isomorphic-unfetch');
import dayjs from 'dayjs';

const daysBetween = 3;
const comparisonKey = "positive";



const STATE_HASH = {
	"AL": "Alabama",
	"AK": "Alaska",
	"AS": "American Samoa",
	"AZ": "Arizona",
	"AR": "Arkansas",
	"CA": "California",
	"CO": "Colorado",
	"CT": "Connecticut",
	"DE": "Delaware",
	"DC": "District Of Columbia",
	"FM": "Federated States Of Micronesia",
	"FL": "Florida",
	"GA": "Georgia",
	"GU": "Guam",
	"HI": "Hawaii",
	"ID": "Idaho",
	"IL": "Illinois",
	"IN": "Indiana",
	"IA": "Iowa",
	"KS": "Kansas",
	"KY": "Kentucky",
	"LA": "Louisiana",
	"ME": "Maine",
	"MH": "Marshall Islands",
	"MD": "Maryland",
	"MA": "Massachusetts",
	"MI": "Michigan",
	"MN": "Minnesota",
	"MS": "Mississippi",
	"MO": "Missouri",
	"MT": "Montana",
	"NE": "Nebraska",
	"NV": "Nevada",
	"NH": "New Hampshire",
	"NJ": "New Jersey",
	"NM": "New Mexico",
	"NY": "New York",
	"NC": "North Carolina",
	"ND": "North Dakota",
	"MP": "Northern Mariana Islands",
	"OH": "Ohio",
	"OK": "Oklahoma",
	"OR": "Oregon",
	"PW": "Palau",
	"PA": "Pennsylvania",
	"PR": "Puerto Rico",
	"RI": "Rhode Island",
	"SC": "South Carolina",
	"SD": "South Dakota",
	"TN": "Tennessee",
	"TX": "Texas",
	"UT": "Utah",
	"VT": "Vermont",
	"VI": "Virgin Islands",
	"VA": "Virginia",
	"WA": "Washington",
	"WV": "West Virginia",
	"WI": "Wisconsin",
	"WY": "Wyoming"
}


const getPlaces = async () => {
   
   const response = await fetch('https://covidtracking.com/api/v1/states/current.json');
   const today = await response.json();
   const todayDate = today[0].dateModified;

   const response1 = await fetch(`https://covidtracking.com/api/states/daily.json?date=${dayjs(todayDate).subtract(daysBetween, 'day').format('YYYYMMDD')}`);
   const MINUS1 = await response1.json();
   const minus1Map =  Object.assign({}, ...MINUS1.map(s => ({[s.state]: s})));

   const response2 = await fetch(`https://covidtracking.com/api/states/daily.json?date=${dayjs(todayDate).subtract((daysBetween*2), 'day').format('YYYYMMDD')}`);
   const MINUS2 = await response2.json();
   const minus2Map =  Object.assign({}, ...MINUS2.map(s => ({[s.state]: s})));

   //const rawToday = TODAY;
   const normalizedPlaces = normalizePlaces(today, minus1Map, minus2Map);
   return normalizedPlaces;
}


const normalizePlaces = (today, minus1Map, minus2Map) => {
   return today.map((todayPlace, i) => {
	
      // how many per day?
      const perDay = todayPlace[comparisonKey] - minus1Map[todayPlace.state][comparisonKey];
   
      // find doubling duration (days) for yesterday -> today
      const doublingDays = findDoublingDays(1, minus1Map[todayPlace.state][comparisonKey], todayPlace[comparisonKey]);
      
      // small numbers make doubling rates pointless (TODO: adjust number as necessary)
      const notEnoughData = (todayPlace[comparisonKey] < 2 || perDay < 2);
   
      // get color for doublingDays, but don't get a color if we've decided there's not enough data
      const doublingDaysColor = (notEnoughData) ? getDoublingDaysColor(false) : getDoublingDaysColor(doublingDays);
   
      // find doubling duration (days) for 2 days ago -> yesterday
      const previousDoublingDays = findDoublingDays(1, minus2Map[todayPlace.state][comparisonKey], minus1Map[todayPlace.state][comparisonKey]);
   
      // difference between two doubling times, shows accelleration / decelleration
      const rateDiff = doublingDays - previousDoublingDays;
   
      // display-friendly string like "3.2" instead of 3.2429i4
      const doublingDaysString = doublingDays.toFixed(1);
      const previousDoublingDaysString = previousDoublingDays.toFixed(1);
      
   
      const completePlace = {
         ...todayPlace, 
         name: STATE_HASH[todayPlace.state],
         perDay,
         doublingDaysColor,
         doublingDays,
         previousDoublingDays,
         doublingDaysString,
         previousDoublingDaysString,
         notEnoughData,
         rateDiff
      };
      return completePlace;
   }).sort((a,b) => {
      
      const ad = a.doublingDays || 100;
      const bd = b.doublingDays || 100;
      return ad - bd;
   });
}


const getDoublingDaysColor = (value) => {
	const start = 1;
	const end = 7;
	const clippedValue = Math.min(Math.max(value, start), end);
	const normalizedValue = ((clippedValue - start) * 100 ) / (end - start) / 100;

	if(!value){
		return '#eee';
	}

	var color1 = 'eebb30';
	var color2 = 'ee0030';
	var ratio = normalizedValue;
	var hex = function(x) {
		 x = x.toString(16);
		 return (x.length == 1) ? '0' + x : x;
	};
	
	var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
	
	var valueColor = '#' + hex(Math.min(255,r)) + hex(Math.min(255,g)) + hex(Math.min(255,b));
	return valueColor;
}

const findDoublingDays = (days, startValue, endValue) => {
	// https://blog.datawrapper.de/weekly-chart-coronavirus-doublingtimes/
	// supposedly this is right: =(x*ln(2))/(ln(y/z))
	// x is the time that has passed since you started measuring. For example, if the number of cases went from 500 on day 0 to 1000 on day 2, x is 2.
	// y is the number of cases on day x, e.g 1000 on day 2.
	// z is the number of cases on day 0, e.g. 500
	return (days*Math.log(daysBetween))/(Math.log(endValue/startValue));
}

export default async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	const places = await getPlaces();
	res.end(JSON.stringify(places));
}