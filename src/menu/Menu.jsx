import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./menu.scss";
import gsap from "gsap";

import { dispatchSetDrinks } from "../store/drinks";

import $ from "jquery";

import Catering from "./Catering";

import MenuCup1 from "./menucups/MenuCup1";
import Oranges from "./menucups/Oranges";
import Grapefruit from "./menucups/Grapefruit";
import Lime from "./menucups/Lime";
import Mychamenu from "./menucups/Mychamenu";
import Pfruit from "./menucups/Pfruit";
import PockyMenu from "./menucups/PockyMenu";
import Leaf from "../longstuff/Leaf";

const Menu = () => {
  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const drinks = useSelector((state) => state.drinks);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!drinks?.length) return;

    gsap.fromTo(
      "#pfruit",
      { opacity: 0, x: "50%" },
      { opacity: 1, x: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#pockymenu",
      { opacity: 0, x: "50%" },
      { opacity: 1, x: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#menucup1",
      { opacity: 0, x: "-50%" },
      { opacity: 1, x: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#lime",
      { opacity: 0, x: "-50%" },
      { opacity: 1, x: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#grapefruit",
      { opacity: 0, y: "-50%" },
      { opacity: 1, y: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#oranges",
      { opacity: 0, x: "50%" },
      { opacity: 1, x: 0, duration: 1.2 }
    );

    gsap.fromTo(
      "#mychamenu",
      { opacity: 0, y: "50%" },
      { opacity: 1, y: 0, duration: 1.2 }
    );

    drinks.forEach((section) => {
      const ele = document.getElementsByClassName(
        `intersecting-${section.id}`
      )[0];

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              `#section-${section.id}`,
              { opacity: 0, x: "-10%" },
              { opacity: 1, x: 0, duration: 1.2 }
            );
            observer.unobserve(ele);
          }
        });
      });

      observer.observe(ele);
    });

    const cateringele = document.getElementById(
      "catering-intersectingobserver"
    );

    const cateringobserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            `#catering-p`,
            { opacity: 0, x: "-10%" },
            { opacity: 1, x: 0, duration: 1.2 }
          );
          observer.unobserve(cateringele);
        }
      });
    });

    cateringobserver.observe(cateringele);
  }, [drinks, loading]);

  //caret visibility
  useEffect(() => {
    if (loading) return;
    setTimeout(() => {
      $(".cs-caret").css("visibility", "visible");
    }, 1000);
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (!drinks?.length) return;

    if (location.state) {
      switch (location.state.from) {
        case "fruit":
          const fruittea = $(
            `.intersecting-${drinks.find((v) => v.name === "Fruit Teas").id}`
          )[0].getBoundingClientRect();
          window.scrollTo({
            top: fruittea.top + window.pageYOffset - 100,
            behavior: "smooth",
          });
          break;
        case "milktea":
          const milktea = $(
            `.intersecting-${drinks.find((v) => v.name === "Milk Teas").id}`
          )[0].getBoundingClientRect();

          window.scrollTo({
            top: milktea.top + window.pageYOffset - 100,
            behavior: "smooth",
          });
          break;
        case "special":
          const speciality = $(
            `.intersecting-${
              drinks.find((v) => v.name === "Specialty Drinks").id
            }`
          )[0].getBoundingClientRect();

          window.scrollTo({
            top: speciality.top + window.pageYOffset - 100,
            behavior: "smooth",
          });

          break;

        case "catering":
          const catering = document
            .getElementById("catering-p")
            .getBoundingClientRect();

          window.scrollTo({
            top: catering.top + window.pageYOffset - 100,
            behavior: "smooth",
          });
          break;

        default:
          break;
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    gsap.fromTo(
      "#topmenu-container",
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );
  }, [loading, drinks]);

  useEffect(() => {
    async function f() {
      await $.ajax({
        type: "GET",
        url: "/fetchalldrinks",
      })
        .then((res) => {
          dispatch(dispatchSetDrinks(res));
          setLoading(false);
        })
        .catch((err) => {
          alert("Something went wrong, please try again");
          setLoading(false);
        });
    }

    if (drinks.length > 0) {
      setLoading(false);
    } else {
      f();
    }
  }, [drinks]);

  const scroll = useCallback(() => {
    const y = window.scrollY;

    if (y > $(".menu-parallax").outerHeight() + 100) return;

    $(".menu-parallax").css("transform", `translate3d(0, -${y / 2}px, 0)`);
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
    <div style={{ position: "relative" }}>
      <div
        className='sliding-placeholder menu-parallax'
        id='topmenu-container'
        style={{ zIndex: -2, position: "fixed" }}
      >
        <MenuCup1 />
        <Oranges />
        <Grapefruit />
        <Lime />
        {/* <Mychamenu /> */}

        <div className='cs-t menu-tp'>
          <span className='menu-span'>M Y C H A</span>
          <span className='menu-space'>&nbsp;&nbsp;</span>
          <span className='menu-span'>M E N U</span>
        </div>
        <Pfruit />
        <PockyMenu />
      </div>
      <div
        style={{
          position: "",
          top: 0,
          width: "100%",
          height: "61vh",
          paddingTop: "11vh",
          backgroundColor: "transparent",
        }}
        id='covermenu'
      />
      <div className='outercontainer-menu'>
        <div className='innercontainer-menu'>
          {drinks.map((section) => (
            <div
              style={{
                width: "100%",
                marginBottom: "9vh",
                position: "relative",
                opacity: 0,
              }}
              id={"section-" + section.id}
              key={section.id}
            >
              <div className={`intersecting-${section.id}`} />
              <div className='menu-title'>
                <Leaf />
                {section.name}
              </div>
              <div
                style={{
                  backgroundColor: "rgb(109, 214, 49) ",
                }}
                className='menu-divider'
              />
              <div className='container-sectionmenu'>
                {section.drinks
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <div className='menu-o'>
                      <div
                        className='menu-half'
                        id={item.htmlid}
                        key={item.htmlid}
                        style={{ marginBottom: "15px" }}
                        onClick={() => history(`/menu/${item.id}`)}
                      >
                        <div className='menu-in'>
                          <div
                            className='img-menucontainer'
                            style={{
                              border: "2px solid rgb(109, 214, 49) ",
                            }}
                          >
                            <div
                              className='img-menu'
                              style={{
                                backgroundImage: `url(${
                                  !item.img
                                    ? item.pathname
                                    : `data:image/png;base64,${item.img}`
                                })`,
                              }}
                            />
                          </div>
                          <div className='menu-txtcontainer'>
                            <div className='name-menu'>{item.name}</div>
                            <div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginTop: "8px",
                                  textDecoration: "underline",
                                }}
                                className='menu-learnmore'
                              >
                                Learn More
                              </div>
                            </div>
                          </div>

                          <div className='mitem-caret cs-caret menu-caret' />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <Catering />
        </div>
      </div>

      {/* <Background /> */}
    </div>
  );
};

export default Menu;
