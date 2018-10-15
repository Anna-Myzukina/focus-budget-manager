/*Пакет mongoose нужен здесь для того, чтобы создать модель 
User, средства пакета bcrypt 
будут использованы для хэширования паролей пользователей.
 */

const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');
/*Этот код предназначен для создания схемы данных User. Благодаря этому описанию 
за пользователем нашей системы будут закреплены следующие данные:

Имя пользователя (username).
Пароль (password).
Список клиентов (clients).

В сведения о клиенте будут входить адрес электронной почты (email), имя (name),
 телефон (phone), и финансовые документы (budgets). Финансовый
 документ включает такие данные, как его состояние (state), заголовок (title),
  элементы (items) и цена (price).
 */


const Schema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    clients: [{}]
});

//В этой функции мы генерируем криптографическую соль и хэш для паролей пользователей.
Schema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, (error, salt) => {
      if (error) return next(error);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
          next();
        });
      });
    } else {
      return next();
    }
  });

//добавим функцию, которая будет сравнивать пароли, 
//проверяя правомерность доступа пользователя к системе:

Schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (error, matches) => {
      if (error) return callback(error);
      callback(null, matches);
    });
  };
  
//создадим модель User

mongoose.model('User', Schema);