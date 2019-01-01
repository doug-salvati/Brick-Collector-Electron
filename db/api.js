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
    parts_in_set: function(s_id) { return `SELECT bridge.quantity, parts.p_id, parts.title, parts.color, parts.img FROM bridge INNER JOIN parts ON bridge.p_id=parts.p_id WHERE x_id='${s_id}';` },
    sets_containing_part: function(p_id) { return `SELECT bridge.quantity, sets.s_id, sets.title, sets.theme, sets.img FROM bridge INNER JOIN sets ON bridge.x_id=sets.s_id WHERE p_id='${p_id}';`}
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
        // pt {p_id, title, color, img, quantity, loose}
        addPart: function(pt, callback) {
            // How many do we have?
            // @TODO use ON DUPLICATE KEY
            var where = 'p_id="' + pt.p_id + '" AND color="' + pt.color + '"';
            connection.query('SELECT quantity, loose FROM parts WHERE ' + where, function(e,r) {
                if (r.length) {
                    // if we already have some of this part
                    var query = 'UPDATE parts SET quantity = quantity + ' + pt.quantity + ', ';
                    query += 'loose = loose + ' + pt.loose + ' ';
                    query += 'WHERE p_id="' + pt.p_id +'"';
                } else {
                    // new part
                    var query = 'INSERT INTO parts VALUES ( ';
                    query += "'" + pt.p_id + "', ";
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
        // set {p_id, title, part_count, theme, img, quantity}
        addSet: function(set, callback) {
            // How many do we have?
            var where = 's_id="' + set.s_id + '"';
            connection.query('SELECT quantity FROM sets WHERE ' + where, function(e,r) {
                if (r.length) {
                    // if we already have some of this set
                    var query = 'UPDATE sets SET quantity = quantity + 1, ' + where;
                } else {
                    // new set
                    var query = 'INSERT INTO sets VALUES (';
                    query += "'" + set.s_id + "', ";
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
        addPartsAndBridge: function(set, parts, callback) {
            const bridge = [];
            const adding = parts.map(function(pt) {
                bridge.push(
                    "('" + set.s_id + "', '" + pt.p_id + "', " + pt.quantity + ", 0)"
                );
                return (
                    "('" + pt.p_id + "', "
                        + (pt.title ? ("'" + pt.title.replace(/\'/g,'') + "', ") : 'NULL,')
                        + "'" + pt.color + "', "
                        + (pt.img ? ("'" + pt.img + "', ") : 'NULL,')
                        + pt.quantity + ', 0)'
                );
            });
            // Add parts
            const query1 = 'INSERT INTO parts (p_id, title, color, img, quantity, loose) '
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
            const where = 'p_id="' + pt.p_id + '"';
            const query = 'UPDATE parts SET quantity = quantity + ' + qty + ', loose = loose + ' + qty + ' WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },

        // Destroy
        deletePart: function(pt, callback) {
            const where = 'p_id="' + pt.p_id + '"';
            const query = 'DELETE FROM parts WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },
        deleteSet: function(set, callback) {
            const where = 's_id="' + set.s_id + '"';
            const query = 'DELETE FROM sets WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },
        deletePartsContainedInSetAndCleanBridge: function(set, callback) {
            const where = 'x_id="' + set.s_id + '"';
            const query1 = 'UPDATE parts INNER JOIN bridge ON bridge.p_id=parts.p_id SET parts.quantity = parts.quantity - bridge.quantity WHERE ' + where;
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