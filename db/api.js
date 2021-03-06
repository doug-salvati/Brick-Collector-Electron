// Brick Collector Database Interface API

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var queries = {
    parts_all_count: 'SELECT COUNT(*) FROM parts',
    parts_all: 'SELECT * FROM parts',
    sets_all_count: 'SELECT COUNT(*) FROM sets',
    sets_all: 'SELECT * FROM sets',
    mocs_all_count: 'SELECT COUNT(*) FROM mocs',
    mocs_all: 'SELECT * FROM mocs',
    parts_in_set: function(id) { return `SELECT bridge.quantity, parts.id, parts.title, parts.color, parts.img FROM bridge INNER JOIN parts ON bridge.p_id=parts.id WHERE x_id='${id}';` },
    sets_containing_part: function(id) { return `SELECT bridge.quantity, sets.id, sets.title, sets.theme, sets.img, sets.quantity as sets_qty FROM bridge INNER JOIN sets ON bridge.x_id=sets.id WHERE p_id='${id}';`}
};

exports.default = function DatabaseAPI(connection) {
    function createGetMethod(query, reducer) {
        return function(callback) {
            connection.query(query, function(e,r) {callback(e, reducer(r))} )
        }
    }
    function createGetMethodWithArg(query, reducer) {
        return function(arg, callback) {
            connection.query(query(arg), function(e,r) {callback(e, reducer(r))} )
        }
    }
    function identity(n) {return n;}
    return {
        // Create
        // pt {id, title, color, img, quantity, loose}
        addPart: function(pt, callback) {
            // How many do we have?
            // TODO use ON DUPLICATE KEY
            var where = 'id="' + pt.id + '" AND color="' + pt.color + '"';
            connection.query('SELECT quantity, loose FROM parts WHERE ' + where, function(e,r) {
                if (r.length) {
                    // if we already have some of this part
                    var query = 'UPDATE parts SET quantity = quantity + ' + pt.quantity + ', ';
                    query += 'loose = loose + ' + pt.loose + ' ';
                    query += 'WHERE id="' + pt.id +'"';
                } else {
                    // new part
                    var query = 'INSERT INTO parts VALUES ( ';
                    query += "'" + pt.id + "', ";
                    query += pt.title ? ("'" + pt.title.replace(/\'/g,'') + "', ") : 'NULL,';
                    query += "'" + pt.color + "', ";
                    query += pt.img ? ("'" + pt.img + "', ") : 'NULL,';
                    query += pt.quantity + ', ';
                    query += pt.loose ? pt.loose : 'NULL';
                    query += ' )';
                }
                console.info("[INFO] MySQL << " + query);
                connection.query(query, callback);
            });
        },
        // set {id, title, part_count, theme, img, quantity}
        addSet: function(set, callback) {
            // How many do we have?
            var where = 'id="' + set.id + '"';
            connection.query('SELECT quantity FROM sets WHERE ' + where, function(e,r) {
                if (r.length) {
                    // if we already have some of this set
                    var query = 'UPDATE sets SET quantity = quantity + 1, ' + where;
                } else {
                    // new set
                    var query = 'INSERT INTO sets VALUES (';
                    query += "'" + set.id + "', ";
                    query += set.title ? ("'" + set.title.replace(/\'/g,'') + "', ") : 'NULL,';
                    query += "'" + set.part_count + "',";
                    query += "'" + set.theme.replace(/\'/g,'') + "', ";
                    query += set.img ? ("'" + set.img + "', ") : 'NULL,';
                    query += '1)';
                }
                console.info("[INFO] MySQL << " + query);
                connection.query(query, callback);
            });
        },
        addParts: function(parts, callback) {
            const adding = parts.map(function(pt) {
                return (
                    "('" + pt.id + "', "
                        + (pt.title ? ("'" + pt.title.replace(/\'/g,'') + "', ") : 'NULL,')
                        + "'" + pt.color + "', "
                        + (pt.img ? ("'" + pt.img + "', ") : 'NULL,')
                        + pt.quantity + ', ' + pt.quantity + ')'
                );
            });
            const query = 'INSERT INTO parts (id, title, color, img, quantity, loose) '
                + 'VALUES ' + adding + ' '
                + 'ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), loose = loose + VALUES(loose)';
            console.info("[INFO] MySQL << " + query);
            connection.query(query, callback);
        },
        addPartsAndBridge: function(set, parts, callback) {
            const bridge = [];
            const adding = parts.map(function(pt) {
                bridge.push(
                    "('" + set.id + "', '" + pt.id + "', " + pt.quantity + ", 0)"
                );
                return (
                    "('" + pt.id + "', "
                        + (pt.title ? ("'" + pt.title.replace(/\'/g,'') + "', ") : 'NULL,')
                        + "'" + pt.color + "', "
                        + (pt.img ? ("'" + pt.img + "', ") : 'NULL,')
                        + pt.quantity + ', 0)'
                );
            });
            // Add parts
            const query1 = 'INSERT INTO parts (id, title, color, img, quantity, loose) '
                + 'VALUES ' + adding + ' '
                + 'ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)';
            console.info("[INFO] MySQL << " + query1);
            connection.query(query1, function() {
                // Bridge
                const query2 = 'INSERT INTO bridge VALUES ' + bridge;
                console.info("[INFO] Bridging: MySQL << " + query2);
                connection.query(query2, callback);
            })
            
        },
        // Read
        getPartsCount: createGetMethod(queries.parts_all_count, function(r) {return r[0]['COUNT(*)']}),
        getParts: createGetMethod(queries.parts_all, identity),
        getPartsInSet: createGetMethodWithArg(queries.parts_in_set, identity),
        getSetsContainingPart: createGetMethodWithArg(queries.sets_containing_part, identity),
        getSetsCount: createGetMethod(queries.sets_all_count, function(r) {return r[0]['COUNT(*)']}),
        getSets: createGetMethod(queries.sets_all, identity),
        getMocsCount: createGetMethod(queries.mocs_all_count, function(r) {return r[0]['COUNT(*)']}),
        getMocs: createGetMethod(queries.mocs_all, identity),

        // Update
        changePartQuantity: function(pt, qty, callback) {
            const where = 'id="' + pt.id + '"';
            const query = 'UPDATE parts SET quantity = quantity + ' + qty + ', loose = loose + ' + qty + ' WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },
        changeSetQuantity: function(set, qty, callback) {
            const where1 = 'id="' + set.id + '"';
            const query1 = 'UPDATE sets SET quantity = quantity + ' + qty + ' WHERE ' + where1;
            console.info("[INFO] MySQL << " + query1);
            connection.query(query1, function() {
                const where2 = 'x_id="' + set.id + '"';
                const query2 = 'UPDATE parts INNER JOIN bridge ON bridge.p_id=parts.id SET parts.quantity = parts.quantity + ' + qty + ' * bridge.quantity WHERE ' + where2;
                console.info("[INFO] MySQL << " + query2);
                connection.query(query2, callback);
            });
        },

        // Destroy
        deletePart: function(pt, callback) {
            const where = 'id="' + pt.id + '"';
            const query = 'DELETE FROM parts WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },
        deleteSet: function(set, callback) {
            const where = 'id="' + set.id + '"';
            const query = 'DELETE FROM sets WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },
        deletePartsContainedInSetAndCleanBridge: function(set, callback) {
            const where = 'x_id="' + set.id + '"';
            const query1 = 'UPDATE parts INNER JOIN bridge ON bridge.p_id=parts.id SET parts.quantity = parts.quantity - (bridge.quantity * ' + set.quantity + ') WHERE ' + where;
            connection.query(query1, function() {
                const query2 = 'DELETE FROM bridge WHERE ' + where;
                connection.query(query2, function() {
                    const query3 = 'DELETE FROM parts WHERE quantity = 0';
                    connection.query(query3, callback);
                    console.info("[INFO] MySQL << " + query3);
                });
                console.info("[INFO] MySQL << " + query2);
            });
            console.info("[INFO] MySQL << " + query1);
        }
    };
};