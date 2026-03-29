//this file contains all FDA numbers that will be used to calculate DV percentages.
//All numbers here are extracted from the FDA website.
//https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels

//All dv values will not be stored in the database. Instead only the raw editable values will be stored
//that is because if the fda numbers change, then it can be easily fixed by simply changing the fda value here.
//if the dv value is stored in the database, then we will have to reseed everything

//this is the list of mandatory information and their respective values
export const dailyValues = {
  calories: { value: null, unit: null },
  total_fat: { value: 78, unit: "g" },
  saturated_fat: { value: 20, unit: "g" },
  trans_fat: { value: null, unit: "g" },
  cholesterol: { value: 300, unit: "mg" },
  sodium: { value: 2300, unit: "mg" },
  total_carbohydrate: { value: 275, unit: "g" },
  dietary_fiber: { value: 28, unit: "g" },
  total_sugars: { value: null, unit: "g" },
  added_sugars: { value: 50, unit: "g" },
  protein: { value: 50, unit: "g" },
  vitamin_d: { value: 20, unit: "mcg" },
  calcium: { value: 1300, unit: "mg" },
  iron: { value: 18, unit: "mg" },
  potassium: { value: 4700, unit: "mg" },
};

//this function will be used to calculate the DV % value
export function getPercentDailyValue(amount, key) {
  const dv = dailyValues[key];

  if (!dv || dv.value == null || amount == null) return null;

  return Math.round((amount / dv.value) * 100);
}
