const MySQLController = require('./mysql_controller.js');

(async () => {
    var db_controller = new MySQLController('sampledb');
    db_controller.connect();

    db_controller.update('Class', {
        target: {
            key: 'NAME',
            condition: '=',
            value: 'KK Systems'
        },
        data: {
            SCORE: 50
        }
    });

    const result = await db_controller.select('Class');
    console.log(result);

    db_controller.disconnect();
})();
