import React, { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import gsap from "gsap";
import $ from "jquery";

import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";

import "./location.scss";
import "./gmap.scss";

import { location } from "./locationsobj";

import LoadingComponent from "../global/LoadingComponent";

import { dispatchSetLocations } from "../store/locations";
import { findURLInString } from "../helperfunctions";

const libraries = ["places"];

const MainLocations = () => {
  const history = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  const regionsWithLocations = useSelector((state) => state.locations);

  const [loading, setLoading] = useState(true);
  //overlay loading
  const [loading2, setLoading2] = useState(false);

  const [allLocations, setAllLocations] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_MAPS,
    libraries: libraries,
  });

  //search = location search section, all = all locations section
  const [selectedSection, setSelectedSection] = useState("search");

  const [mapRef, setMapRef] = useState("");
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState(null);

  const [unfilteredResults, setUnfilteredResults] = useState([]);
  const [resultsFromQuery, setResultsFromQuery] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);

  //options states
  const [searchActive, setSearchActive] = useState(false);

  const [selectedCity, setSelectedCity] = useState(
    window.localStorage.getItem("city") || "Chicago",
  );

  const [selectedCityLocations, setSelectedCityLocations] = useState();

  useEffect(() => {
    if (!regionsWithLocations?.length) return;

    setSelectedCityLocations(
      regionsWithLocations?.find((v) =>
        window.localStorage.getItem("city")
          ? v.name === window.localStorage.getItem("city")
          : v.name === "Chicago",
      )?.locations,
    );
  }, [regionsWithLocations]);

  const [zipCode, setZipCode] = useState("");
  const [withinMiles, setWithinMiles] = useState(5);

  const [showWithinOverlay, setShowWithinOverlay] = useState(false);
  const [showCityOverlay, setShowCityOverlay] = useState(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  async function getCurrentLocationOfUser() {
    if (navigator.geolocation) {
      setLoading2(true);

      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            //on success / user accepts

            const latlng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            );
            const geocode = new google.maps.Geocoder().geocode(
              { latLng: latlng },
              (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                  $("#input-query").val(results[0].formatted_address);
                  handlePlaceSearch(results[0]); //take the first place from the geocode

                  setLoading2(false);
                } else {
                  alert("Something went wrong, please try again");
                  setLoading2(false);
                }
              },
            );
          },
          function () {
            setLoading2(false);
            alert("Please allow access to your location");
          },
        );
      });
    } else {
      alert("Geolocation is not supported on your browser/device");
    }
  }

  const handleMarkerClickOrHover = (
    id,
    lat,
    lng,
    address,
    name,
    hours,
    itemid,
  ) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address, name, hours, lat, lng, itemid });
    setInfoWindowOpen(true);
  };

  const handleMarkerClickOrHoverOut = () => {
    setInfoWindowData({});
    setInfoWindowOpen(false);
  };

  useEffect(() => {
    if (loading) return;

    gsap.fromTo(
      "#locationword",
      { opacity: 0, y: "-70%" },
      { opacity: 1, y: 0, duration: 1.2 },
    );
  }, [loading]);

  // useEffect(() => {
  //   if (loading) return;
  //   if (!$("#uice").length || !$("#uicw".length)) return;

  //   gsap.fromTo(
  //     "#uice",
  //     { opacity: 0, x: "-10%" },
  //     { opacity: 1, x: 0, duration: 1.4 }
  //   );

  //   gsap.fromTo(
  //     "#uicw",
  //     { opacity: 0, x: "-10%" },
  //     { opacity: 1, x: 0, duration: 1.4 }
  //   );
  // }, [selectedSection, loading]);

  const onLoad = (map, locations) => {
    if (map) setMapRef(map);

    if (!map && !locations?.length) return; // if a new region is added and no locations

    const bounds = new google.maps.LatLngBounds();
    locations
      ? locations?.forEach((v) =>
          bounds.extend({ lat: v.coordinatesLat, lng: v.coordinatesLong }),
        )
      : selectedCityLocations?.forEach((v) =>
          bounds.extend({ lat: v.coordinatesLat, lng: v.coordinatesLong }),
        );

    map
      ? map.fitBounds(bounds, {
          top: 50,
          left: 50,
          right: 50,
          bottom: 50,
        })
      : mapRef.fitBounds(bounds, {
          top: 50,
          left: 50,
          right: 50,
          bottom: 50,
        });
  };

  async function handlePlaceSearch(s) {
    //empty the query result array
    setInfoWindowOpen(false);
    setInfoWindowData(null);
    setResultsFromQuery([]);
    setUnfilteredResults([]);
    setQueryLoading(true);
    setSearchActive(true);

    const place = s || autoCompleteRef.current.getPlace();

    if (!place.address_components) {
      setQueryLoading(false);
      return;
    }

    let re = "";

    place.address_components.forEach((v) => (re = re + " " + v.short_name));

    //get the coordinates of the zipcode
    // const zipReq = await axios.get(`/coordinates/${re}`);

    new google.maps.Geocoder().geocode({ address: re }, (result, status) => {
      //if the query is good
      if (status === "OK") {
        const center = result[0].geometry.location;
        const state = result[0].address_components.find(
          (v) => v.types.includes("administrative_area_level_1"), //admin area level 1 = state
        ).short_name;

        // if (!location[state]) {
        //   setQueryLoading(false);
        //   setResultsFromQuery([]);

        //   return;
        // } //in a state we dont serve, handle this later

        const results = [];
        const distanceMatrix = new google.maps.DistanceMatrixService();

        const loc = regionsWithLocations.map((v) => v.locations).flat(Infinity);

        const t = new Promise((r) => {
          // loc.forEach((v) => {
          //get all cities in a state
          // const loc = location[state][v];

          //for each city, get the driving distance between the zip code and each location's coordinates
          const b = new Promise(async (resolve, reject) => {
            for (let i = 0; i < loc.length; i++) {
              if (loc[i].region.state !== state) continue;

              const start = new google.maps.LatLng(center.lat(), center.lng());
              const end = new google.maps.LatLng(
                loc[i].coordinatesLat,
                loc[i].coordinatesLong,
              );
              const re = await distanceMatrix
                .getDistanceMatrix({
                  origins: [start],
                  destinations: [end],
                  avoidHighways: false,
                  avoidTolls: false,
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                })
                .then((res) => {
                  function getMiles(meters) {
                    return meters * 0.000621371192;
                  }

                  const miles = getMiles(
                    res.rows[0].elements[0].distance.value,
                  );

                  results.push({
                    ...loc[i],
                    distance: Number(miles.toFixed(2)),
                  });
                });
            }

            resolve();
          });

          b.then(() => {
            r();
          });
          // });
        });

        t.then(() => {
          unfilteredHandle(results);
        });
      }
    });
  }

  function unfilteredHandle(results) {
    console.log(results, ";re");
    const final = [];
    setUnfilteredResults(results);

    if (results.length < 1) {
      setQueryLoading(false);
      return;
    }

    results.forEach((v, i, a) => {
      if (v.distance <= withinMiles) {
        final.push(v);
      }
    });

    // t.then(() => {
    if (final.length >= 1) {
      //if we have one or more results, move the map accordingly
      const bounds = new google.maps.LatLngBounds();
      final.forEach((loc) =>
        bounds.extend({ lat: loc.coordinatesLat, lng: loc.coordinatesLong }),
      );
      mapRef.fitBounds(bounds, {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
      });
    }

    setResultsFromQuery(
      final.sort(function (a, b) {
        if (a.distance > b.distance) {
          return 1;
        }
        if (a.distance < b.distance) {
          return -1;
        }
        return 0;
      }),
    );

    setQueryLoading(false);
    // }).catch((err) => {
    //   setQueryLoading(false);
    //   alert("Something went wrong, please try again");
    // });
  }

  //this function will reduce the # of api calls we make when a user selects a different within miles range
  function withinRecall(miles) {
    if (unfilteredResults.length < 1) return; // nothing to run with
    const result = [];

    unfilteredResults.forEach((v, i) => {
      if (v.distance <= miles) {
        result.push(v);
      }

      if (i === unfilteredResults.length - 1) {
        if (result.length > 0) {
          //if we have one or more results, move the map accordingly
          const bounds = new google.maps.LatLngBounds();
          result.forEach((loc) =>
            bounds.extend({
              lat: loc.coordinatesLat,
              lng: loc.coordinatesLong,
            }),
          );
          mapRef.fitBounds(bounds, {
            top: 50,
            left: 50,
            right: 50,
            bottom: 50,
          });
        }

        setResultsFromQuery(
          result.sort(function (a, b) {
            if (a.distance > b.distance) {
              return 1;
            }

            if (a.distance < b.distance) {
              return -1;
            }

            return 0;
          }),
        );
      }
    });
  }

  const handleEnterAutoComplete = useCallback((e, t) => {
    e.stopPropagation();
    if (e.key === "Enter" && $("#input-query").is(":focus")) {
      const n = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        code: "ArrowDown",
        keyCode: 40,
      });

      const r = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
      });

      document.getElementById("input-query").dispatchEvent(n);
      document.getElementById("input-query").dispatchEvent(r);
    }
  });

  useEffect(() => {
    if (loading) return;
    window.addEventListener("keydown", handleEnterAutoComplete);
  }, [loading]);

  useEffect(() => {
    const section = params.section;
    setSelectedSection(section || null);
  }, [window.location.href]);

  // useEffect(() => {
  //   window.scrollTo({ top: 0 });

  //   const one = document.getElementById("intersecting-locations1");
  //   const two = document.getElementById("intersecting-locations2");
  //   const three = document.getElementById("intersecting-locations3");

  //   if (!one) return;
  //   const observer1 = new IntersectionObserver((entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         gsap.fromTo(
  //           "#b37ped",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         gsap.fromTo(
  //           "#uicbsb",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         observer1.unobserve(one);
  //       }
  //     });
  //   });

  //   const observer2 = new IntersectionObserver((entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         gsap.fromTo(
  //           "#rushu",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         gsap.fromTo(
  //           "#bpapa",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         observer2.unobserve(two);
  //       }
  //     });
  //   });

  //   const observer3 = new IntersectionObserver((entries, observer) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         gsap.fromTo(
  //           "#uchimed",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         gsap.fromTo(
  //           "#unionstation",
  //           { opacity: 0, x: "-10%" },
  //           { opacity: 1, x: 0, duration: 1.4 }
  //         );

  //         observer3.unobserve(three);
  //       }
  //     });
  //   });

  //   if (window.innerWidth > 700) {
  //     observer1.observe(one);
  //     observer2.observe(two);
  //     observer3.observe(three);
  //   }
  // }, [selectedSection]);

  function handleSetWithinMiles(v) {
    setWithinMiles(v);
    setShowWithinOverlay(false);
  }

  const showWithin = useCallback(() => {
    setTimeout(() => {
      if ($(".location-inpsel").is(":hover")) {
        setShowWithinOverlay(true);
        //pseudo caret
        $("#within").removeClass("location-rot1");
        $("#within").addClass("location-rot2");
      }
    }, 300);
  }, [$(".location-inpsel")]);

  const showWithinMouseleave = useCallback(() => {
    setShowWithinOverlay(false);
    //pseduo caret
    $("#within").addClass("location-rot1");
    $("#within").removeClass("location-rot2");
  }, []);

  const showCity = useCallback(() => {
    setTimeout(() => {
      if ($(".location-inpsel2").is(":hover")) {
        setShowCityOverlay(true);
        //pseudo caret
        $("#select-city").removeClass("location-rot1");
        $("#select-city").addClass("location-rot2");
      }
    }, 300);
  }, [$(".location-inpsel2")]);

  const showCityMouseLeave = useCallback(() => {
    setShowCityOverlay(false);
    //pseduo caret
    $("#select-city").addClass("location-rot1");
    $("#select-city").removeClass("location-rot2");
  }, []);

  const resize = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  $(window).off("resize", window, resize).resize(resize);

  useEffect(() => {
    if (!$(".location-inpsel").length || !$(".location-inpsel2").length) return;

    $(".location-inpsel").hover(showWithin, showWithinMouseleave);
    $(".location-inpsel2").hover(showCity, showCityMouseLeave);

    return () => $(".location-inpsel").off();
  }, [window.location.href, $(".location-inpsel"), $(".location-inpsel2")]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const footerHandle = useCallback(() => {
    const k = document
      .getElementById("footermain")
      .getBoundingClientRect().height;

    $("#container-locations").css("padding-bottom", `${k + 30}px`);
  }, []);

  useEffect(() => {
    const k = document
      .getElementById("footermain")
      .getBoundingClientRect().height;

    $("#container-locations").css("padding-bottom", `${k + 30}px`);

    window.addEventListener("resize", footerHandle);

    return () => {
      window.removeEventListener("resize", footerHandle);
    };
  });

  useEffect(() => {
    if (regionsWithLocations.length) {
      setLoading(false);
      return;
    } else {
      $.ajax({
        url: "/fetchallregions",
        type: "GET",
      })
        .then((res) => {
          dispatch(dispatchSetLocations(res));
          setLoading(false);
        })
        .catch(() => {
          alert("Something went wrong, please try again");
          setLoading(false);
        });
    }
  }, [regionsWithLocations]);

  //all locations
  useEffect(() => {
    const result = [];

    Object.keys(location).forEach((v) => {
      Object.keys(location[v]).forEach((t) => {
        result.push(...location[v][t]);
      });
    });

    setAllLocations(result);
  }, []);

  const scroll = useCallback(() => {
    const y = window.scrollY;

    if (y > $("#outerlocation").outerHeight() + 100) return;

    $("#outerlocation").css("transform", `translate3d(0, -${y / 2.2}px, 0)`);
  }, []);

  $(window).off(window, "scroll", scroll).scroll(scroll);

  if (loading)
    return (
      <div className='abs-loading'>
        <div className='lds-ring' id='spinner-form'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

  return (
    <div className='location-actualparent'>
      {loading2 && <LoadingComponent />}

      <div className='outer-location' id='outerlocation'>
        <div className='parent-location'></div>
        {/* <div className='locations-header'> */}
        {/* <LocationWord /> */}

        <div className='cs-t' style={{ zIndex: 10 }}>
          L O C A T I O N S
        </div>
        {/* </div> */}
      </div>

      <div
        style={{
          width: "100%",
          height: "60vh",
        }}
        className=' background-gif'
      />

      <div className='heightholder-locations' />

      <div className='locations-e'>
        {!selectedSection && (
          <div>
            <div className='locations-b'>Select City or Enter Zip Code!</div>

            <div className='locations-fil'>
              <div className='locations-filq'>
                <div
                  className='location-inpsel2 locations-w502 location-rot1 location-mle'
                  style={{
                    borderRadius: showCityOverlay ? "4px 4px 0 0" : "4px",
                    marginLeft: 0,
                  }}
                  id='select-city'
                >
                  {selectedCity}
                  {showCityOverlay && (
                    <div className='location-optcontainer'>
                      {regionsWithLocations?.map((region) => (
                        <div
                          className='location-opt'
                          onClick={() => {
                            setSelectedCity(region.name);
                            setSelectedCityLocations(region.locations);
                            window.localStorage.setItem("city", region.name);
                            setShowCityOverlay(false);
                            onLoad(
                              null,
                              region.locations.sort(function (a, b) {
                                return a.name.localeCompare(b.name);
                              }),
                            );
                            setInfoWindowOpen(false);
                            setSearchActive(false);
                          }}
                        >
                          {region?.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className='locations-or'>OR</div>

                {isLoaded && (
                  <Autocomplete
                    onPlaceChanged={handlePlaceSearch}
                    options={{ fields: ["address_components"] }}
                    onLoad={(ref) => {
                      autoCompleteRef.current = ref;
                    }}
                  >
                    <div className='rel flexa location-inp'>
                      <input
                        className='locations-w502 locations-nf'
                        placeholder='Enter Zip Code'
                        type={"text"}
                        ref={inputRef}
                        id='input-query'
                      />

                      <div
                        className='loc-cur'
                        onClick={() => getCurrentLocationOfUser()}
                      >
                        Use Current Location
                      </div>
                    </div>
                  </Autocomplete>
                )}
              </div>

              {window.innerWidth > 750 ? (
                <div className='locations-divider' />
              ) : (
                <div className='locations-divider2' />
              )}

              <div
                className='location-inpsel locations-w50 location-rot1 location-mle'
                style={{
                  borderRadius: showWithinOverlay ? "4px 4px 0 0" : "4px",
                }}
                id='within'
              >
                Within {withinMiles} mi
                {showWithinOverlay && (
                  <div className='location-optcontainer'>
                    <div
                      className='location-opt'
                      onClick={() => {
                        handleSetWithinMiles(5);
                        if (searchActive) {
                          withinRecall(5);
                        }
                      }}
                    >
                      Within 5 mi
                    </div>

                    <div
                      className='location-opt'
                      onClick={() => {
                        handleSetWithinMiles(10);
                        if (searchActive) {
                          withinRecall(10);
                        }
                      }}
                    >
                      Within 10 mi
                    </div>

                    <div
                      className='location-opt'
                      onClick={() => {
                        handleSetWithinMiles(15);
                        if (searchActive) {
                          withinRecall(15);
                        }
                      }}
                    >
                      Within 15 mi
                    </div>

                    <div
                      className='location-opt'
                      onClick={() => {
                        handleSetWithinMiles(20);
                        if (searchActive) {
                          withinRecall(20);
                        }
                      }}
                    >
                      Within 20 mi
                    </div>

                    <div
                      className='location-opt'
                      onClick={() => {
                        handleSetWithinMiles(25);
                        if (searchActive) {
                          withinRecall(25);
                        }
                      }}
                      style={{
                        borderRadius: "0 0 4px 4px",
                        borderBottom: "none",
                      }}
                    >
                      Within 25 mi
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='flexa' style={{ margin: "10px 0" }}>
          <div className='grow' />
          <div
            className='loc-res'
            onClick={() => {
              $("#input-query").val("");
              setResultsFromQuery([]);
              setSearchActive(false);
              onLoad(null, selectedCityLocations);
            }}
          >
            Reset Search
          </div>
        </div>
        {!selectedSection && (
          <div className='locations-ep'>
            <div className='locations-querycontainer'>
              {searchActive
                ? resultsFromQuery.length
                  ? resultsFromQuery.map((v, i) => (
                      <div
                        className='locations-querymap'
                        id={`querymap-${v.id}`}
                        onClick={() => {
                          handleMarkerClickOrHover(
                            i,
                            v.coordinatesLat,
                            v.coordinatesLong,
                            v.address,
                            v.name,
                            v.hours,
                            v.id,
                          );
                        }}
                      >
                        <div className='qre-title'>{v.name}</div>
                        <div className='qre-desc'>{v.address}</div>
                        <div className='qre-desc'>
                          Hours:{" "}
                          {findURLInString(v.hours)?.length > 0
                            ? (function () {
                                const find = findURLInString(v.hours)[0]; //find the link
                                const index = v.hours.indexOf(find); //get index of link
                                return (
                                  <div>
                                    {v.hours.slice(0, index)}{" "}
                                    <a
                                      href={find}
                                      className='qre-hover'
                                      target='_blank'
                                      rel='noreferrer'
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {find}
                                    </a>
                                    {v.hours.slice(index + find.length)}
                                  </div>
                                );
                              })()
                            : v.hours}
                        </div>
                        <div className='qre-desc'>
                          Distance: {v.distance} Miles
                        </div>

                        <a
                          className='qre-desc qre-directions'
                          href={`https://www.google.com/maps/dir/?api=1&destination=${v.address}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{
                            paddingBottom: 0,
                            paddingTop: "5px",
                            display: "inline-block",
                          }}
                        >
                          Directions
                        </a>

                        <div className='location-checkqty'>
                          <img
                            src='/assets/leafdivider.png'
                            style={{
                              height: "45px",
                              width: "45px",
                              userSelect: "none",
                            }}
                            alt='leafdivider'
                          />
                          <div
                            className='check-stock location-desc'
                            onClick={(e) => {
                              e.stopPropagation();
                              history(`/locations/check/${v.id}`);
                            }}
                          >
                            Check Location Stock
                          </div>
                        </div>
                      </div>
                    ))
                  : !queryLoading && (
                      <div className='locations-oos'>
                        Sorry, seems like we don't sell near you. Try increasing
                        the within miles or follow us on{" "}
                        <a
                          href={"https://www.instagram.com/mychachicago/?hl=en"}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='locations-ihref'
                        >
                          Instagram
                        </a>{" "}
                        to be the first at our new locations!
                        <div
                          className='locations-reset'
                          onClick={() => $("#input-query").val("").focus()}
                        >
                          Reset Search
                        </div>
                      </div>
                    )
                : selectedCityLocations?.map((v, i) => (
                    <div
                      className='locations-querymap'
                      id={`querymap-${v.id}`}
                      onClick={() => {
                        handleMarkerClickOrHover(
                          i,
                          v.coordinatesLat,
                          v.coordinatesLong,
                          v.address,
                          v.name,
                          v.hours,
                          v.id,
                        );
                      }}
                    >
                      <div className='qre-title'>{v.name}</div>
                      <div className='qre-desc'>{v.address}</div>
                      <div className='qre-desc'>
                        Hours:{" "}
                        {findURLInString(v.hours)?.length > 0
                          ? (function () {
                              const find = findURLInString(v.hours)[0]; //find the link
                              const index = v.hours.indexOf(find); //get index of link
                              return (
                                <div>
                                  {v.hours.slice(0, index)}{" "}
                                  <a
                                    href={find}
                                    className='qre-hover'
                                    target='_blank'
                                    rel='noreferrer'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {find}
                                  </a>
                                  {v.hours.slice(index + find.length)}
                                </div>
                              );
                            })()
                          : v.hours}
                      </div>
                      <a
                        className='qre-desc qre-directions'
                        href={`https://www.google.com/maps/dir/?api=1&destination=${v.address}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{
                          paddingBottom: 0,
                        }}
                      >
                        Directions
                      </a>

                      <div className='location-checkqty'>
                        <img
                          src='/assets/leafdivider.png'
                          style={{
                            height: "45px",
                            width: "45px",
                            userSelect: "none",
                          }}
                          alt='leafdivider'
                        />
                        <div
                          className='check-stock location-desc'
                          onClick={(e) => {
                            e.stopPropagation();
                            history(`/locations/check/${v.id}`);
                          }}
                        >
                          Check Location Stock
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
            {isLoaded && selectedCityLocations && (
              <GoogleMap
                mapContainerClassName='gmap-container'
                zoom={10}
                onLoad={onLoad}
                options={{ mapTypeControl: false, streetViewControl: false }}
              >
                {searchActive
                  ? resultsFromQuery.length &&
                    resultsFromQuery.map((v, i) => (
                      <Marker
                        position={{
                          lat: v?.coordinatesLat,
                          lng: v?.coordinatesLong,
                        }}
                        icon={{
                          url: "/assets/machinenobg.jpeg",
                          scaledSize: new google.maps.Size(50, 50),
                        }}
                        onClick={() => {
                          handleMarkerClickOrHover(
                            i,
                            v.coordinatesLat,
                            v.coordinatesLong,
                            v.address,
                            v.name,
                            v.hours,
                            v.id,
                          );

                          //function to calculate total height above our desired element
                          function calculateTop() {
                            let result = 0;
                            resultsFromQuery?.forEach((t, i2) => {
                              if (i2 >= i) return;

                              const height = $(
                                `#querymap-${t.id}`,
                              ).outerHeight();
                              result += height;
                            });

                            return result;
                          }

                          //get total height of all elements above the one we want
                          const totalHeight = calculateTop();

                          //use javascript to scroll to that element, so the selected location shows on top
                          document
                            .querySelector(".locations-querycontainer")
                            .scrollTo({
                              top: totalHeight,
                            });
                        }}
                      >
                        {infoWindowOpen && infoWindowData?.id === i && (
                          <InfoWindow
                            onCloseClick={() => {
                              setInfoWindowOpen(false);
                            }}
                          >
                            <div className='infow-parent'>
                              <div className='infow-title'>
                                {infoWindowData.name}
                              </div>

                              <div className='infow-desc'>
                                {infoWindowData.address}
                              </div>

                              <div className='infow-desc'>
                                Hours:{" "}
                                {findURLInString(infoWindowData.hours)?.length >
                                0
                                  ? (function () {
                                      const find = findURLInString(
                                        infoWindowData.hours,
                                      )[0]; //find the link
                                      const index = v.hours.indexOf(find); //get index of link
                                      return (
                                        <div>
                                          {infoWindowData.hours.slice(0, index)}{" "}
                                          <a
                                            href={find}
                                            className='qre-hover'
                                            target='_blank'
                                            rel='noreferrer'
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {find}
                                          </a>
                                          {infoWindowData.hours.slice(
                                            index + find.length,
                                          )}
                                        </div>
                                      );
                                    })()
                                  : infoWindowData.hours}
                              </div>
                              <a
                                className='infow-desc qre-directions'
                                href={`https://www.google.com/maps/dir/?api=1&destination=${infoWindowData.address}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{
                                  paddingBottom: 0,
                                }}
                              >
                                Directions
                              </a>

                              <div className='location-checkqty'>
                                <img
                                  src='../assets/leafdivider.png'
                                  style={{
                                    height: "45px",
                                    width: "45px",
                                    userSelect: "none",
                                  }}
                                  alt='leafdivider'
                                />
                                <div
                                  className='check-stock location-desc'
                                  onClick={() =>
                                    history(
                                      `/locations/check/${infoWindowData.itemid}`,
                                    )
                                  }
                                >
                                  Check Location Stock
                                </div>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))
                  : selectedCityLocations
                      ?.sort((a, b) => a?.name?.localeCompare(b?.name))
                      ?.map((v, i) => (
                        <Marker
                          position={{
                            lat: v?.coordinatesLat,
                            lng: v?.coordinatesLong,
                          }}
                          icon={{
                            url: "/assets/machinenobg.jpeg",
                            scaledSize: new google.maps.Size(50, 50),
                          }}
                          onClick={() => {
                            handleMarkerClickOrHover(
                              i,
                              v.coordinatesLat,
                              v.coordinatesLong,
                              v.address,
                              v.name,
                              v.hours,
                              v.id,
                            );

                            //function to calculate total height above our desired element
                            function calculateTop() {
                              let result = 0;
                              selectedCityLocations?.forEach((t, i2) => {
                                if (i2 >= i) return;

                                const height = $(
                                  `#querymap-${t.id}`,
                                ).outerHeight();
                                result += height;
                              });

                              return result;
                            }

                            //get total height of all elements above the one we want
                            const totalHeight = calculateTop();

                            //use javascript to scroll to that element, so the selected location shows on top
                            document
                              .querySelector(".locations-querycontainer")
                              .scrollTo({
                                top: totalHeight,
                              });
                          }}
                        >
                          {infoWindowOpen && infoWindowData?.id === i && (
                            <InfoWindow
                              onCloseClick={() => {
                                setInfoWindowOpen(false);
                              }}
                            >
                              <div className='infow-parent'>
                                <div className='infow-title'>
                                  {infoWindowData.name}
                                </div>

                                <div className='infow-desc'>
                                  {infoWindowData.address}
                                </div>

                                <div className='infow-desc'>
                                  Hours:{" "}
                                  {findURLInString(infoWindowData.hours)
                                    ?.length > 0
                                    ? (function () {
                                        const find = findURLInString(
                                          infoWindowData.hours,
                                        )[0]; //find the link
                                        const index = v.hours.indexOf(find); //get index of link
                                        return (
                                          <div>
                                            {infoWindowData.hours.slice(
                                              0,
                                              index,
                                            )}{" "}
                                            <a
                                              href={find}
                                              className='qre-hover'
                                              target='_blank'
                                              rel='noreferrer'
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              {find}
                                            </a>
                                            {infoWindowData.hours.slice(
                                              index + find.length,
                                            )}
                                          </div>
                                        );
                                      })()
                                    : infoWindowData.hours}
                                </div>
                                <a
                                  className='infow-desc qre-directions'
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${infoWindowData.address}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  style={{
                                    paddingBottom: 0,
                                    paddingTop: "5px",
                                    display: "inline-block",
                                  }}
                                >
                                  Directions
                                </a>

                                <div className='location-checkqty'>
                                  <img
                                    src='../assets/leafdivider.png'
                                    style={{
                                      height: "45px",
                                      width: "45px",
                                      userSelect: "none",
                                    }}
                                    alt='leafdivider'
                                  />
                                  <div
                                    className='check-stock location-desc'
                                    onClick={() =>
                                      history(
                                        `/locations/check/${infoWindowData.itemid}`,
                                      )
                                    }
                                  >
                                    Check Location Stock
                                  </div>
                                </div>
                              </div>
                            </InfoWindow>
                          )}
                        </Marker>
                      ))}
              </GoogleMap>
            )}
          </div>
        )}

        <div className='locations-war'>
          *Be sure to check location's stock ahead of time. Some locations are
          seasonal or out of stock
        </div>

        {selectedSection === "all" && (
          <div className='container-locations' id='container-locations'>
            <div id='intersecting-locations1' />
            <div id='intersecting-locations2' />
            <div id='intersecting-locations3' />

            {allLocations?.map((location) => (
              <div
                className={`container-info ${
                  window.innerWidth > 700 ? "op0" : ""
                }`}
                id={location.id}
                key={location.id}
              >
                <div className='location-imgcontainer'>
                  <img
                    src={location.image}
                    alt='uiceast'
                    className='img-location'
                  />
                </div>
                <div className='location-fdsr'>
                  <div className='location-name '>{location.name}</div>
                  <div className='location-add location-desc'>
                    {location.address}
                  </div>
                  <div className='location-hours location-desc'>
                    Hours: {location.hours !== "" ? ` ${location.hours}` : ""}
                  </div>
                  {/* 
                  <div className='location-checkqty'>
                    <img
                      src='../assets/leafdivider.png'
                      style={{
                        height: "45px",
                        width: "45px",
                        userSelect: "none",
                      }}
                      alt='leafdivider'
                    />
                    <div
                      className='check-stock location-desc'
                      onClick={() =>
                        history(`/locations/check`, {
                          state: { from: location.id },
                        })
                      }
                    >
                      Check Location Stock
                    </div>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <Background /> */}

      {queryLoading && (
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

export default MainLocations;
