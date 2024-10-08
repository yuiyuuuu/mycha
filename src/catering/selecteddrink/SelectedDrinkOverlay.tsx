import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { sortAlphaName } from "../../helper/sortAlpha";

import { sortBySize } from "../../helper/sortBySize";

import { makePostRequest } from "../../helper/ajaxRequests";

// import XIcon from "../../global/XIcon";

import "./sdo.scss";
import { dispatchSetCart } from "../../store/cart";

// interface drink{
//   id: string,
//   sizes: Array<Object>,
//   customizations: Array<Object>,
//   cateringActive: boolean,

// }

const SelectedDrinkOverlay = ({
  cateringDrinkSorted,
}: {
  cateringDrinkSorted: object;
}) => {
  const nav = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  //ready states
  const [customizationsReady, setCustomizationsReady] =
    useState<Boolean>(false);

  const [allDrinksSorted, setAllDrinksSorted] = useState<Array<Object>>([]);
  console.log(allDrinksSorted, "all");

  //values
  const [customizations, setCustomizations] = useState<Object>({});

  const [drinkQty, setDrinkQty] = useState<Number | null>(0);
  const [drinkQtyError, setDrinkQtyError] = useState<boolean>(false);

  //size of X icon
  const [size, setSize] = useState<object>({});

  //selected drink
  const [drink, setDrink] = useState<Object>({});
  console.log(drink, "fdr");

  const [showDesc, setShowDesc] = useState(false);

  const [height, setHeight] = useState(0);

  async function atc() {
    //animation of previous atc is still going, prevents spam
    if ($(".sdo-atcb").hasClass("sdo-atcclick")) return;

    //customization
    const customizationArray = [];

    Object.values(customizations).forEach((t) => {
      //no length, single object
      if (!t?.length && t?.length !== 0) {
        customizationArray.push(t);
      } else {
        //array aka multiselect, so we push all the values into the result array
        customizationArray.push(...t);
      }
    });

    // console.log(customizationArray, "arr");

    // //drink
    // const drinkCopy = drink
    // delete drinkCopy.img

    const obj = {
      cartId: cart?.id || null,
      drinkId: drink.id,
      sizeId: size.id,
      customizations: customizationArray,
      qty: drinkQty,
    };

    console.log(obj, "obj");

    await makePostRequest("catering/atc", obj)
      .then((res) => {
        console.log(res, "response");
        //res will probably be the cart because what if the user did not have a cart to start with. we can simply replace it now

        //set the cart to the state
        dispatch(dispatchSetCart(res));

        //set the id of the cart to localstorage
        window.localStorage.setItem("cartid", res.id);

        //added to cart animation
        $(".sdo-atcb").addClass("sdo-atcclick");

        setTimeout(() => {
          $(".sdo-atcb").removeClass("sdo-atcclick");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, please try again");
      });
  }

  //sort all drinks into one array and sort it
  useEffect(() => {
    const drinks = Object.values(cateringDrinkSorted);

    if (!drinks.length) return;

    setAllDrinksSorted(
      drinks.flat().sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [cateringDrinkSorted]);

  useEffect(() => {
    if (!allDrinksSorted.length) {
      return;
    }

    const id = params.drinkid;

    //if no id, set first drink on the sorted list
    if (!id) {
      setDrink(allDrinksSorted[0]);
      setSize(allDrinksSorted[0].sizes.sort(sortBySize)[0]);
    } else {
      const find = allDrinksSorted.find((t) => t.id === id);

      if (find) {
        setDrink(find);

        //set the drink minimum, rounded up to the nearest 5
        setDrinkQty(Math.ceil(find.minimum / 5) * 5);

        setSize(find.sizes.sort(sortBySize)[0]);
      } else {
        setDrink(allDrinksSorted[0]);

        //set the drink qty
        setDrinkQty(Math.ceil(allDrinksSorted[0].minimum / 5) * 5);
      }
    }
  }, [allDrinksSorted, window.location.href]);

  useEffect(() => {
    setHeight($("#mitem-height-ch").outerHeight());
  }, [$("#mitem-height-ch")]);

  //initial set of the size of X
  // useEffect(() => {
  //   setSize(window.innerWidth < 600 ? "15px" : "25px");
  // }, []);

  // const resize = useCallback(() => {
  //   const width = window.innerWidth;

  //   if (width < 600) {
  //     setSize("15px");
  //   } else {
  //     setSize("25px");
  //   }
  // }, []);

  // $(window).unbind("resize", resize).on("resize", resize);

  //set customizations state
  useEffect(() => {
    if (!drink.customizations) return;

    const obj = {};

    drink.customizations?.forEach((t) => {
      //if default value is added, change here first
      !t.selectMultiple
        ? (obj[t.id] ||= t.values?.sort(sortAlphaName)[0])
        : (obj[t.id] ||= []); //array if we can select multiple, but i dont think many customizations will need selectmultiple
    });

    setCustomizations(obj);
    setCustomizationsReady(true);
  }, [drink]);

  const qtyInputFocusOut = useCallback(() => {
    //if the drink qty input is null
    if (!drinkQty) {
      setDrinkQty(drink.minimum);
      setDrinkQtyError(true);
      return;
    }

    if (Number(drinkQty) < Number(drink.minimum)) {
      setDrinkQty(drink.minimum);
      setDrinkQtyError(true);
    }
  }, [drinkQty, drink]);

  $("#sdo-qtyinput").unbind("focusout").on("focusout", qtyInputFocusOut);

  //not loaded yet, can add loading component here later
  if (!allDrinksSorted.length || !drink?.id || !customizationsReady) return;

  return (
    <div className='sdo-main'>
      <div className='sdo-in'>
        {/* <XIcon
          top={"5%"}
          right={"5%"}
          size={size}
          func={function () {
            $(".sdo-main").css("animation", "sdoout .5s ease");

            //allow scroll to remove weird glitching of scroll bar
            $("html").css("overflow", "unset");
            setTimeout(() => {
              nav("/catering");
              //475 cuz if we set it to 500, which is the animation length, it will actually show the elemnt for a split second and it looks weird
            }, 475);
          }}
          zindex={10}
        /> */}
        <div className='sdo-m'>
          <div className='sdo-left'>
            <div className='sdo-t'>DRINKS</div>
            {allDrinksSorted?.map((t) => (
              <div
                className='sdo-v'
                onClick={() => {
                  //same drink
                  if (drink.id === t.id) return;

                  $(".sdo-in").addClass("sdo-f");

                  setTimeout(() => {
                    $(".sdo-in").removeClass("sdo-f");
                  }, 510);

                  setTimeout(() => {
                    nav(`/catering/${t.id}`);
                  }, 150);
                }}
                style={{ color: t.id === drink.id && "rgb(109, 214, 49)" }}
              >
                {t.name}
              </div>
            ))}
          </div>
          <div className='sdo-right'>
            <div className='mitem-container sdo-container'>
              <div className='mitem-imgcontainer'>
                <img
                  src={
                    drink.img
                      ? `data:image/jpeg;base64,${drink.img}`
                      : drink.pathname
                  }
                  className='mitem-img'
                  alt='cup'
                />
              </div>
              <div className='mitem-tableouter'>
                <div
                  className='mitem-head sdo-head'
                  style={{ marginBottom: "8px" }}
                >
                  {drink.name}
                </div>
                <div className='sdo-pc f-s-main'>${size?.price.toFixed(2)}</div>
                <div className='mitem-f'>
                  <div>
                    <div
                      className='mitem-sel'
                      onClick={() => {
                        setShowDesc((prev) => !prev);
                      }}
                      style={{ marginBottom: showDesc && 0 }}
                    >
                      Description
                      <div className='grow' />
                      <div
                        className='mitem-caret'
                        style={{ transform: !showDesc && "rotate(-90deg)" }}
                      />
                    </div>

                    <div
                      style={{ marginBottom: showDesc ? "20px" : 0 }}
                      className='mitem-mar'
                    />

                    <div
                      className='mitem-height mitem-desc'
                      style={{
                        maxHeight: showDesc ? height : 0,
                      }}
                    >
                      <div id='mitem-height-ch'>{drink?.desc}</div>
                    </div>

                    <div
                      style={{ marginBottom: showDesc ? "30px" : 0 }}
                      className='mitem-mar'
                    />
                  </div>

                  <div>
                    <div className='mitem-sel' style={{ cursor: "unset" }}>
                      Customize
                    </div>

                    <div>
                      <div className='sdo-l'>Size</div>

                      <div>
                        <div className='sdo-custm'>
                          {drink?.sizes.sort(sortBySize).map((s) => (
                            <div
                              className='sdo-custc sdo-chov'
                              onClick={() => setSize(s)}
                              style={{
                                // backgroundColor:
                                //   s.id === size.id ? "#edeff1" : "unset",
                                border:
                                  s.id === size.id
                                    ? "1.5px solid black"
                                    : "1.5px solid #edeff1",
                              }}
                            >
                              {s.name[0].toUpperCase() + s.name.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* <div className='sdo-div' /> */}

                    {drink.customizations?.sort(sortAlphaName).map((t) => (
                      <div>
                        <div className='sdo-div' />

                        <div className='sdo-l'>{t.name}</div>

                        {/* <div className='sdo-custm'>
                          {t.value.split(",").map((v) => (
                            <div className='sdo-custc'>{v}</div>
                          ))}
                        </div> */}

                        <div className='sdo-custm'>
                          {t.values.map((v) => (
                            <div
                              className='sdo-custc'
                              style={{
                                border: !t.selectMultiple
                                  ? v.id === customizations[t.id]?.id
                                    ? "1.5px solid black"
                                    : "1.5px solid #edeff1"
                                  : customizations[t.id]
                                      ?.map((x) => x.id)
                                      .includes(v.id)
                                  ? "1.5px solid black"
                                  : "1.5px solid #edeff1",
                              }}
                              onClick={() =>
                                setCustomizations((prev) => {
                                  //the final object we will set as customizations
                                  const obj = { ...prev };

                                  //single select input
                                  if (!t.selectMultiple) {
                                    obj[t.id] = v;

                                    //multi select input
                                  } else {
                                    //see if this value is already selected
                                    const find = obj[t.id].find(
                                      (q) => q.id === v.id
                                    );

                                    //did not find the current "v" value, meaning we will push into the array
                                    if (!find) {
                                      obj[t.id] = [...obj[t.id], v];
                                    } else {
                                      obj[t.id] = obj[t.id].filter(
                                        (r) => r.id !== v.id
                                      );
                                    }
                                  }

                                  return obj;
                                })
                              }
                            >
                              {v.name}
                            </div>
                          ))}
                        </div>
                        {/* <div className='sdo-div' /> */}
                      </div>
                    ))}

                    <div
                      className='flexa sdo-bqtycon'
                      style={{ paddingBottom: "10px" }}
                    >
                      {/* <div className='sdo-l'>Quantity</div> */}

                      <div className='sdo-qp'>
                        <div className='sdo-custm sdo-qcon'>
                          <div
                            className='sdo-editqty sdo-w'
                            onClick={() =>
                              setDrinkQty((prev) => {
                                if (prev - 5 < Number(drink.minimum)) {
                                  setDrinkQtyError(true);
                                  return prev;
                                } else {
                                  return Number(prev - 5);
                                }
                              })
                            }
                          >
                            -5
                          </div>
                          <div className='sdo-qty'>
                            <input
                              className='sdo-qtyinput'
                              value={drinkQty}
                              id='sdo-qtyinput'
                              type='number'
                              onChange={(e) => {
                                //set the drink qty error state to false
                                setDrinkQtyError(false);

                                //set it to null if the input is set to nothing by the user
                                //in the focus out function, we will check to see if the user set anything in the input
                                //if not, we will set it to the drink minimum in the focus out function
                                if (!e.target.value) {
                                  setDrinkQty(null);
                                  return;
                                }

                                //check to see if the input value has any non numerical values
                                if (/^\d+$/.test(e.target.value)) {
                                  //keep the number of drinks per add under 500.
                                  if (Number(e.target.value) > 500) {
                                    setDrinkQty(500);

                                    return;
                                  }

                                  // if (Number(e.target.value) < drink.minimum) {
                                  //   setDrinkQty(drink.minimum);
                                  //   setDrinkQtyError(true);
                                  //   return;
                                  // }

                                  setDrinkQty(Number(e.target.value));
                                  return;
                                }

                                //if the input value does not include any letters
                                return;
                              }}
                            />
                          </div>
                          <div
                            className='sdo-editqty sdo-g'
                            onClick={() =>
                              setDrinkQty((prev) => {
                                setDrinkQtyError(false);
                                return Number(prev + 5);
                              })
                            }
                          >
                            +5
                          </div>
                        </div>

                        {drinkQtyError && (
                          <div className='sdo-qtyerr'>
                            Min Quantity is {drink.minimum}
                          </div>
                        )}
                      </div>

                      <div className='sdo-atc' onClick={() => atc()}>
                        <div className='sdo-atcb'>
                          <div className='sdo-atcc'>Successfully Added!</div>
                          <div className='sdo-atcc'>Add to Cart</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedDrinkOverlay;
