const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const useRoutes = require('./routes/useRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', useRoutes);
console.log('s');
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
