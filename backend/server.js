const express = require('express'); 
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express(); 
require('dotenv').config();
const PORT = process.env.PORT || 5001;
app.use(express.json()); 
app.use(bodyParser.json());
// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');
const {ObjectId} = require('mongodb');
const crypto = require('crypto');
// Node.js program to demonstrate the     
// crypto.createHmac() method
 
// Includes crypto module

app.use(cors());

app.use((err, req, res, next) => { 
  console.error(err.stack); 
  res.status(500).json('Something broke!'); 
});

const url = process.env.DBHOST;
const dbName = 'udemy';


// Connect to the MongoDB server
console.error("hello world");

const courses = [
  { id: 1, name: 'Product 1', description: 'Description of Product 1', image:'https://img.freepik.com/free-photo/book-composition-with-open-book_23-2147690555.jpg', price: 100 },
  { id: 2, name: 'Product 2', description: 'Description of Product 2',image:'https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg' , price: 200 },
  { id: 3, name: 'Product 3', description: 'Description of Product 3',image:'https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg' , price: 500 },
  { id: 4, name: 'Product 4', description: 'Description of Product 4',image:'https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg' , price: 500 },
  { id: 5, name: 'Product 5', description: 'Description of Product 5',image:'https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg' , price: 500 },
  { id: 6, name: 'Product 6', description: 'Description of Product 6',image:'https://st2.depositphotos.com/2769299/7314/i/450/depositphotos_73146775-stock-photo-a-stack-of-books-on.jpg' , price: 500 }
];

let cart = [];
let orders = [];

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

MongoClient.connect(url).then(client=>{
  console.error('Connected successfully to MongoDB server');
  const db = client.db(dbName);
  app.get('/api/courses', async(req, res) => {
    try{
      const collection = db.collection('courses');
      const documents = await collection.find({}).toArray();
      const transformedDocuments = documents.map(doc => {
        return { ...doc, id: doc._id, _id: undefined };
      });
      res.status(200).json(transformedDocuments);
    }
    catch (err) {
      res.status(500).json('Error retrieving data');
    }
  });

  app.post('/api/courses', async (req, res) => {
    console.error(req.body);
      const collection = db.collection('courses');
      const newDocument = req.body;
      await collection.insertOne(newDocument).then(async (result)=>{
        await collection.findOne({_id:result.insertedId}).then(result=>{
          result.id = result._id;
          delete result._id;
          return res.status(201).send(result);
        }).catch(err=>{
          return res.status(500).json('Error inserting data');
        })
      }).catch(err=>{
        return res.status(500).json('Error inserting data');
      })    
    })

  app.patch('/api/course/:id', async (req, res) => {
    const id = req.params.id;
    const updateDocument = req.body;
       console.log(updateDocument);
    try {
      const collection = db.collection('courses');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDocument }
      );
      result.id = result._id;
      delete result._id;
      console.log("result",result);
      if (result.matchedCount === 0) {
        return res.status(404).json('Document not found');
      }
      console.log("result",result);
      return res.status(201).json(`Successfully updated document with id ${id}`);
    } catch (err) {
      console.log("err",err);
      return res.status(500).json('Error updating data');
    }
  });


  // get cart
  app.get('/api/cart', async(req, res) => {
    try{
      const collection = db.collection('cart');
      const documents = await collection.find({}).toArray();
      const transformedCart = documents.map(doc => {
        return { ...doc, id: doc._id, _id: undefined };
      });
      return res.status(200).json(transformedCart);
    }
    catch (err) {
      return res.status(500).json('Error retrieving data');
    }
  });

  // add to cart
 app.post('/api/cart', async (req, res) => {
      const collection = db.collection('cart');
      const newDocument = {...req.body,course: new ObjectId(req.body.id)};
      delete newDocument.id;
      await collection.insertOne(newDocument).then(async (result)=>{
        await collection.findOne({_id:result.insertedId}).then(result=>{
          return res.status(201).send(result);
        }).catch(err=>{
          return res.status(500).json('Error inserting data');
        })
      }).catch(err=>{
        return res.status(500).json('Error inserting data');
      })
    })


  // delete Cart

  app.delete('/api/cart/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const collection = db.collection('cart');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(204).json('Document not found');
      }
      console.error("deleted result",result);
      return res.status(204).json(`Successfully deleted document with id ${id}`);
    } catch (err) {
      return res.status(500).json('Error deleting data');
    }
  });

  //delete Course

  app.delete('/api/course/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const collection = db.collection('courses');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(204).json('Document not found');
      }
      console.error("deleted result",result);
      return res.status(204).json(`Successfully deleted document with id ${id}`);
    } catch (err) {
      return res.status(500).json('Error deleting data');
    }
  });


