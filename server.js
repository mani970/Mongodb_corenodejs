const fs = require("fs"); // in built module in node js // common js
const { createServer } = require("http"); // in built module in nodejs // common js
const { connect } = require("mongodb").MongoClient; // third party module of database
const { parse } = require("querystring"); // in built module in node js //common js

//database URL
let MONGODB_CLOUD_URL =
  "mongodb+srv://mani:mani1234@cluster0.alni1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let MONGODB_LOCAL_URL = "mongodb://localhost:27017/";

function connectDatabase(request, callback) {
  let body = "";
  request.on("data", (chuck) => {
    body += chuck.toString();
  });
  request.on("end", (_) => {
    callback(parse(body));
  });
}
// database connection to nodejs driver starts here
const server = createServer((req, res) => {
  if (req.method === "POST") {
    connectDatabase(req, (result) => {
      console.log(result);
      connect(
        MONGODB_CLOUD_URL,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        (err, db) => {
          if (err) throw err;
          //create collection
          let database = db.db("User"); // database name
          database.collection("UserInfo", (err, info) => {
            if (err) throw err;
            info.insertMany([result], (err, data) => {
              if (err) throw err;
              console.log("succesfully User data created", data);
            });
          });
        }
      );
    });
    //database connection to nodejs driver ends here
    res.end("successfully db created");
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/index.html", "utf8").pipe(res); // connecting html file to node js
  }
});

server.listen(2709, (err) => {
  // creating port number
  if (err) throw err;
  console.log("Server is running on port number 2709");
});
