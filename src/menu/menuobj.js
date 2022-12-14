const menuobj = [
  {
    id: "fruitteasection",
    section: "Fruit Teas",
    items: [
      {
        id: 1,
        htmlid: "mangojasmine",
        name: "Mango Jasmine Tea",
        image: "../assets/Final/mango_small.jpg",
      },

      {
        id: 2,
        htmlid: "lycheefruittea",
        name: "Lychee Jasmine Tea",
        image: "../assets/Final/lychee_small.jpg",
      },
      {
        id: 3,
        htmlid: "passionfruittea",
        name: "Passionfruit Jasmine Tea",
        image: "../assets/Final/passion_small.jpg",
      },
    ],
  },

  {
    id: "milkteasection",
    section: "Milk Teas",
    items: [
      {
        id: 4,
        htmlid: "jasminemilktea",
        name: "Jasmine Milk Tea",
        image: "../assets/Final/jasmine_jelly_small.jpg",
      },

      {
        id: 5,
        htmlid: "oolongmilktea",
        name: "Roasted Oolong Milk Tea",
        image: "../assets/Final/oolong_jelly_small.jpg",
      },
      {
        id: 6,
        htmlid: "matchamilktea",
        name: "Matcha Milk Tea",
        image: "../assets/Final/matcha_small.jpg",
      },

      {
        id: 7,
        htmlid: "taromilktea",
        name: "Taro Milk Tea",
        image: "../assets/Final/taro_small.jpg",
      },

      {
        id: 8,
        htmlid: "coffeemilktea",
        name: "Coffee Milk Tea",
        image: "../assets/Final/coffee_mt_small.jpg",
      },
    ],
  },

  {
    id: "specialsection",
    section: "Specialty Drinks",
    items: [
      {
        id: 9,
        htmlid: "thaiicedtea",
        name: "Thai Iced Tea",
        image: "../assets/Final/thai_tea_small.jpg",
      },

      {
        id: 10,
        htmlid: "vietnamesecoffee",
        name: "Vietnamese Coffee",
        image: "../assets/Final/coffee_small.jpg",
      },
      {
        id: 11,
        htmlid: "mangolassi",
        name: "Mango Lassi",
        image: "../assets/Final/lassi-removebg-preview.png",
      },
    ],
  },
];

