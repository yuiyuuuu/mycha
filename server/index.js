const express = require("express");
const app = express();
const morgan = require("morgan");
const parser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 4001;
const { createServer } = require("vite");
require("dotenv").config();

const axios = require("axios");
const cron = require("node-cron");

app.use(morgan("dev"));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist")));

// /assets virtual path for the images
app.use("/assets", express.static(path.join(__dirname, "../assets")));

const v = async function () {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
};

app.get("/fetchlocations", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/data/fetchlocations`,
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/fetchstock/:location", async (req, res, next) => {
  try {
    const loc = req.params.location;

    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/data/fetchstock/${loc}`,
      // `http://localhost:4001/api/data/fetchstock/${loc}`
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/fetchstock2/:location", async (req, res, next) => {
  try {
    const loc = req.params.location;

    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/data/fetchstock2/${loc}`,
      // `http://localhost:4001/api/data/fetchstock2/${loc}`
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

// app.get("/fetchlocations", async (req, res, next) => {
//   try {
//     const { data } = await axios.get(
//       `${process.env.EDITOR_LINK}/api/data/fetchlocations`
//     );

//     res.send(data);
//   } catch (error) {
//     next(error);
//   }
// });

app.get("/fetchlocationsbyregion", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/data/fetchlocationsbyregion`,
      // `http://localhost:3005/api/data/fetchlocationsbyregion`
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.post("/sendstock", async (req, res, next) => {
  try {
    const body = req.body;

    const { data } = await axios.post(
      `${process.env.EDITOR_LINK}/api/data/sendstock`,
      // `http://localhost:4001/api/data/sendstock`,
      body,
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.post("/sendstock2", async (req, res, next) => {
  try {
    const body = req.body;

    const { data } = await axios.post(
      `${process.env.EDITOR_LINK}/api/data/sendstock2`,
      // `http://localhost:4001/api/data/sendstock2`,
      body,
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

// app.get("/remainingstock", async (req, res, next) => {
//   try {
//     const { data } = await axios.get(
//       `${process.env.EDITOR_LINK}/api/data/remainingstock`
//       // `http://localhost:4001/api/data/remainingstock`
//     );

//     res.send(data);
//   } catch (error) {
//     next(error);
//   }
// });

app.get("/getstockforalocation/:location", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/data/getstockforalocation/${req.params.location}`,

      // `http://localhost:4001/api/data/getstockforalocation/${req.params.location}`
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/coordinates/:address", async (req, res, next) => {
  try {
    const zipReq = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.VITE_MAPS}&address=${req.params.address}}`,
    );

    res.send(zipReq);
  } catch (error) {
    next(error);
  }
});

app.get("/calculatedistance/:o1/:o2/:d1/:d2", async (req, res, next) => {
  try {
    const params = req.params;

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.VITE_MAPS}&origins=${params.o1},${params.o2}&destinations=${params.d1},${params.d2}&mode=driving&language=pl-PL`,
    );

    function getMiles(meters) {
      return meters * 0.000621371192;
    }

    const miles = getMiles(data.rows[0].elements[0].distance.value);

    res.send({ miles: Number(miles.toFixed(2)) }).status(200);
  } catch (error) {
    next(error);
  }
});

app.get("/fetchalldrinks", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      // `${process.env.EDITOR_LINK}/api/category/fetchall`
      `http://localhost:3005/api/category/fetchall`,
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/fetchallregions", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      // `${process.env.EDITOR_LINK}/api/region/fetchall`,
      "http://localhost:3005/api/region/fetchall",
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/fetchdrink/:id", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/drink/fetch/${req.params.id}`,
    );

    res.send(data);
  } catch (error) {
    next(error);
  }
});

app.get("/traffic", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/traffic/fetchall`,
      // `http://localhost:3005/api/traffic/fetchall`
    );

    res.send(data).status(200);
  } catch (error) {
    next(error);
  }
});

//fetch cart
app.get("/api/cart/fetchcart/:id", async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `${process.env.EDITOR_LINK}/api/cart/${req.params.id}`,
      // `http://localhost:3005/api/cart/findcart/${req.params.id}`
    );

    res.send(data).status(200);
  } catch (error) {
    next(error);
  }
});

//catering atc
app.post("/api/catering/atc", async (req, res, next) => {
  try {
    const { data } = await axios.post(
      // `${process.env.EDITOR_LINK}/api/cart/atc`,
      `http://localhost:3005/api/cart/atc`,
      req.body,
    );

    res.send(data).status(200);
  } catch (error) {
    next(error);
  }
});

app.put("/t", async (req, res, next) => {
  try {
    const { data } = await axios.put(
      `${process.env.EDITOR_LINK}/api/traffic/addone`,
      // `http://localhost:3005/api/traffic/addone`,
      { id: req.body.id },
    );

    res.send("~~~!!!!!BEST MILK TEA EVER!!!!!~~~");
  } catch (error) {
    next(error);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => console.log("listening on port " + port));
v();

// use vite's connect instance as middleware
// if you use your own express router (express.Router()), you should use router.use
