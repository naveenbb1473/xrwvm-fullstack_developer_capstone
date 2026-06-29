const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Load JSON data
function loadJSON(filename) {
  const possiblePaths = [
    path.join(__dirname, filename),
    path.join(__dirname, 'data', filename),
    filename
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`Loaded ${filename} from ${p}`);
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  return null;
}

const reviews_data = loadJSON('reviews.json') || { reviews: [] };
const dealerships_data = loadJSON('dealerships.json') || { dealerships: [] };

// Home route
app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose Mock API');
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    res.json(reviews_data.reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch reviews by dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    const documents = reviews_data.reviews.filter(r => r.dealership === dealerId || r.dealership == req.params.id);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    res.json(dealerships_data.dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch dealers by state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const state = req.params.state.toLowerCase();
    const documents = dealerships_data.dealerships.filter(
      d => d.state.toLowerCase() === state || d.st.toLowerCase() === state
    );
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch dealer by ID
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const documents = dealerships_data.dealerships.filter(d => d.id === id || d.id == req.params.id);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Insert review
app.post('/insert_review', bodyParser.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString())
      : req.body;

    const sortedReviews = [...reviews_data.reviews].sort((a, b) => b.id - a.id);
    const new_id = sortedReviews.length > 0 ? sortedReviews[0].id + 1 : 1;

    const review = {
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year
    };

    reviews_data.reviews.push(review);
    
    // Save back to file if possible
    const writePath = path.join(__dirname, 'data', 'reviews.json');
    if (fs.existsSync(writePath)) {
      fs.writeFileSync(writePath, JSON.stringify(reviews_data, null, 2), 'utf8');
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});