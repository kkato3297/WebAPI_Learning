const MySQLController = require('./mysql_controller.js');

(async () => {
    var db_controller = new MySQLController('sampledb');
    db_controller.connect();

    const result = await db_controller.search('Class', {
        target: {
            key: 'NAME',
            condition: '=',
            value: 'KK Systems'
        }
    });
    console.log(result);

    db_controller.disconnect();
})();
