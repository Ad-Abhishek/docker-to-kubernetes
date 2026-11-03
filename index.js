const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Nepal ✅ from Docker with Nodemon");
});

app.get("/test", (req, res) => {
  res.json({
    message: "This is a test endpoint",
    data: {
      name: "John Doe",
      age: 30,
      email: "husky@XYZ.COM",
    },
  });
});

app.listen(3000, () => {
  console.log("App is running ... on the PORT 3000");
});
