const UserService = require('../services/userService')

UserService.getUser("razvanboita16@gmail.com").then(res => {
    console.log(res[0].verifiedEmail);
});
