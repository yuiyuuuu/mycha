import React from "react";
import { getPercentDailyValue } from "./dvFunctions";

const NutritionTable = ({ nutrition, index }) => {
  return (
    <table className='table-head' id={`tablehead-${index}`}>
      <tr className='align-left'>
        <th className='f500'>1 serving per container</th>
      </tr>
      <tr className='align-left px4-888'>
        <th className='tr-top f500'>Serving Size</th>
        <th className='align-right tr-top f500'>
          <span>
            {/* {nutrition.nutrition.serving_size_unit} ( */}
            {/* {nutrition.nutrition.serving_size_grams}g) */}1 Cup (
            {nutrition.nutrition.quanity}ml)
          </span>
        </th>
      </tr>
      <tr className='align-left px4-888'>
        <th className='tr-top '>
          Amount per serving
          <br />
          <span style={{ fontSize: "27px" }}>Calories</span>
        </th>
        <th className='align-right tr-top'>
          <span style={{ fontSize: "27px" }}>
            {nutrition.nutrition?.calories}
          </span>
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th></th>
        <th className='align-right tr-bot'>% Daily Value</th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          Total Fat{" "}
          <span className='f500'>&nbsp;{nutrition.nutrition?.total_fat}g</span>
        </th>
        <th className='align-right tr-bot'>
          {getPercentDailyValue(nutrition.nutrition.total_fat, "total_fat")}%
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          <span className='f500'>
            &nbsp; &nbsp;&nbsp;&nbsp;Saturated Fat &nbsp;
            {nutrition.nutrition?.saturated_fat}g
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(
            nutrition.nutrition?.saturated_fat,
            "saturated_fat",
          )}
          %
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          <span className='f500'>
            &nbsp; &nbsp;&nbsp;&nbsp;Trans Fat &nbsp;
            {nutrition.nutrition?.trans_fat}g
          </span>
        </th>
        <th className='align-right tr-bot'></th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          Sodium{" "}
          <span className='f500'>&nbsp;{nutrition.nutrition?.sodium}g</span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.sodium, "sodium")}%
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          Total Carbohydrate{" "}
          <span className='f500'>
            &nbsp;{nutrition.nutrition?.total_carbohydrates}g
          </span>
        </th>
        <th className='align-right tr-bot'>
          {getPercentDailyValue(
            nutrition.nutrition?.total_carbohydrates,
            "total_carbohydrate",
          )}
          %
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          <span className='f500'>
            &nbsp; &nbsp; &nbsp;&nbsp;Dietary Fiber &nbsp;
            {nutrition.nutrition?.dietary_fiber}g
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(
            nutrition.nutrition?.dietary_fiber,
            "dietary_fiber",
          )}
          %
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          <span className='f500'>
            &nbsp; &nbsp; &nbsp;&nbsp;Total Sugars &nbsp;
            {nutrition.nutrition?.total_sugars}g
          </span>
        </th>
        <th className='align-right tr-bot'></th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          <span className='f500'>
            &nbsp; &nbsp; &nbsp;&nbsp;Includes &nbsp;
            {nutrition.nutrition?.added_sugars}g Added Sugars
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(
            nutrition.nutrition?.added_sugars,
            "added_sugars",
          )}
          %{" "}
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          Protein
          <span className='f500'>
            &nbsp;
            {nutrition.nutrition?.protein}g
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.protein, "protein")}%
        </th>
      </tr>
      <tr className='align-left px1-888'>
        <th>
          Vitamin D
          <span className='f500'>
            &nbsp;
            {nutrition.nutrition?.vitaminD}mcg
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.vitaminD, "vitamin_d")}%
        </th>
      </tr>{" "}
      <tr className='align-left px1-888'>
        <th>
          Calcium
          <span className='f500'>
            &nbsp;
            {nutrition.nutrition?.calcium}mcg
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.calcium, "calcium")}%
        </th>
      </tr>{" "}
      <tr className='align-left px1-888'>
        <th>
          Iron
          <span className='f500'>
            &nbsp;
            {nutrition.nutrition?.iron}mg
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.iron, "iron")}%
        </th>
      </tr>{" "}
      <tr className='align-left px1-888'>
        <th>
          Potassium
          <span className='f500'>
            &nbsp;
            {nutrition.nutrition?.potassium}mg
          </span>
        </th>
        <th className='align-right tr-bot'>
          {" "}
          {getPercentDailyValue(nutrition.nutrition?.potassium, "potassium")}%
        </th>
      </tr>
    </table>
  );
};

export default NutritionTable;
