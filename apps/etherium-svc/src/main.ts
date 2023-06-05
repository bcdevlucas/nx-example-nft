import express from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
const app = express();
import contractAPIRoutes  from './routes/contract-api';
import smartContractAPIRoutes from './routes/smart-contract-api';

const port = 3001;

// app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit:"50mb",
    extended:false,
    parameterLimit:50000
  })
);


// use the routes specified in route folder
app.use("/", contractAPIRoutes);
app.use("/",smartContractAPIRoutes);


app.use(function(err, req,res, next){
  res.status(422).send({error: err.message});
});

//listen to the server
app.listen( port, function(){
  console.log(`Listening to the port ${port} .....`);
});
