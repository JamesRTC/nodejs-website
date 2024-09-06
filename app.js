const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json())
// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the server side');
// });

// app.post('/', (req, res) => {
//   res.send('Posting to this end-point');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
 const newId = tours[tours.length-1].id + 1
 const newTour = Object.assign({id:newId}, req.body)
 tours.push(newTour)
 fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({
        status: "fail",
        message: "Internal Server Error: Could not save tour.",
      });
    }}
res.status(201).json({
  status: "success",
  data: {
    tour: newTour
  }
})
 })

})

app.listen(3000, () => {
  console.log('listening...');
});