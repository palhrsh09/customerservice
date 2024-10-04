const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AgenTRouter = require("./Routes/agents")
const TicketRouter = require("./Routes/tickets")
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(express.json());
const uri = 'mongodb+srv://theharshpal18:harsh123@cluster0.msinb.mongodb.net/customerservice?retryWrites=true&w=majority';
 app.use(bodyParser.json()) 

app.use("/api/agent",AgenTRouter)
app.use("/api/ticket",TicketRouter)

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conncted to Mongo"))
.catch((error) => console.log(error))

app.listen(5000, () => console.log('Server running on port 5000'));