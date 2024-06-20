const PendingService = require('../services/pendingService')

PendingService.getDataById(1).then(res => {
    console.log(res);
})