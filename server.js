const express = require("express");

const app = express();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Listening on port dure to changes ${PORT}`);
});
