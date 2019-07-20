const MySQLController = require('./mysql_controller.js');

(async () => {
    var db_controller = new MySQLController('sampledb');
    db_controller.connect();

    db_controller.delete('Class', {
        target: {
            key: 'NAME',
            condition: '=',
            value: 'KK Systems'
        }
    });

    const result = await db_controller.select('Class');
    console.log(result);

    db_controller.disconnect();
})();
