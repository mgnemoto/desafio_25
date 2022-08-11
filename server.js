const express = require("express");
const session = require("express-session");

const connectMongo= require("connect-mongo");
const MongoStore= connectMongo.create({
  mongoUrl: "mongodb://localhost:27017/session"
});

const app = express();

app.use(
  session({
    store: MongoStore,
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);

// app.get("/con-session", (req, res) => {
//   if (req.session.contador) {
//     req.session.contador++;
//     res.send(`Usted visitó el sitio ${req.session.contador} veces`);
//   } else {
//     req.session.contador = 1;
//     res.send("Bienvenido/a");
//   }
// });



app.get("/logout", (req, res) => {
  const { username } = req.query;
  req.session.destroy((err) => {
    if (!err) res.send(`Hasta luego ${username}`);
    else res.send({ status: "Logout error", body: err });
  });
});

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  if (username !== "pepe" || password !== "pepepass") {
    return res.send("login failed");
  }
  req.session.user = username;
  req.session.admin = true;
  res.send(`Bienvenido ${req.session.user}`);
});

function auth(req, res, next) {
  if (req.session?.user === "pepe" && req.session?.admin) {
    return next();
  }
  return res.status(401).send("error de autorización!");
}

app.get("/privado", auth, (req, res) => {
  res.send("Aqui puedes agregar productos nuevos");
});

app.listen(8080);