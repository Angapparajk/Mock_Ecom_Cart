"use strict";

/**
 * Seeder script to populate the products collection.
 * Usage: node seedProducts.js
 * It connects to MongoDB using MONGODB_URI from .env and inserts sample products.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        "title": "Embroidered Net Gown",
        "brand": "Manyavar",
        "price": 62990,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/cloths-long-fork.png",
        "rating": "3.2",
        "category": "Clothing"
    },
    {
        "title": "Front Load Machine",
        "brand": "Samsung",
        "price": 22490,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-washing-machine.png",
        "rating": "4.5",
        "category": "Appliances"
    },
    {
        "title": "Collider Black Dial Men's Watch",
        "brand": "Fossil",
        "price": 14995,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-simple-belt-watch.png",
        "rating": "4.3",
        "category": "Electronics"
    },
    {
        "title": "True Wireless Earbuds",
        "brand": "LG",
        "price": 13499,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-ear-buds.png",
        "rating": "4.4",
        "category": "Electronics"
    },
    {
        "title": "Maritime Men's Watch",
        "brand": "Titan",
        "price": 11999,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-tatar-watch.png",
        "rating": "4.3",
        "category": "Electronics"
    },
    {
        "title": "Neutra Analog Men's Watch",
        "brand": "Fossil",
        "price": 10995,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-simple-watch.png",
        "rating": "4.1",
        "category": "Electronics"
    },
    {
        "title": "Monsters Charm Toy",
        "brand": "Trendytap",
        "price": 8600,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-minnos.png",
        "rating": "4.2",
        "category": "Toys"
    },
    {
        "title": "Privateer Quartz Watch",
        "brand": "Fossil",
        "price": 8122,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-royal-black-watch.png",
        "rating": "4.4",
        "category": "Electronics"
    },
    {
        "title": "Chronograph black Watch",
        "brand": "Fossil",
        "price": 6395,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-royal-watch.png",
        "rating": "3.8",
        "category": "Electronics"
    },
    {
        "title": "Podcast Microphone",
        "brand": "MAONO",
        "price": 5555,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-singing-mike.png",
        "rating": "4.4",
        "category": "Electronics"
    },
    {
        "title": "Virgin Avocado Oil",
        "brand": "ProV",
        "price": 4144,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-oil.png",
        "rating": "4.4",
        "category": "Grocery"
    },
    {
        "title": "Wrap Dress",
        "brand": "Vero Moda",
        "price": 3039,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-simple-formal.png",
        "rating": "3.2",
        "category": "Clothing"
    },
    {
        "title": "Warm Up Jacket",
        "brand": "Monte Carlo",
        "price": 2796,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-sim-jacket.png",
        "rating": "4.4",
        "category": "Clothing"
    },
    {
        "title": "Slim Fit Blazer",
        "brand": "LEVIS",
        "price": 2599,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-purple-jacket.png",
        "rating": "4.2",
        "category": "Clothing"
    },
    {
        "title": "Men's Waistcoat",
        "brand": "LEVIS",
        "price": 2500,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-jacket.png",
        "rating": "4.3",
        "category": "Clothing"
    },
    {
        "title": "Sheer Anarkali",
        "brand": "Saadgi",
        "price": 2172,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-white-punjabi.png",
        "rating": "3.2",
        "category": "Clothing"
    },
    {
        "title": "SilverBullet Mixer Grinder",
        "brand": "COOKWELL",
        "price": 1899,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-mixer-grinder-white.png",
        "rating": "4.1",
        "category": "Appliances"
    },
    {
        "title": "Zari Design Kurta",
        "brand": "Libas",
        "price": 1869,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-punjabi.png",
        "rating": "4.4",
        "category": "Clothing"
    },
    {
        "title": "Analog Men's Watch",
        "brand": "Fastrack",
        "price": 1850,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-casual-watch.png",
        "rating": "4.2",
        "category": "Electronics"
    },
    {
        "title": "Embellished Maxi Dress",
        "brand": "STREET 9",
        "price": 1799,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/cloths-blue-fork.png",
        "rating": "3.2",
        "category": "Clothing"
    },
    {
        "title": "PS5 Controller Charger",
        "brand": "New World",
        "price": 1749,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-ps5-controller.png",
        "rating": "3.3",
        "category": "Electronics"
    },
    {
        "title": "Mixer Grinder",
        "brand": "Lifelong",
        "price": 1699,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-mixer-grinder.png",
        "rating": "3.9",
        "category": "Appliances"
    },
    {
        "title": "Dynamic Microphone",
        "brand": "JTS Store",
        "price": 1699,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-solo-mike.png",
        "rating": "3.9",
        "category": "Electronics"
    },
    {
        "title": "Tea Kettle Pot",
        "brand": "Indian Art Villa",
        "price": 1685,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-copper-kettle.png",
        "rating": "3.8",
        "category": "Appliances"
    },
    {
        "title": "Non-Toxic Robot Toys",
        "brand": "FunBlast",
        "price": 1545,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-short-green-robot.png",
        "rating": "3.3",
        "category": "Toys"
    },
    {
        "title": "Slim Fit Jeans",
        "brand": "LEVIS",
        "price": 1469,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-jeans-pants.png",
        "rating": "3.1",
        "category": "Clothing"
    },
    {
        "title": "Panda Baby Product",
        "brand": "Panda",
        "price": 1399,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-big-two-wheeler.png",
        "rating": "4.3",
        "category": "Toys"
    },
    {
        "title": "Handheld Full Body Massager",
        "brand": "AGARO REGAL",
        "price": 1299,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-body-massager.png",
        "rating": "4.3",
        "category": "Appliances"
    },
    {
        "title": "Turmeric Powder",
        "brand": "Patanjali",
        "price": 1234,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-turmeric.png",
        "rating": "2.8",
        "category": "Grocery"
    },
    {
        "title": "Nova SuperGroom Multi-kit",
        "brand": "Nova",
        "price": 1199,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-nover-v2-trimmer.png",
        "rating": "4.4",
        "category": "Electronics"
    },
    {
        "title": "Animal Printed Shirt",
        "brand": "Mufti",
        "price": 1017,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-short-sleeves-shirt.png",
        "rating": "4",
        "category": "Clothing"
    },
    {
        "title": "Knit Cream Sweater",
        "brand": "MansiCollections",
        "price": 996,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-stylish-sweater.png",
        "rating": "3.2",
        "category": "Clothing"
    },
    {
        "title": "Miss Chase Bodycon Dress",
        "brand": "LEVIS",
        "price": 974,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-modren-net.png",
        "rating": "3.8",
        "category": "Clothing"
    },
    {
        "title": "Chilli Extract Sauce",
        "brand": "Everin",
        "price": 788,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-extract.png",
        "rating": "4.1"
    },
    {
        "title": "Batman Batmobile",
        "brand": "Funskool",
        "price": 745,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-batman-toy.png",
        "rating": "4.7",
        "category": "Toys"
    },
    {
        "title": "Knitted Rabbit",
        "brand": "Ira",
        "price": 620,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-orange-rabbit.png",
        "rating": "4.4",
        "category": "Toys"
    },
    {
        "title": "Kids Toy Train",
        "brand": "FIONA",
        "price": 599,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-red-train.png",
        "rating": "4.1",
        "category": "Toys"
    },
    {
        "title": "Honey Teddy Bear",
        "brand": "Honey",
        "price": 599,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-simple-teddy.png",
        "rating": "4.3",
        "category": "Toys"
    },
    {
        "title": "Cotton Hoodie",
        "brand": "Scott International",
        "price": 498,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-hoodie.png",
        "rating": "3.8",
        "category": "Clothing"
    },
    {
        "title": "Nexa Yellow Car",
        "brand": "Quinergys",
        "price": 490,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-yellow-car.png",
        "rating": "4.1",
        "category": "Toys"
    },
    {
        "title": "Polyester Saree",
        "brand": "Ahalyaa",
        "price": 419,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-side-sareee.png",
        "rating": "3.8",
        "category": "Clothing"
    },
    {
        "title": "Aluminium 4 Cup Tea Kettle",
        "brand": "Kitchen Expert",
        "price": 399,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-kettle.png",
        "rating": "4.3",
        "category": "Electronics"
    },
    {
        "title": "Beard Trimmer",
        "brand": "Nova",
        "price": 398,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-nova-trimmer.png",
        "rating": "4.5",
        "category": "Electronics"
    },
    {
        "title": "Plain Round Neck T-shirt",
        "brand": "Huetrap",
        "price": 395,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-fit-t-shirt.png",
        "rating": "4.1",
        "category": "Clothing"
    },
    {
        "title": "Tripod Stand",
        "brand": "Sketchfab",
        "price": 390,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-medium-tripod.png",
        "rating": "4.2",
        "category": "Electronics"
    },
    {
        "title": "Bot Robot Toy",
        "brand": "WireScorts",
        "price": 355,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/toys-orange-robot.png",
        "rating": "3.8",
        "category": "Toys"
    },
    {
        "title": "Wide Bowknot Hat",
        "brand": "MAJIK",
        "price": 288,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-cap.png",
        "rating": "3.6",
        "category": "Clothing"
    },
    {
        "title": "Crystal Sugar",
        "brand": "NatureVit",
        "price": 278,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-sugar-cubes.png",
        "rating": "3.6",
        "category": "Grocery"
    },
    {
        "title": "Basmati Rice",
        "brand": "Fortune",
        "price": 244,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-rice.png",
        "rating": "3.6",
        "category": "Grocery"
    },
    {
        "title": "Flour Unbleached",
        "brand": "TWF Store",
        "price": 200,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery--flour.png",
        "rating": "4.3",
        "category": "Grocery"
    },
    {
        "title": "Maroon Kumkum ",
        "brand": "Amazon",
        "price": 200,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery--kumkum.png",
        "rating": "3.9",
        "category": "Grocery"
    },
    {
        "title": "Eggs",
        "brand": "Naturoz",
        "price": 60,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-eggs.png",
        "rating": "3.6",
        "category": "Grocery"
    },
    {
        "title": "Fresh Lemon, 100g",
        "brand": "Amazon",
        "price": 50,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-lemons.png",
        "rating": "4.5",
        "category": "Grocery"
    },
    {
        "title": "Fresh Produce Green Chilli",
        "brand": "Amazon",
        "price": 30,
        "image_url": "https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-green-chilli.png",
        "rating": "4.2",
        "category": "Grocery"
    }
]
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany({});

    // Map product keys to Product schema fields
    const docs = products.map(p => {
      // Determine category based on product title/type if not specified
      let category = p.category;
      if (!category) {
        if (p.image_url.includes('cloths-') || p.image_url.includes('clothes-')) {
          category = 'Clothing';
        } else if (p.image_url.includes('electronics-')) {
          category = 'Electronics';
        } else if (p.image_url.includes('appliances-')) {
          category = 'Appliances';
        } else if (p.image_url.includes('grocery-')) {
          category = 'Grocery';
        } else if (p.image_url.includes('toys-')) {
          category = 'Toys';
        } else {
          // Default category based on product title
          if (p.title.toLowerCase().match(/(shirt|dress|gown|jeans|jacket|saree)/)) {
            category = 'Clothing';
          } else if (p.title.toLowerCase().match(/(phone|watch|earbuds|trimmer)/)) {
            category = 'Electronics';
          } else if (p.title.toLowerCase().match(/(grinder|kettle|machine)/)) {
            category = 'Appliances';
          } else if (p.title.toLowerCase().match(/(oil|powder|sugar|eggs|rice)/)) {
            category = 'Grocery';
          } else {
            category = 'Electronics'; // default category
          }
        }
      }

      return {
        title: p.title,
        brand: p.brand,
        price: p.price,
        imageUrl: p.image_url,
        rating: Number(p.rating),
        category: category,
      };
    });

    await Product.insertMany(docs);
  } catch (err) {
    // Silent error handling
  } finally {
    await mongoose.disconnect();
  }
}

seed();