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
};

exports.default = function DatabaseAPI(connection) {
    function createGetMethod(query, reducer) {
        return function(callback) {
            connection.query(query, function(e,r) {callback(e, reducer(r))} )
        }
    }
    function identity(n) {return n;}
    return {
        // Create
        // pt {p_id, title, color, img, quantity, loose}
        addPart: function(pt, callback) {
            // How many do we have?
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
                    query += pt.title ? ("'" + pt.title + "', ") : 'NULL,';
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
                    query += set.title ? ("'" + set.title + "', ") : 'NULL,';
                    query += "'" + set.part_count + "',";
                    query += "'" + set.theme + "', ";
                    query += set.img ? ("'" + set.img + "', ") : 'NULL,';
                    query += '1)';
                }
                console.info("[INFO] MySQL << " + query);
                connection.query(query, callback);
            });
        },
        // Read
        getPartsCount: createGetMethod(queries.parts_all_count, function(r) {return r[0]['COUNT(*)']}),
        getParts: createGetMethod(queries.parts_all, identity),
        getSetsCount: createGetMethod(queries.sets_all_count, function(r) {return r[0]['COUNT(*)']}),
        getSets: createGetMethod(queries.sets_all, identity),
        getMocsCount: createGetMethod(queries.mocs_all_count, function(r) {return r[0]['COUNT(*)']}),
        getMocs: createGetMethod(queries.mocs_all, identity),

        // Update
        changePartQuantity: function(pt, qty, callback) {
            const where = 'p_id="' + pt.p_id + '"';
            const query = 'UPDATE parts SET quantity = ' + qty + ', loose = ' + qty + ' WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        },

        // Destroy
        deletePart: function(pt, callback) {
            const where = 'p_id="' + pt.p_id + '"';
            const query = 'DELETE FROM parts WHERE ' + where;
            connection.query(query, callback);
            console.info("[INFO] MySQL << " + query);
        }
    };
};