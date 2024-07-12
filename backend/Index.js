const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router/Router');

require('dotenv').config({ path: './secret/.env' });
const operationalStatus = process.env.OPERATIONAL;

if (operationalStatus != 1) {
    console.log('System is under maintenance');
    process.exit(1);
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// !TODO: remove this specific line on release-dev
const cors = require('cors');
app.use(cors());

app.use('/api/v1', router);

// only allow from a certain ip

app.listen(process.env.PORT, () => {
    let manyEndpoints = router.stack.length;
    console.log(`Server has ${manyEndpoints} endpoints, listening on port ${process.env.PORT}`);
    for (let i = 0; i < manyEndpoints; i++) {
        console.log(`Endpoint ${i}: ${router.stack[i].route.path}`);
    }
});




