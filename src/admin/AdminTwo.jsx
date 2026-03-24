import React, { useEffect, useState, useCallback } from "react";
import "./admin.scss";
import { location2 as location } from "../location/locationsobj";

import $ from "jquery";

import StockSlots from "./StockSlots";
import { useDispatch, useSelector } from "react-redux";
import { dispatchSetDrinks } from "../store/drinks";

//notes: columns goes from 1, 2, 3, 4, 5, 6
//rows is 0 index, goes 0, 1, 2, 3, 4, 5, 6

const Admin = () => {
  const dispatch = useDispatch();

  const [stock, setStock] = useState(
    Array(6).fill({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    }),
  );
  //first number is row, second is column
  const [selectedCoordinates, setSelectedCoordinates] = useState([0, 1]);

  const [locations, setLocations] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionActive, setRegionActive] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedLocation2, setSelectedLocation2] = useState(); //used to fetch actual stock
  const [locationActive, setLocationActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [lastUpdated, setLastUpdated] = useState("");

  // const [editingTime, setEditingTime] = useState(false);
  // const [overwriteTimeValue, setOverwriteTimeValue] = useState(null);

  const drinks = useSelector((state) => state.drinks);
  const [drinkImgObj, setDrinkImgObj] = useState(null);
  const [imgReady, setImgReady] = useState(false);
  const [layout, setLayout] = useState(null);

  const [memo, setMemo] = useState(null);

  const [editingMemo, setEditingMemo] = useState(false);
  const [memoInputValue, setMemoInputValue] = useState("");

  function set(num) {
    //means nothing selected
    if (!selectedCoordinates.length) return;

    const r = selectedCoordinates[0];
    const c = selectedCoordinates[1];
    const copy = stock.slice();

    copy[r] = { ...copy[r], [c]: num };
    setStock(copy);

    //end of the machine, dont go any further
    if (c === 7 && r === 5) {
      return;
    }

    if (c === 7) {
      setSelectedCoordinates([r + 1, 1]);
    } else {
      setSelectedCoordinates([r, c + 1]);
    }
  }

  const setMarginTop = useCallback(() => {
    const v = document.querySelector(".nav-home").getBoundingClientRect();

    $(".stock-parent").css("margin-top", v.height + 30 + "px");
  }, []);

  async function handleSubmit() {
    const s = stock.slice().map((v) => Object.values(v));

    setLoading(true);

    $.ajax({
      type: "POST",
      url: "/sendstock2",
      data: {
        data: JSON.stringify(s),
        location: JSON.stringify(selectedLocation),
        memo: JSON.stringify(memoInputValue.length > 0 ? memoInputValue : ""),
      },
    })
      .then((res) => {
        if (res.status === "success") {
          const date = new Date(res.time * 1000).toLocaleString("en-US", {
            timeZone: "America/Chicago",
          });

          setLastUpdated(date);
          setMemoInputValue(null);
          setEditingMemo(false);

          alert("successfully updated");
          handleFetch();
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
        setLoading(false);
      });
  }

  async function handleFetch() {
    setLoading(true);

    async function f(count) {
      $.ajax({
        type: "GET",
        url: `/fetchstock2/${selectedLocation}`,
      })
        .then(async (res) => {
          let nostock = false;

          if (typeof res !== "object") {
            if (count > 6) {
              //over 6 times, files most likely doesnt exist
              // //change something here. s3 should return "not found" or something. need a test location without a stock file to see what it is.
              // alert("Something went wrong, please try again"); // if recursive run more than 8 times, something is probably wrong
              // setLoading(false);
              setStock(
                Array(6).fill({
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                  6: 0,
                  7: 0,
                }),
              );

              nostock = true;
            } else {
              f(count + 1); //run again to see if its network or s3 error
              return;
            }
          }

          if (res?.memo) {
            setMemo(res.memo);
          } else {
            setMemo(null);
          }

          const result = [];

          if (res.time) {
            const date = new Date(res.time * 1000).toLocaleString("en-US", {
              timeZone: "America/Chicago",
            });

            setLastUpdated(date);
          } else {
            setLastUpdated("none");
          }

          await $.ajax({
            type: "GET",
            url: `${import.meta.env.VITE_ANDY_ENDPOINT}/${selectedLocation2}`,
          }).then((res) => {
            setLayout(res);
            setLoading(false);
          });

          if (nostock) return; //nostock flag above triggered

          if (res.stock) {
            res.stock.forEach((t) => {
              const inner = {};
              t.forEach((p, i) => {
                inner[i + 1] = p;
              });

              result.push(inner);
              setStock(result);
            });
          } else {
            setStock(
              Array(6).fill({
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
              }),
            );
          }
        })
        .catch(() => {
          alert("Something went wrong, please try again");
          setLoading(false);
        });
    }

    f(0);
  }

  useEffect(() => {
    if (!regionActive) return;

    const b = document.querySelector(".stock-region")?.getBoundingClientRect();
    $(".stock-regionoverlay").css(
      "top",
      window.scrollY + b.top + b.height + 5 + "px",
    );
    $(".stock-regionoverlay").css("left", b.left - $(this).width / 2);
  }, [regionActive]);

  useEffect(() => {
    if (!locationActive) return;

    const a = document
      .querySelector(".stock-location")
      ?.getBoundingClientRect();

    $(".stock-locationoverlay").css(
      "top",
      window.scrollY + a.top + a.height + 5 + "px",
    );
    $(".stock-locationoverlay").css("left", a.left - $(this).width / 2);
  }, [locationActive]);

  const setOverlayLocation = useCallback(() => {}, []);

  const clickout = useCallback(() => {
    var $target = $(event.target);

    if (
      !$target.closest(".stock-location").length &&
      !$target.closest(".stock-locationoverlay").length &&
      $(".stock-locationoverlay").is(":visible")
    ) {
      setLocationActive(false);
    }

    if (
      !$target.closest(".stock-region").length &&
      !$target.closest(".stock-regionoverlay").length &&
      $(".stock-regionoverlay").is(":visible")
    ) {
      setRegionActive(false);
    }
  }, []);

  $(document).off("click", document, clickout).click(clickout);

  useEffect(() => {
    $(document).ready(() => {
      setOverlayLocation();
    });

    window.addEventListener("resize", setOverlayLocation);

    return () => window.removeEventListener("resize", setOverlayLocation);
  }, [locations, locationActive, regionActive]);

  useEffect(() => {
    setMarginTop();

    window.addEventListener("resize", setMarginTop);

    return () => window.removeEventListener("resize", setMarginTop);
  }, []);

  useEffect(() => {
    if (!Object.keys(locations).length) return;
    handleFetch();
  }, [selectedLocation]);

  useEffect(() => {
    setLoading(true);

    async function f() {
      await $.ajax({
        type: "GET",
        url: `/fetchlocationsbyregion`,
      })
        .then((res) => {
          function swap(json) {
            var ret = {};
            for (var key in json) {
              ret[json[key]] ||= [];
              ret[json[key]].push(key);
            }

            return ret;
          }

          // const re = {};
          const s = swap(res);

          setLocations(s);
        })
        .catch(() => {
          alert("Something went wrong, refresh");
        });

      if (!drinks?.length) {
        await $.ajax({ type: "GET", url: "/fetchalldrinks" }).then((res) => {
          dispatch(dispatchSetDrinks(res));

          const obj = {};
          const all = [];

          res.forEach((v) => all.push(...v.drinks));

          all.forEach((drink) => {
            if (drink.machineImg.length > 0) {
              // const t = drink.fetchNames.split(",").map((v) => v.trim());

              // t.forEach((name) => {
              //   obj[name] ||= drink.img;
              // });

              drink.machineImg.forEach((mci) => {
                const t = mci.fetchNames.split(",").map((v) => v.trim());
                t.forEach((name) => {
                  obj[name] ||= mci;
                });
              });
            }
          });

          setDrinkImgObj(obj);
          setImgReady(true);
          setLoading(false);
        });
      }

      setLoading(false);
    }

    f();
  }, [drinks]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // if (loading || !imgReady) {
  //   return (
  //     <div
  //       className='lds-ring'
  //       style={{
  //         width: "100%",
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         zIndex: 11,
  //       }}
  //       id='spinner-form'
  //     >
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //       <div></div>
  //     </div>
  //   );
  // }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className='stock-parent'>
        <div className='stock-ei'>Stock</div>
        <div
          className='stock-region'
          onClick={() => setRegionActive((prev) => !prev)}
          style={{ marginBottom: "20px" }}
        >
          {selectedRegion || "Select a region"}
        </div>
        {selectedRegion && (
          <div
            className='stock-location'
            onClick={() => setLocationActive((prev) => !prev)}
            style={{ marginBottom: "20px" }}
          >
            {locations[selectedRegion].find(
              (v) =>
                v.replace(/ /g, "").replace(/[()]/g, "") === selectedLocation,
            ) || "Select a location"}
          </div>
        )}

        {memo && <div className='last-set'>Memo: {memo}</div>}

        {!editingMemo && selectedLocation && (
          <div className='stock-overwrite' onClick={() => setEditingMemo(true)}>
            Set Memo
          </div>
        )}

        {editingMemo && (
          <div className='stock-sd'>
            <div style={{ fontSize: "12px" }}>Set Memo</div>
            <input
              className='stock-memoinput'
              onChange={(e) => setMemoInputValue(e.target.value)}
            />
            <div className='stock-con'>
              <span
                className='stock-cancel'
                onClick={() => {
                  setEditingMemo(false);
                  setMemoInputValue(null);
                }}
              >
                Cancel
              </span>
            </div>
          </div>
        )}

        {selectedLocation && layout && (
          <div className='stock-slots'>
            {stock.map((item, i) => (
              <StockSlots
                item={item}
                index={i}
                setSelectedCoordinates={setSelectedCoordinates}
                selectedCoordinates={selectedCoordinates}
                stock={layout[i]}
                imgObj={drinkImgObj}
              />
            ))}
          </div>
        )}
        {regionActive && (
          <div
            className='stock-regionoverlay'
            style={{ display: !regionActive && "none" }}
          >
            {Object.keys(locations)?.map((item, i) => (
              <div
                className='stock-li'
                onClick={() => {
                  setSelectedRegion(item);
                  setRegionActive(false);
                }}
                style={{
                  borderRadius:
                    i === 0
                      ? "4px 4px 0 0"
                      : i === locations.length - 1
                        ? "0 0 4px 4px"
                        : "",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        {locationActive && selectedRegion && (
          <div
            className='stock-locationoverlay'
            style={{ display: !locationActive && "none" }}
          >
            {locations[selectedRegion]?.map((item, i) => (
              <div
                className='stock-li'
                onClick={() => {
                  setSelectedLocation(
                    item.replace(/ /g, "").replace(/[()]/g, ""),
                  );
                  setSelectedLocation2(item);
                  setLocationActive(false);
                }}
                style={{
                  borderRadius:
                    i === 0
                      ? "4px 4px 0 0"
                      : i === locations.length - 1
                        ? "0 0 4px 4px"
                        : "",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        {selectedLocation && (
          <div className='stock-numpad'>
            <div className='s-numpad-li' onClick={() => set(0)}>
              0
            </div>
            <div className='s-numpad-li' onClick={() => set(1)}>
              1
            </div>
            <div className='s-numpad-li' onClick={() => set(2)}>
              2
            </div>
            <div className='s-numpad-li' onClick={() => set(3)}>
              3
            </div>
            <div
              className='s-numpad-li'
              onClick={() => set(4)}
              style={{ marginRight: 0 }}
            >
              4
            </div>
          </div>
        )}
        {/* <div className='stock-drinkselect'>
          {allItems.map((drink) => (
            <AdminCups
              drink={drink}
              selectedDrink={selectedDrink}
              setSelectedDrink={setSelectedDrink}
            />
          ))}
        </div> */}
      </div>

      {selectedLocation && (
        <div className='stock-n'>
          <div className='stock-submit' onClick={() => handleSubmit()}>
            Submit
          </div>
        </div>
      )}

      {(loading || !imgReady) && (
        <div className='load-parent' style={{ display: !loading && "none" }}>
          <div
            className='lds-ring'
            style={{
              width: "100%",
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            id='spinner-form'
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
