import routes from './routes.js';

const constructorMethod = (app) => {
  app.use('/bars', routes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;