const UserService = require('../services/userService')
UserService.getNameById(13).then(res => {
    console.log(res);
})