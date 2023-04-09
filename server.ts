import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();

const corsOptions = {
	origin: 'http://localhost:8080/'
		};
app.use (cors(corsOptions));

// parse requests of content-type - application/json

app.use (bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use (bodyParser.urlencoded({extended:true}));

//simple route
app.get ('/', (_req, res) => {
res.json({message: 'Welcome to PichangApp'});
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log (`Server is running on port $(PORT).` );
});