import routes from './routes.js';
import { authRoutes } from './auth_routes.js';

const constructorMethod = (app) => {
  app.use('/', routes);
  app.use('/auth', authRoutes)

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;