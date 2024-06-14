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
const { Client } = require('pg');
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

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'udemy',
//   password: 'Anandraj12345/',
//   port: 5432,
// });



const client = new Client({
  connectionString: process.env.POSTGRES_URL,
})

client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');

    app.get('/api/courses', async(req, res) => {
      client.query('SELECT * FROM courses', (err, result) => {
        if (err) {
          res.status(500).json('Error retrieving data');
        } else {
          console.log('Query result:', result.rows);
          res.status(200).json(result.rows);
        }
    });
	})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/api/courses', async (req, res) => {
  console.error(req.body);
  const { name, description, price,image } = req.body;

  const query = `
  CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    price NUMERIC,
    image TEXT
  );
`;

try {
  const res = await client.query(query);
  console.log('Table is successfully created');
} catch (err) {
  console.error('Error executing query', err.stack);
} 
  try {
    const result = await client.query(
      'INSERT INTO courses (name, description, price,image) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, description, price,image]
    );
    console.log("result.rows[0]",result.rows[0])
    console.log("result",result)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error in creating course');
    // Handle duplicate email error
  }
  })


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // add to cart
  app.post('/api/cart', async (req, res) => {
  const {id:course ,name, description, price,image } = req.body;

  const query = `
  CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    course INTEGER REFERENCES courses(id),
    name TEXT,
    description TEXT,
    price NUMERIC,
    image TEXT
  );
`;

try {
  const res = await client.query(query);
  console.log('Table is successfully created');
} catch (err) {
  console.error('Error executing query', err.stack);
} 


  try {
    const result = await client.query(
      'INSERT INTO cart (course ,name, description, price,image) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [course, name, description, price,image]
    );
    console.log("result.rows[0]",result.rows[0])
    console.log("result",result)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error in creating cart');
    // Handle duplicate email error
  }
  })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //get cart
  app.get('/api/cart', async(req, res) => {
    client.query('SELECT * FROM cart', (err, result) => {
      if (err) {
        res.status(500).json('Error retrieving data');
      } else {
        console.log('Query result:', result.rows);
        res.status(200).json(result.rows);
      }
  });
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 // delete Cart

 app.delete('/api/cart/:id', async (req, res) => {
  console.log("delete cart",req.params.id)
  const { id } = req.params;

  try {
    const result = await client.query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      res.status(404).send('Cart item not found');
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

  //delete Course

  app.delete('/api/course/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await client.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        res.status(404).send('Cart item not found');
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });


  app.patch('/api/course/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, image, price } = req.body;
  
    // Construct the query dynamically based on the provided fields
    let fields = [];
    let values = [];
    let counter = 1;
  
    if (name) {
      fields.push(`name = $${counter++}`);
      values.push(name);
    }
    if (description) {
      fields.push(`description = $${counter++}`);
      values.push(description);
    }
    if (image) {
      fields.push(`image = $${counter++}`);
      values.push(image);
    }
    if (price) {
      fields.push(`price = $${counter++}`);
      values.push(price);
    }
  
    // If no fields to update, return 400
    if (fields.length === 0) {
      return res.status(400).send('No fields to update');
    }
  
    const query = `UPDATE courses SET ${fields.join(', ')} WHERE id = $${counter} RETURNING *`;
    values.push(id);
  
    try {
      const result = await client.query(query, values);
      if (result.rowCount === 0) {
        res.status(404).send('Course not found');
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

// Create order endpoint
app.post('/api/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;
  console.log(amount,currency, receipt);
    const order = await razorpay.orders.create({ amount, currency, receipt });

    console.log("order",order);

    const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      amount NUMERIC,
      amount_due NUMERIC,
      amount_paid NUMERIC,
      attempts INTEGER,
      created_at INTEGER,
      currency TEXT,
      entity TEXT,
      order_id TEXT,
      offer_id TEXT,
      receipt TEXT,
      status TEXT
    );
  `;

  try {
    const res = await client.query(query);
    console.log('Table is successfully created');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } 

  const {id, amount_due, amount_paid, attempts ,created_at, entity, offer_id, status } = order;

  try {
    const result = await client.query(
      'INSERT INTO orders (order_id, amount, currency, receipt, amount_due, amount_paid, attempts ,created_at, entity, offer_id, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
      [id, amount, currency, receipt, amount_due, amount_paid, attempts ,created_at, entity, offer_id, status]
    );

    console.log("result.rows[0]",result.rows[0])
    console.log("result",result)
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error in creating Orders');
  }

});


//Verify Orders

app.post('/api/verify-payment', async(req, res) => {
   
  console.log("Verify payment");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
console.error(razorpay_order_id, razorpay_payment_id, razorpay_signature );
  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

    console.log('payment 1');

    const query = `
    CREATE TABLE IF NOT EXISTS payment (
      id SERIAL PRIMARY KEY,
      payment_status TEXT,
      order_id INTEGER REFERENCES orders(id)
    );
  `;

  console.log('payment 2');

  try {
    const res = await client.query(query);
    console.log('Table is successfully created');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } 

  console.log('payment 2');

  if (generatedSignature === razorpay_signature) {
    console.log('payment 3');
    try {
      const result = await client.query(
        'INSERT INTO payment (payment_status,order_id) VALUES ($1,$2) RETURNING *',
        ["success",req.body.id]
      );
      if(result){
        return res.status(200).json({ status: 'success' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json('payment success');
    }
    console.log('payment 4');
  } else {
    console.log('payment 5');
    try {
      const result = await client.query(
        'INSERT INTO payment (payment_status,order_id) VALUES ($1,$2) RETURNING *',
        ["failure",req.body.id]
      );
      if(result){
        return res.status(200).json({ status: 'failure' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json('payment failure');
    }
    console.log('payment 6');
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get orders

app.get('/api/orders', async(req, res) => {

  client.query('SELECT * FROM orders', (err, result) => {
    if (err) {
      res.status(500).json('Error retrieving data');
    } else {
      console.log('Query result:', result.rows);
      res.status(200).json(result.rows);
    }
});
});

}).catch(error=>{ 
  console.error('Failed to connect to the database', error);
  process.exit(1);
})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

  


// MongoClient.connect(url).then(client=>{
//   console.error('Connected successfully to MongoDB server');
//   const db = client.db(dbName);

  // app.get('/api/courses', async(req, res) => {
  //   try{
  //     const collection = db.collection('courses');
  //     const documents = await collection.find({}).toArray();
  //     const transformedDocuments = documents.map(doc => {
  //       return { ...doc, id: doc._id, _id: undefined };
  //     });
  //     res.status(200).json(transformedDocuments);
  //   }
  //   catch (err) {
  //     res.status(500).json('Error retrieving data');
  //   }
  // });

  // app.post('/api/courses', async (req, res) => {
  //   console.error(req.body);
  //     const collection = db.collection('courses');
  //     const newDocument = req.body;
  //     await collection.insertOne(newDocument).then(async (result)=>{
  //       await collection.findOne({_id:result.insertedId}).then(result=>{
  //         result.id = result._id;
  //         delete result._id;
  //         return res.status(201).send(result);
  //       }).catch(err=>{
  //         return res.status(500).json('Error inserting data');
  //       })
  //     }).catch(err=>{
  //       return res.status(500).json('Error inserting data');
  //     })    
  //   })

  // app.patch('/api/course/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const updateDocument = req.body;
  //      console.log(updateDocument);
  //   try {
  //     const collection = db.collection('courses');
  //     const result = await collection.updateOne(
  //       { _id: new ObjectId(id) },
  //       { $set: updateDocument }
  //     );
  //     result.id = result._id;
  //     delete result._id;
  //     console.log("result",result);
  //     if (result.matchedCount === 0) {
  //       return res.status(404).json('Document not found');
  //     }
  //     console.log("result",result);
  //     return res.status(201).json(`Successfully updated document with id ${id}`);
  //   } catch (err) {
  //     console.log("err",err);
  //     return res.status(500).json('Error updating data');
  //   }
  // });


  // get cart
  // app.get('/api/cart', async(req, res) => {
  //   try{
  //     const collection = db.collection('cart');
  //     const documents = await collection.find({}).toArray();
  //     const transformedCart = documents.map(doc => {
  //       return { ...doc, id: doc._id, _id: undefined };
  //     });
  //     return res.status(200).json(transformedCart);
  //   }
  //   catch (err) {
  //     return res.status(500).json('Error retrieving data');
  //   }
  // });

  // add to cart

//  app.post('/api/cart', async (req, res) => {
//       const collection = db.collection('cart');
//       const newDocument = {...req.body,course: new ObjectId(req.body.id)};
//       delete newDocument.id;
//       await collection.insertOne(newDocument).then(async (result)=>{
//         await collection.findOne({_id:result.insertedId}).then(result=>{
//           return res.status(201).send(result);
//         }).catch(err=>{
//           return res.status(500).json('Error inserting data');
//         })
//       }).catch(err=>{
//         return res.status(500).json('Error inserting data');
//       })
//     })


  // delete Cart

  // app.delete('/api/cart/:id', async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     const collection = db.collection('cart');
  //     const result = await collection.deleteOne({ _id: new ObjectId(id) });
  //     if (result.deletedCount === 0) {
  //       return res.status(204).json('Document not found');
  //     }
  //     console.error("deleted result",result);
  //     return res.status(204).json(`Successfully deleted document with id ${id}`);
  //   } catch (err) {
  //     return res.status(500).json('Error deleting data');
  //   }
  // });

  // //delete Course

  // app.delete('/api/course/:id', async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     const collection = db.collection('courses');
  //     const result = await collection.deleteOne({ _id: new ObjectId(id) });
  //     if (result.deletedCount === 0) {
  //       return res.status(204).json('Document not found');
  //     }
  //     console.error("deleted result",result);
  //     return res.status(204).json(`Successfully deleted document with id ${id}`);
  //   } catch (err) {
  //     return res.status(500).json('Error deleting data');
  //   }
  // });


// // Create order endpoint
// app.post('/api/create-order', async (req, res) => {
//   const { amount, currency, receipt } = req.body;
//   console.log(amount,currency, receipt);
//     const order = await razorpay.orders.create({ amount, currency, receipt });
//     console.log("order",order)
//     const collection = db.collection('order');
//     await collection.insertOne(order).then(async (result)=>{
//       await collection.findOne({_id:result.insertedId}).then(result => {
//         return res.status(201).json(result);
//       }).catch(err=> {
//         return res.status(500).json('Error in finding inserted data');
//       })
//     }).catch(err=> {
//       return res.status(500).json('Error inserting data');
//     })
// });



// Get orders
// app.get('/api/orders', async(req, res) => {
//   try{
//     const collection = db.collection('order');
//     const documents = await collection.find({}).toArray();
//     const transformedDocuments = documents.map(doc => {
//       return { ...doc, id: doc._id, _id: undefined };
//     });
//     return res.status(200).json(transformedDocuments);
//   }
//   catch (err) {
//     return res.status(500).json('Error retrieving data');
//   }
// });

// //Verify Order
// app.post('/api/verify-payment', async(req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
// console.error(razorpay_order_id, razorpay_payment_id, razorpay_signature );
//   const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest('hex');
//     const collection = db.collection('payment');
//   if (generatedSignature === razorpay_signature) {
//           await collection.insertOne({order: new ObjectId(req.body.id),payment:'Success'}).then((result)=>{
//             return res.status(200).json({ status: 'success' });
//           }).catch(err=> {
//             return res.status(500).json('payment success');
//           })
//   } else {
//     await collection.insertOne({order: new ObjectId(req.body.id),payment:'failure'}).then((result)=>{
//       return res.status(200).json({ status: 'failue' });
//     }).catch(err=> {
//       return res.status(500).json({ status: 'failue' });
//     })
//     return res.status(400).json({ status: 'failure' });
//   }
// });
// }).catch(error=>{
//   console.error('Failed to connect to the database', error);
//   process.exit(1);
// })
  
// })
  




app.listen(PORT, () => {
  console.error(`Server running on port ${PORT}`);
});
