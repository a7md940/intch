const bodyParser = require('body-parser');
const app = require('./app');
const config = require('./config/config');
const { signupRoute } = require('./routers/signup');
const { errorHandler } = require('./middlewares/error-handler');

const bootstrap = () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/signup', signupRoute);

    app.use(errorHandler)
    app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));
};

bootstrap();
