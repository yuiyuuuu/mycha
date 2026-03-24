//stock checker main component

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dispatchSetLocations } from "../store/locations";

import $ from "jquery";

import { locationWithoutState } from "../location/locationsobj";

import "./quantity.scss";

import Row from "./Row";
import Leaf from "../longstuff/Leaf";
import { dispatchSetDrinks } from "../store/drinks";
import CheckerTable from "./checkertable/CheckerTable";
import { findURLInString } from "../helperfunctions";

const Checker = () => {
  const qtyRef = useRef(null);
  const states = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const regionWithLocations = useSelector((state) => state.locations);
  const drinkState = useSelector((state) => state.drinks); //menu drinks

  const [loading, setLoading] = useState(false);
  const [allLocations, setAllLocations] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [selected, setSelected] = useState({});
  const [showSelectRegion, setShowSelectRegion] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

  const [drinks, setDrinks] = useState([]);
  const [drinkImgObj, setDrinkImgObj] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [imgReady, setImgReady] = useState(false);

  async function handleChange(loc) {
    setLoading(true);

    let fetch_url = `${import.meta.env.VITE_ANDY_ENDPOINT}/${loc?.fetchName}`;

    async function f(count) {
      await $.ajax({
        type: "GET",
        url: fetch_url,
      })
        .then((res) => {
          // console.log("fetch_url", fetch_url, "res", res)

          if (
            res === "not found" ||
            !res ||
            !res.length ||
            res === "" ||
            typeof res !== "object"
          ) {
            //wont prevent all errors, but will decrease by alot for sure
            if (count < 9) {
              //less than 9 requests, keep running
              f(count + 1); //if return is nothing, meaning error, just rerun and eventually it will work
              return;
            } else {
              alert("Something went wrong, please refresh page"); //if doesnt work after 8 times, throw error
              setLoading(false);
              setDrinks([]);
            }
          }

          setDrinks(res);

          setSelectedLocation(loc);

          setLoading(false);
        })
        .catch(() => {
          alert("Something went wrong, please try again");
        });
    }

    f(0);
  }

  useEffect(() => {
    if (!drinkImgObj) return;
    if (!drinks.length) return;

    const obj = {};

    // Object.keys(drinkImgObj).forEach(
    //   (v) => (obj[v] ||= { quantity: 0, v: drinkImgObj[v] })
    // );

    drinks.forEach((v) => {
      v.forEach((vi) => {
        if (
          vi[0] === "Snack Small" ||
          vi[0] === "Snack" ||
          vi[0] === "Snack Large"
        )
          return;

        obj[vi[0]] ||= { quantity: 0, v: drinkImgObj[vi[0]] };
        obj[vi[0]].quantity += Number(vi[1]);
      });
    });

    setTableInfo(obj);
  }, [drinkImgObj, drinks]);

  useEffect(() => {
    window.scrollTo({ top: 0 }); //scroll to top, used if user is coming from locations page

    async function f() {
      await $.ajax({
        url: "/fetchallregions",
        type: "GET",
      })
        .then((res) => {
          dispatch(dispatchSetLocations(res));
        })
        .catch(() => {
          alert("Something went wrong, please try again");
        });

      if (!drinkState?.length) {
        await $.ajax({
          type: "GET",
          url: "/fetchalldrinks",
        })
          .then((res) => {
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
          })
          .catch((err) => {
            alert("Something went wrong, please try again");
          });
      } else {
        const obj = {};
        const all = [];

        drinkState.forEach((v) => all.push(...v.drinks));

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
      }
    }

    f();
  }, []);

  useEffect(() => {
    if (!regionWithLocations.length) return;

    const allLoc = regionWithLocations.map((v) => v.locations).flat(Infinity);
    setAllLocations(allLoc);

    const loc = params.location;
    // const regions = Object.keys(locationWithoutState);
    // for (let i = 0; i < regions.length; i++) {
    //   const find = locationWithoutState[regions[i]]?.find((v) => v.id === loc);
    //   if (find) {
    //     setSelectedRegion(regions[i]);
    //     handleChange(loc, regions[i]);
    //     break;
    //   }
    // }

    if (loc) {
      const find = allLoc.find((v) => v.id === loc);

      if (find) {
        setSelectedRegion(find.region.name);
        handleChange(find);
        setSelectedLocation(find);
      }
    }
  }, [regionWithLocations, window.location.href]);

  //handle inspect element resizing
  const resize = useCallback(() => {
    const f =
      document.getElementsByClassName("select-container3")[0]?.offsetHeight;
    let count2 = f;
    $(".li-contact").each((index, element) => {
      element.style.top = count2 + "px";
      count2 += element.offsetHeight;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const hoverRegion = useCallback(() => {
    setTimeout(() => {
      if ($("#select-region").is(":hover")) {
        setShowSelectRegion(true);
      }
    }, 300);
  }, []);

  const hoverOutRegion = useCallback(() => {
    setShowSelectRegion(false);
  }, []);

  const hoverLocation = useCallback(() => {
    setTimeout(() => {
      if ($("#select-location").is(":hover")) {
        setShowSelect(true);
      }
    }, 300);
  }, []);

  const hoverOutLocation = useCallback(() => {
    setShowSelect(false);
  }, []);

  useEffect(() => {
    if (!imgReady) return;
    $("#select-region").hover(hoverRegion, hoverOutRegion);
    return () => {
      //remove listeners
      $("#select-location").off();
      $("#select-region").off();
    };
  }, [imgReady]);

  useEffect(() => {
    if (!imgReady) return;
    $("#select-location").hover(hoverLocation, hoverOutLocation);
  }, [$("#select-location"), imgReady]);

  if (!imgReady) {
    return (
      <div
        className='lds-ring'
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 11,
        }}
        id='spinner-form'
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <div className='quantity-container'>
      <div className='quantity-locationcontainer'>
        <div className='location-name2' style={{ marginBottom: 0 }}>
          Mycha Location Stock Checker
        </div>
        <Leaf />
        <div className='location-name2' style={{ marginBottom: "15px" }}>
          Choose a location below
        </div>
        <div
          className='select-container3'
          id='select-region'
          style={{ zIndex: 12 }}
        >
          <div className='select-contact2' id='select-region'>
            {(selectedRegion && selectedRegion) || "Select a Region"}
          </div>
          {showSelectRegion && (
            <div
              className='select-mapparent'
              style={{ top: $("#select-region").outerHeight() - 1.8 }}
            >
              {regionWithLocations.map((region, i, o) => (
                <div
                  className='li-contact'
                  onClick={() => {
                    setSelectedRegion(region.name);
                    setShowSelectRegion(false);
                  }}
                  style={{
                    display: showSelectRegion ? "" : "none",
                    borderBottom: i === o.length - 1 && "none",
                    borderRadius: i === o.length - 1 && "0 0 4px 4px",
                  }}
                  key={region.name}
                >
                  {region?.name?.toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedRegion && (
          <div
            className='select-container3'
            id='select-location'
            style={{ marginTop: "35px" }}
          >
            <div className='select-contact2' id='select-location'>
              {selectedLocation?.name || "Select a location"}
            </div>
            {showSelect && (
              <div
                className='select-mapparent'
                style={{ top: $("#select-location").outerHeight() - 1.8 }}
              >
                {regionWithLocations
                  ?.find(
                    (v) =>
                      v.name.toLowerCase() === selectedRegion.toLowerCase(),
                  )
                  .locations?.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                  })
                  ?.map((location, i, o) => (
                    <div
                      className='li-contact'
                      onClick={() => {
                        // handleChange(location);
                        nav(`/locations/check/${location.id}`);
                        setShowSelect(false);
                      }}
                      id={location.id}
                      style={{
                        display: showSelect ? "" : "none",
                        borderBottom: i === o.length - 1 && "none",
                        borderRadius: i === o.length - 1 && "0 0 4px 4px ",
                      }}
                      key={location.id}
                    >
                      {location.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        {selectedLocation?.id && <div className='app-divider' />}
        {selectedLocation?.id && (
          <div className='quantity-information'>
            <div className='location-name location-acen'>
              {selectedLocation?.name}
            </div>
            <div
              className='location-desc location-acen'
              style={{ marginBottom: "15px" }}
            >
              {selectedLocation?.address}
            </div>
            <div className='location-acen location-desc'>
              Hours:{" "}
              {findURLInString(selectedLocation.hours)?.length > 0
                ? (function () {
                    const find = findURLInString(selectedLocation.hours)[0]; //find the link
                    const index = selectedLocation.hours.indexOf(find); //get index of link
                    return (
                      <div style={{ display: "inline" }}>
                        {selectedLocation.hours.slice(0, index)}{" "}
                        <a
                          href={find}
                          className='checker-hours'
                          target='_blank'
                          rel='noreferrer'
                          onClick={(e) => e.stopPropagation()}
                        >
                          Link
                        </a>
                        {selectedLocation.hours.slice(index + find.length)}
                      </div>
                    );
                  })()
                : selectedLocation.hours}
            </div>

            {selectedLocation?.memo && (
              <div
                className='location-acen location-desc'
                style={{ marginTop: "15px" }}
              >
                {selectedLocation?.memo}
              </div>
            )}

            <a
              className='location-acen qre-directions location-desc'
              target='_blank'
              rel='noreferrer'
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.address}`}
              style={{ marginTop: "15px" }}
            >
              Directions
            </a>
            {selectedLocation?.desc && (
              <div className='location-acen'>{selectedLocation?.desc}</div>
            )}
          </div>
        )}
      </div>
      {selectedLocation?.id ? (
        <div
          style={{
            width: "100%",
            minWidth: "350px",
          }}
        >
          <div className='quantity-slider' ref={qtyRef}>
            <div className='machine-container '>
              <img
                src='/assets/machinestuff/machineimage.jpeg'
                className='machine-imgmain'
                alt='cup'
              />
              <div className='container-cups'>
                {imgReady &&
                  drinks?.length > 0 &&
                  drinks?.map((drink, i) => (
                    <div className='container-row'>
                      {drink?.map((t, q) => (
                        <Row
                          selected={t}
                          col={i}
                          row={q}
                          drinkImgObj={drinkImgObj}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {tableInfo && <CheckerTable info={tableInfo} />}
        </div>
      ) : (
        ""
      )}

      {loading && (
        <div
          className='lds-ring'
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.3)",
            zIndex: 11,
            position: "fixed",
            top: 0,
          }}
          id='spinner-form'
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Checker;
