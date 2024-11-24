//create mongoose to connect to mongoDb

const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://nidawaheed506:nidapucit506@namastanode.5e1st.mongodb.net/flicker"
  );
};

module.exports = { connectDb };
