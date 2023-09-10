import React from "react";
import { useNavigate } from "react-router";
import ImagetoSvg from "../checkerimages/ImgtoSvg";

import "./ct.scss";

const CheckerTable = ({ info }) => {
  const nav = useNavigate();

  return (
    <div className='ct-parent'>
      <table className='ct-table'>
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(info).map((v) => (
            <tr onClick={() => nav(`/menu/${info[v].v.drink.id}`)}>
              <td>
                <ImagetoSvg image={info[v].v.img} idv={info[v].v.id} />
              </td>
              <td>{v}</td>

              <td>{info[v].quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckerTable;