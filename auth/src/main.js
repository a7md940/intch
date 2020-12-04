const bodyParser = require('body-parser');

const { container, setupDi } = require('./di-setup');
const app = require('./app');
const config = require('./config/config');

const bootstrap = async () => {
    await setupDi();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const { signupRouter, authRouter, loginRouter, verificationRouter } = require('./routers');
    app.use('/signup', signupRouter);
    app.use('/signin', loginRouter);
    app.use('/auth', authRouter);
    app.use('/verify', verificationRouter);
    app.get('/health', (req, res) => res.send('Healthe check ok'));

    app.use((err, req, res, next) => {
        console.error(err)
        if (err) {
            return res.status(err.statusCode || 500)
            .send(err);
        }
        return next();
    })
    app.listen(config.port, () => console.log(`App listening on port ${config.port}!`));
};

bootstrap();
