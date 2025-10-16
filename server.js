// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const {AppError, NotFound, ValidationError, ForbiddenError, AuthenticationError} = require('./customErrors/errors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());



// sample in-memory user database
let users = [
  { id: '1000',
    name: 'Josphat Karumi',
    role: 'user'
  },
  {
    id: '1001',
    name: 'Magarida Otieno',
    role: 'admin',
  },
  { 
    id: '1002',
    name: 'Muchiri Hospari',
    role: 'user'
  }
]

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];


//logger
const logger = function (req, res, next){
  const timestamp = new Date().toISOString();
  console.log(`The request method: ${req.method}, The URL: ${req.originalUrl}, The timestamp: ${timestamp}`)
  next();
}
app.use(logger);

//authentication middleware that checks for an API key in the request headers
const authe = function(req, res, next){
  const myKey = process.env.API_KEY;
  const apiKey = req.get('x-api-key');
  if(!apiKey || apiKey !== myKey){
    const err = new AuthenticationError('Invalid Key');
    return next(err);
  }

 next();
 
}

//- Add validation middleware for the product creation and update routes
const validate = function(req, res, next){
  try {
    const userId = req.get('x-user-id');
  const user = users.find(x=>x.id === userId);
  if(!user || user.role !== 'admin'){
    const err = new ForbiddenError("Access Denied!! You have to be an admin to create a product");
    return next(err);
  }
  next();
  } catch (error) {
    next(error);
  }

}



// Root route
app.get('/', (req, res) => {
  res.send('Hello World!!!');
});
 

// ROUTES

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  let { category, search, page, limit } = req.query;  

  //Filter by category (if provided)
  let filtered = category
    ? products.filter(p => p.category === category) : products;

  // Search by name
  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(lower));
  }

  //  pagination
  page = parseInt(req.query.page) - 1 || 0;
  limit = parseInt(limit) || 5;
  const start = page * limit;
  const paginated = filtered.slice(start, start + limit);


  res.json({
    total: filtered.length,
    page: page + 1,
    limit,
    results: paginated
  });
});

// Implement route for getting product statistics (e.g., count by category)
app.get('/api/products/stats', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  const stats = categories.map(cat => {
    const category = cat;
    const count = products.filter(p => p.category === cat).length;
    return {category, count}
  });

  res.json(stats);
});



//  GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next)=> {
  try {
    const id = req.params.id;
     const product = products.find(p=>p.id === id );
     if (!product){
      const err = new NotFound('Product')
      return next(err);
     }
     res.json(product)
  } catch (error) {
    res.status(500).json({message: error.message});
  }

});

// POST /api/products - Create a new product
app.post('/api/products', validate, (req, res)=> {
  try {
    const {name, description, price, category, inStock} = req.body;

    if(!name|| !description|| !price|| !category){
      throw new Error("All fields are required!!");
      
    }
    
    const id = uuidv4();
    const newProduct = {id, name, description, price, category, inStock};
    products.push(newProduct);
    res.status(201).json(`${name} has successfully been created`)
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

//PUT /api/products/:id - Update a product
app.put('/api/products/:id', authe, (req, res, next)=> {
  try {
    const id = req.params.id;
    const product = products.find(p=>p.id===id);
    if (!product){
      const err = new NotFound('Product');
      return next(err);
    }
    Object.assign(product, req.body);
    res.json('Successfully updated');
  
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res, next)=>{
  try {
    const id = req.params.id;
    const product = products.find(p=>p.id===id);
    if (!product){
      const err = new NotFound('Product');
      return next(err)
    }
    products = products.filter(p => p.id != id);
    res.json('Product successfully deleted!!!')
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});



//Implement global error handling middleware
const globalErrorHandler = function (err, req, res, next){
  const statusCode = err.statusCode || 500;
  const status = err.status || 'Error';

  console.error('error:', {
    name: err.name,
    message: err.message,
    statusCode,
    stack: err.stack
  })


  if (err.isOperational){
    res.status(statusCode).json({message: err.message});
  }else{
    res.status(500).json({message: 'Internal Server Error'});
    
  }


}

app.use(globalErrorHandler);




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 