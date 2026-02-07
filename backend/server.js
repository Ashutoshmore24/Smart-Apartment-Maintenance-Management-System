const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/request.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/requests", requestRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
