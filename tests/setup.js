const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const keys = require('../config/keys');

jest.setTimeout(30000);

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

require('../models/User');