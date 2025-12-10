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

app.get('/first-vowel', (req, res) => {
    
  const { name2, name } = req.query;
  
  if(!name || typeof name !== 'string') {
    return res.status(400).json({
      error : "Please provide a valid 'name' query parameter"
    })
  } 

  const vowels = 'aeiou';
  let firstVowel;
  for(let char of name) {
    if(vowels.includes(char)) {
       firstVowel = char;
       break;
    }
  }
    
   if(firstVowel == null) {
    return res.status(404).json({
      message : "No vowel is found in the given string"
    }) 
  }

  res.json({
    input : name,
    firstVowel : firstVowel
  })
  
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