// Create order endpoint
app.post('/api/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;
  console.log(amount,currency, receipt);
    const order = await razorpay.orders.create({ amount, currency, receipt });
    const collection = db.collection('order');
    await collection.insertOne(order).then(async (result)=>{
      await collection.findOne({_id:result.insertedId}).then(result => {
        return res.status(201).json(result);
      }).catch(err=> {
        return res.status(500).json('Error in finding inserted data');
      })
    }).catch(err=> {
      return res.status(500).json('Error inserting data');
    })
});

// Get orders
app.get('/api/orders', async(req, res) => {
  try{
    const collection = db.collection('order');
    const documents = await collection.find({}).toArray();
    const transformedDocuments = documents.map(doc => {
      return { ...doc, id: doc._id, _id: undefined };
    });
    return res.status(200).json(transformedDocuments);
  }
  catch (err) {
    return res.status(500).json('Error retrieving data');
  }
});

//Verify Order
app.post('/api/verify-payment', async(req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
console.error(razorpay_order_id, razorpay_payment_id, razorpay_signature );
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');
    const collection = db.collection('payment');
  if (generatedSignature === razorpay_signature) {
          await collection.insertOne({order: new ObjectId(req.body.id),payment:'Success'}).then((result)=>{
            return res.status(200).json({ status: 'success' });
          }).catch(err=> {
            return res.status(500).json('payment success');
          })
  } else {
    await collection.insertOne({order: new ObjectId(req.body.id),payment:'failure'}).then((result)=>{
      return res.status(200).json({ status: 'failue' });
    }).catch(err=> {
      return res.status(500).json({ status: 'failue' });
    })
    return res.status(400).json({ status: 'failure' });
  }
});
}).catch(error=>{
  console.error('Failed to connect to the database', error);
  process.exit(1);
})
  




  




// // Get courses list
// app.get('/api/courses', (req, res) => {
//   return res.json(courses);
// });


// app.post('/api/cart', (req, res) => {
//   cart.push(req.body);
//   res.status(201).json(req.body);
// });


// // Add to cart
// app.post('/api/cart', (req, res) => {
//   cart.push(req.body);
//   res.status(201).json(req.body);
// });

// app.delete('/api/cart/:id', (req, res) => {
//   console.error("req.params.id",req.params.id);
//   console.error("cart",cart);
//   let updatedCart = [],i;
//   for(i = 0;i<cart.length;i++){
//     if(cart[i].id != req.params.id ){
//       updatedCart.push(cart[i]);
//     }
//     if(i == cart.length-1 ){
//       console.error(updatedCart);
//       res.status(200).json(updatedCart);
//     }
//   }
// })

// // Get cart items
// app.get('/api/cart', (req, res) => {
//   res.json(cart);
// });

// // Create order endpoint
// app.post('/api/create-order', async (req, res) => {
//   const { amount, currency, receipt } = req.body;
//   try {
//     const order = await razorpay.orders.create({ amount, currency, receipt });
//     console.error("order",order);
//     res.json(order);
//   } catch (error) {
//     console.error("error",error);
//     res.status(500).json(error);
//   }
// });

// // Get orders
// app.get('/api/orders', (req, res) => {
//   res.json(orders);
// });







// // Payment verification endpoint
// app.post('/api/verify-payment', (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
// console.error(razorpay_order_id, razorpay_payment_id, razorpay_signature );
//   const generatedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest('hex');
//   if (generatedSignature === razorpay_signature) {
//     res.json({ status: 'success' });
//   } else {
//     res.status(400).json({ status: 'failure' });
//   }
// });

// // Get orders
// app.get('/api/orders', (req, res) => {
//   res.json(orders);
// });



app.listen(PORT, () => {
  console.error(`Server running on port ${PORT}`);
});