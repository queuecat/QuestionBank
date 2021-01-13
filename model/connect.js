const mongoose = require('mongoose');
const config = require('config');
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}?${config.get('db.options')}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log(' \033[42;1m Done \033[0m \033[1m Database connection successful! \033[0m');
}).catch((err) => {
    console.log(' \033[41;1m Error \033[0m \033[0m Database connection failed! \033[0m');
    console.log(err);
})