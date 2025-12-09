const express = require('express');
const app = express();

const PORT = 3001;

//middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h2> It is calculating... </h2>  
    <script>
       setTimeout(() => {
          window.location.href = "/product?param1=10&param2=12"
       }, 1000); 
    </script>
  `);

})


app.get('/product', (req, res) => {

  const param1 = Number(req.query.param1);
  const param2 = Number(req.query.param2);

  if (isNaN(param1) || isNaN(param2)) {
    return res.status(400).json({
      error: 'Both param1 and param2 must be valid numbers'
    })
  }

  const sum = param1 + param2;
  res.json({
    param1,
    param2,
    sum
  })

})

app.listen(PORT, () => {
  console.log(`Server is runnnin on http://localhost:${PORT}`)
})