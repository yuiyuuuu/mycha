import React from "react";
import { getPercentDailyValue } from "./dvFunctions";

const NutritionTable = ({ nutrition, index }) => {
  console.log(nutrition, "nut");
  return (
    <table
      className='table-head'
      id={`tablehead-${index}`}
      style={{ marginTop: "1rem" }}
    >
      <thead>
        <tr className='align-left tworem'>
          <th colSpan={2} style={{ paddingBottom: ".6rem" }} className='f500'>
            Nutrition Facts
          </th>
        </tr>
        <tr className='align-left'>
          <th colSpan={2} className='f500'>
            {nutrition.nutrition?.number_of_servings || 1000} servings per
            container
          </th>
        </tr>
        <tr className='align-left px4-888' style={{ borderWidth: "8px" }}>
          <th
            className='tr-top f500'
            scope='row'
            style={{ paddingTop: 0, paddingBottom: ".5rem" }}
          >
            Serving Size
          </th>
          <td className='align-right tr-top f500'>
            <span>
              {nutrition.nutrition.serving_size_unit} (
              {nutrition.nutrition.serving_size_grams}g)
            </span>
          </td>
        </tr>
        <tr className='align-left px4-888'>
          <th className='tr-top' scope='row'>
            Amount per serving
            <br />
            <span className='tworem'>Calories</span>
          </th>
          <td className='align-right tr-top'>
            <span style={{ fontSize: "27px" }}>
              {nutrition.nutrition?.calories}
            </span>
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <td aria-hidden='true'></td>
          <th className='align-right tr-bot' scope='col'>
            % Daily Value*
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Total Fat{" "}
            <span className='f500'>&nbsp;{nutrition.nutrition?.total_fat}g</span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition.total_fat, "total_fat")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            <span className='f500'>
              &nbsp; &nbsp;&nbsp;&nbsp;Saturated Fat &nbsp;
              {nutrition.nutrition?.saturated_fat}g
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(
              nutrition.nutrition?.saturated_fat,
              "saturated_fat",
            )}
            %
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            <span className='f500'>
              &nbsp; &nbsp;&nbsp;&nbsp;Trans Fat &nbsp;
              {nutrition.nutrition?.trans_fat}g
            </span>
          </th>
          <td className='align-right tr-bot'></td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Sodium{" "}
            <span className='f500'>&nbsp;{nutrition.nutrition?.sodium}g</span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.sodium, "sodium")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Total Carbohydrate{" "}
            <span className='f500'>
              &nbsp;{nutrition.nutrition?.total_carbohydrates}g
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(
              nutrition.nutrition?.total_carbohydrates,
              "total_carbohydrate",
            )}
            %
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            <span className='f500'>
              &nbsp; &nbsp; &nbsp;&nbsp;Dietary Fiber &nbsp;
              {nutrition.nutrition?.dietary_fiber}g
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.fiber, "dietary_fiber")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            <span className='f500'>
              &nbsp; &nbsp; &nbsp;&nbsp;Total Sugars &nbsp;
              {nutrition.nutrition?.total_sugars}g
            </span>
          </th>
          <td className='align-right tr-bot'></td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            <span className='f500'>
              &nbsp; &nbsp; &nbsp;&nbsp;Includes &nbsp;
              {nutrition.nutrition?.added_sugars}g Added Sugars
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(
              nutrition.nutrition?.added_sugars,
              "added_sugars",
            )}
            %
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Protein
            <span className='f500'>
              &nbsp;
              {nutrition.nutrition?.protein}g
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.protein, "protein")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Vitamin D
            <span className='f500'>
              &nbsp;
              {nutrition.nutrition?.vitaminD}mcg
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.vitaminD, "vitamin_d")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Calcium
            <span className='f500'>
              &nbsp;
              {nutrition.nutrition?.calcium}mcg
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.calcium, "calcium")}%
          </td>
        </tr>
        <tr className='align-left px1-888'>
          <th scope='row'>
            Iron
            <span className='f500'>
              &nbsp;
              {nutrition.nutrition?.iron}mg
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.iron, "iron")}%
          </td>
        </tr>
        <tr className='align-left px1-888' style={{ borderWidth: "6px" }}>
          <th scope='row'>
            Potassium
            <span className='f500'>
              &nbsp;
              {nutrition.nutrition?.potassium}mg
            </span>
          </th>
          <td className='align-right tr-bot'>
            {getPercentDailyValue(nutrition.nutrition?.potassium, "potassium")}%
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NutritionTable;
