const MySQLController = require('./mysql_controller.js');

(async () => {
    var db_controller = new MySQLController('sampledb');
    db_controller.connect();

    db_controller.insert('Class', {
        NAME: 'KK Systems',
        GRADE: 2,
        CLASS: 3,
        GENDER: 'MALE',
        SUBJECT: 'Math',
        SCORE: 100
    });

    const result = await db_controller.select('Class');
    console.log(result);

    db_controller.disconnect();
})();
