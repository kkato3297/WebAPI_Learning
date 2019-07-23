const MySQLController = require('../mysql_controller.js');

var   db_connection = new MySQLController('sampledb');

const HTTP_STATUS = {
    HTTP_OK:                    200,
    HTTP_CREATED:               201,
    HTTP_NO_CONTENT:            204,
    HTTP_SEE_OTHER:             303,
    HTTP_NOT_MODIFIED:          304,
    HTTP_BAD_REQUEST:           400,
    HTTP_CONFLICT:              409,
    HTTP_INTERNAL_SERVER_ERROR: 500
};

exports.startService = () => {
    db_connection.connect();
};
exports.stopService = () => {
    db_connection.disconnect();
};

exports.select = (req, res, next) => {
    (async () => {
        const result = await db_connection.select(req.params.table);

        res.status(HTTP_STATUS.HTTP_OK);
        res.type('application/json');
        res.send(JSON.stringify(result, null, "  "));
    })();
};
exports.insert = (req, res, next) => {
    (async () => {
        try {
            await db_connection.insert(req.params.table, req.body);
            res.status(HTTP_STATUS.HTTP_CREATED);
        } catch(e) {
            res.status(HTTP_STATUS.HTTP_BAD_REQUEST);
        } finally {
            const result = await db_connection.select(req.params.table);

            res.type('application/json');
            res.send(JSON.stringify(result, null, "  "));
        }
    })();
};
exports.update = (req, res, next) => {
    (async () => {
        try {
            await db_connection.update(req.params.table, {
                target: {
                    key: 'ID',
                    condition: '=',
                    value: req.body.target
                },
                data: req.body.value
            });
            res.status(HTTP_STATUS.HTTP_OK);
        } catch(e) {
            res.status(HTTP_STATUS.HTTP_BAD_REQUEST);
        } finally {
            const result = await db_connection.select(req.params.table);

            res.type('application/json');
            res.send(JSON.stringify(result, null, "  "));
        }
    })();
};
exports.delete = (req, res, next) => {
    (async () => {
        try {
            for (var id_index in req.body) {
                await db_connection.delete(req.params.table, {
                    target: {
                        key: 'ID',
                        condition: '=',
                        value: req.body[id_index]
                    }
                });
            }

            res.status(HTTP_STATUS.HTTP_OK);
        } catch(e) {
            res.status(HTTP_STATUS.HTTP_BAD_REQUEST);
        } finally {
            const result = await db_connection.select(req.params.table);

            res.type('application/json');
            res.send(JSON.stringify(result, null, "  "));
        }
    })();
};