const allItems = [
  {
    id: 1,
    htmlid: "mangojasmine",
    name: "Mango Jasmine Tea",
    image: "../assets/Final/mango_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 420,
        calories: 144,
        total_fat: [0, 0],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [35, 13],
        dietary_fiber: [0, 0],
        total_sugars: 24,
        added_sugars: [0, 0],
        protein: [1, 2],
      },

      large: {
        serving_size: 546,
        calories: 187,
        total_fat: [18, 23],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [64, 13],
        dietary_fiber: [0, 0],
        total_sugars: 39,
        added_sugars: [0, 0],
        protein: [1, 2],
      },
    },
  },

  {
    id: 2,
    htmlid: "lycheefruittea",
    name: "Lychee Jasmine Tea",
    image: "../assets/Final/lychee_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 420,
        calories: 144,
        total_fat: [0, 0],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [35, 13],
        dietary_fiber: [0, 0],
        total_sugars: 24,
        added_sugars: [0, 0],
        protein: [1, 2],
      },

      large: {
        serving_size: 546,
        calories: 187,
        total_fat: [0, 0],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [46, 13],
        dietary_fiber: [0, 0],
        total_sugars: 31,
        added_sugars: [0, 0],
        protein: [1, 2],
      },
    },
  },
  {
    id: 3,
    htmlid: "passionfruittea",
    name: "Passionfruit Jasmine Tea",
    image: "../assets/Final/passion_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 420,
        calories: 167,
        total_fat: [1, 1],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [43, 16],
        dietary_fiber: [0, 0],
        total_sugars: 38,
        added_sugars: [0, 0],
        protein: [0, 0],
      },

      large: {
        serving_size: 546,
        calories: 217,
        total_fat: [1, 1],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [56, 16],
        dietary_fiber: [0, 0],
        total_sugars: 49,
        added_sugars: [0, 0],
        protein: [0, 0],
      },
    },
  },
  {
    id: 4,
    htmlid: "jasminemilktea",
    name: "Jasmine Milk Tea",
    image: "../assets/Final/jasmine_jelly_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 400,
        calories: 325,
        total_fat: [14, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [48, 17],
        dietary_fiber: [0, 0],
        total_sugars: 27,
        added_sugars: [0, 0],
        protein: [1, 2],
      },

      large: {
        serving_size: 520,
        calories: 422,
        total_fat: [18, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [62, 17],
        dietary_fiber: [0, 0],
        total_sugars: 35,
        added_sugars: [0, 0],
        protein: [1, 2],
      },
    },
  },

  {
    id: 5,
    htmlid: "oolongmilktea",
    name: "Roasted Oolong Milk Tea",
    image: "../assets/Final/oolong_jelly_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 400,
        calories: 332,
        total_fat: [14, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [49, 18],
        dietary_fiber: [0, 0],
        total_sugars: 30,
        added_sugars: [0, 0],
        protein: [1, 2],
      },

      large: {
        serving_size: 400,
        calories: 431,
        total_fat: [18, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [64, 18],
        dietary_fiber: [0, 0],
        total_sugars: 39,
        added_sugars: [0, 0],
        protein: [1, 2],
      },
    },
  },
  {
    //missing
    id: 6,
    htmlid: "matchamilktea",
    name: "Matcha Milk Tea",
    image: "../assets/Final/matcha_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 400,
        calories: 325,
        total_fat: [14, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [48, 17],
        dietary_fiber: [0, 0],
        total_sugars: 27,
        added_sugars: [0, 0],
        protein: [1, 2],
      },

      // large: {
      //   serving_size: 400,
      //   calories: 332,
      //   total_fat: [14, 18],
      //   saturated_fat: [0, 0],
      //   trans_fat: 0,
      //   sodium: [0, 0],
      //   total_carbohydrate: [49, 18],
      //   dietary_fiber: [0, 0],
      //   total_sugars: 30,
      //   added_sugars: [0, 0],
      //   protein: [1, 2],
      // },
    },
  },

  {
    id: 7,
    htmlid: "taromilktea",
    name: "Taro Milk Tea",
    image: "../assets/Final/taro_small.jpg",
    nutrition: {
      //correct
      small: {
        serving_size: 400,
        calories: 330,
        total_fat: [14, 18],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [45, 2],
        total_carbohydrate: [0, 0],
        dietary_fiber: [0, 0],
        total_sugars: 0,
        added_sugars: [28, 56],
        protein: [1, 2],
      },
    },
  },

  {
    //missing
    id: 8,
    htmlid: "coffeemilktea",
    name: "Coffee Milk Tea",
    image: "../assets/Final/coffee_mt_small.jpg",
    nutrition: {
      small: {
        serving_size: 546,
        calories: 431,
        total_fat: [16, 15],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [75, 18],
        dietary_fiber: [0, 0],
        total_sugars: 47,
        added_sugars: [0, 0],
        protein: [4, 7],
      },
    },
  },
  {
    id: 9,
    htmlid: "thaiicedtea",
    name: "Thai Iced Tea",
    image: "../assets/Final/thai_tea_small.jpg",
    nutrition: {
      small: {
        serving_size: 425,
        calories: 374,
        total_fat: [13, 17],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [56, 20],
        dietary_fiber: [0, 0],
        total_sugars: 42,
        added_sugars: [0, 0],
        protein: [4, 8],
      },

      large: {
        serving_size: 553,
        calories: 486,
        total_fat: [17, 17],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [73, 20],
        dietary_fiber: [0, 0],
        total_sugars: 55,
        added_sugars: [0, 0],
        protein: [5, 8],
      },
    },
  },

  {
    id: 10,
    htmlid: "vietnamesecoffee",
    name: "Vietnamese Coffee",
    image: "../assets/Final/coffee_small.jpg",
    nutrition: {
      small: {
        serving_size: 420,
        calories: 340,
        total_fat: [10, 13],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [52, 19],
        dietary_fiber: [0, 0],
        total_sugars: 47,
        added_sugars: [0, 0],
        protein: [6, 12],
      },

      large: {
        serving_size: 546,
        calories: 442,
        total_fat: [13, 13],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [68, 19],
        dietary_fiber: [0, 0],
        total_sugars: 61,
        added_sugars: [0, 0],
        protein: [8, 12],
      },
    },
  },
  {
    id: 11,
    htmlid: "mangolassi",
    name: "Mango Lassi",
    image: "../assets/Final/lassi-removebg-preview.png",
    nutrition: {
      small: {
        serving_size: 420,
        calories: 378,
        total_fat: [10, 13],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [63, 23],
        dietary_fiber: [0, 0],
        total_sugars: 45,
        added_sugars: [0, 0],
        protein: [8, 16],
      },

      large: {
        serving_size: 546,
        calories: 491,
        total_fat: [13, 13],
        saturated_fat: [0, 0],
        trans_fat: 0,
        sodium: [0, 0],
        total_carbohydrate: [82, 23],
        dietary_fiber: [0, 0],
        total_sugars: 59,
        added_sugars: [0, 0],
        protein: [10, 16],
      },
    },
  },
];

export { menuobj, allItems };
