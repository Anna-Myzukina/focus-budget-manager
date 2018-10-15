const PassportJWT = require('passport-jwt'),
      ExtractJWT = PassportJWT.ExtractJwt,
      Strategy = PassportJWT.Strategy,
      config = require('./index.js'),
      models = require('@BudgetManager/app/setup');

//создаём экземпляр модели User и находим пользователя, выполняя поиск по JWT-токену, полученному от клиента
module.exports = (passport) => {
      const User= models.User;
      const parameters = {
            secretOrKey: config.secret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      };
      passport.use(new Strategy(parameters, (payload, done) => {
            User.findOne({ id: payload.id }, (error, user) => {
                  if (error) return done(error, false);
                  if (user) done(null, false);
            });
      }));
}