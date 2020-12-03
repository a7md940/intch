const bodyParser = require('body-parser');

const { container, setupDi } = require('./di-setup');
const app = require('./app');
const config = require('./config/config');
const { excuteHandler: errorHandler } = require('./middlewares');

const bootstrap = async () => {
    await setupDi();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const { signupRoute } = require('./routers/signup');
    app.use('/signup', signupRoute);
    app.use((err, req, res, next) => {
        console.error(err);
    })
    // app.use(errorHandler)
    app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));
};

bootstrap();
