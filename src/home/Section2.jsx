import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./home.scss";
import $ from "jquery";

import Leaf from "../longstuff/Leaf";

import gsap from "gsap";

const Section2 = () => {
  const history = useNavigate();

  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    setTimeout(() => {
      $("#storycontainer").addClass("fadeintop");
      $("#storycontainer").removeClass("op0");
    }, 700);

    const one = document.getElementById("intersecting-observer1");
    const two = document.getElementById("intersecting-observer2");
    const three = document.getElementById("intersecting-observer3");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          //remove opacity 0 classes
          $("#menu-top").removeClass("op0");

          gsap.fromTo(
            "#menu-top",
            { opacity: 0, x: "70%" },
            {
              opacity: 1,
              x: 0,
              ease: "power1",
              duration: 1.4,
            },
          );

          setTimeout(() => {
            $("#first-menu").removeClass("op0");
            gsap.fromTo(
              "#first-menu",
              { opacity: 0, x: "70%" },
              {
                opacity: 1,
                x: 0,
                ease: "power1",
                duration: 1.4,
              },
            );
          }, 200);

          setTimeout(() => {
            $("#second-menu").removeClass("op0");
            gsap.fromTo(
              "#second-menu",
              { opacity: 0, x: "70%" },
              {
                opacity: 1,
                x: 0,
                ease: "power1",
                duration: 1.4,
              },
            );
          }, 600);

          setTimeout(() => {
            $("#third-menu").removeClass("op0");
            gsap.fromTo(
              "#third-menu",
              { opacity: 0, x: "70%" },
              {
                opacity: 1,
                x: 0,
                ease: "power1",
                duration: 1.4,
              },
            );
          }, 1000);
          setTimeout(() => {
            $("#menuhref").removeClass("op0");
            gsap.fromTo(
              "#menuhref",
              { opacity: 0, x: "70%" },
              {
                opacity: 1,
                x: 0,
                ease: "power1",
                duration: 1.4,
              },
            );
          }, 1000);

          observer.unobserve(one);
        }
      });
    });

    const observer2 = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $("#foranimation-operate").removeClass("op0");
          gsap.fromTo(
            "#foranimation-operate",
            { opacity: 0, x: "30%" },
            {
              opacity: 1,
              x: 0,
              ease: "power1",
              duration: 1.4,
            },
          );

          observer2.unobserve(two);
        }
      });
    });

    const observer3 = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            ".instagram",
            { opacity: 0, x: "25%" },
            {
              opacity: 1,
              x: 0,
              ease: "power1",
              duration: 1.4,
            },
          );

          observer3.unobserve(three);
        }
      });
    });

    observer.observe(one);
    observer2.observe(two);
    observer3.observe(three);
  }, []);

  return (
    <div className='container-section2'>
      <div className='innercontainer-section2'>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          id='storycontainer'
          className='op0'
        >
          <div className='head-section2'>What is Mycha?</div>
          <Leaf />

          <div className='desc-section2'>
            Mycha is a self-service fridge with a variety of bubble tea, fruit
            tea, and coffee selections. Mycha provides popular Asian drinks on
            the spot 24/7 in the Chicagoland, making this an extremely
            convenient option for you on a regular basis.
          </div>
        </div>

        <div id='menu-top' className='op0'>
          <div className='head-section2' style={{ marginTop: "15vh" }}>
            Menu
          </div>

          <div className='desc-section2' style={{ width: "100%" }}>
            Our menu consists of:
          </div>
        </div>
        <div className='menucontainer-section2'>
          <div id='intersecting-observer1' />
          <div
            id='first-menu'
            className='image-menu op0'
            text='Fruit Teas'
            onClick={() => history("/menu", { state: { from: "fruit" } })}
          />
          <div
            id='second-menu'
            className='image-menu op0'
            text='Milk Teas'
            onClick={() => history("/menu", { state: { from: "milktea" } })}
          />
          <div
            id='third-menu'
            className='image-menu op0'
            text='Specialty Drinks'
            onClick={() => history("/menu", { state: { from: "special" } })}
          />
        </div>

        <a
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: "25px",
            color: "rgba(51,51,51)",
          }}
          href='/menu'
          id='menuhref'
          className='op0'
        >
          See our full menu
        </a>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
          id='foranimation-operate'
          className='op0'
        >
          <div id='intersecting-observer2' />
          <div
            className='head-section2'
            style={{ marginTop: "15vh", textAlign: "center" }}
          >
            How We Operate
          </div>
          <Leaf />
          <div className='desc-section2'>
            Mycha is dedicated to providing you the best quality drinks using
            the most convenient form of service. We select premium tea leaves
            from the most authentic tea gardens to ensure a real tea enjoyment.
            We prepare hand-crafted drinks daily in our health department
            regulated kitchen and stock our machines with fresh products every
            morning.
          </div>
        </div>
        <div className='instagram op0'>
          <div className='head-section2'>
            Connect with us on{" "}
            <span style={{ textDecoration: "underline" }}>
              <a
                style={{ cursor: "pointer", color: "rgb(109, 214, 49)" }}
                href='https://www.instagram.com/mychachicago/?hl=en'
                target='_blank'
                rel='noopener noreferrer'
              >
                Instagram
              </a>
            </span>
            !{" "}
          </div>

          <Leaf />

          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
            id='instacontainer'
          >
            <iframe
              src='https://www.instagram.com/p/CxYgiHkrrf_/embed/captioned'
              frameBorder='0'
              scrolling='no'
              allowtransparency='true'
              id='insta-animation'
              loading='lazy'
              title='Recent Instagram Post'
            ></iframe>
          </div>
          <div id='intersecting-observer3' />
        </div>
      </div>
    </div>
  );
};

export default Section2;
