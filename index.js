exports.Validator = Validator;

var stardog = require("stardog");


function Validator() {
    this.conn = new stardog.Connection();
    this.setEndpoint('http://fedorareloaded.com:5822/');
    this.setCredentials('admin', 'admin');
    this.setDatabase('schema');
    this.configureConnection();
}

Validator.prototype.setDatabase = function(database) {
    this.database = database;
}

Validator.prototype.setEndpoint = function(endpoint) {
    this.endpoint = endpoint;
    this.configureConnection;
}

Validator.prototype.setCredentials = function(username, password) {
    this.username = username;
    this.password = password;
    this.configureConnection;
}

Validator.prototype.configureConnection = function() {
    this.conn.setEndpoint(this.endpoint);
    this.conn.setCredentials(this.username, this.password);
}

/*getProperties('CreativeWork', function(err, results){
    console.log(results)
    });
validateProperty('CreativeWork', 'about', function(err,result) {console.log(result);});
validatePropertyType('about', 'Thing');
validatePropertyType('address', 'PostalAddress');
validatePropertyType('address', 'Person'); */


Validator.prototype.checkIsValidTypeInSchema = function(type, cb) {
    // is 'type' a valid type of schema.org?
    // returns true is the type is a type of schema.org
    // false otherwise

    // example usage: 

    // validateProperty('Person', cb(err, results) { console.log(results) });
    // outputs: 'true'

    var query = 'PREFIX schema: <http://schema.org/>   SELECT ?type  {?type rdf:type <http://www.w3.org/2000/01/rdf-schema#Class>}',
        result = false,
        err;

    this.conn.setReasoning('NONE');

    this.conn.query(this.database, query, null, null, 0, function(data) {

        for (var each = 0; each < data.results.bindings.length; each++) {
            if (data.results.bindings[each].type.value == type) {
                result = true;
                break;
            }
        }
        if (cb) cb(err, result);

    });

}

Validator.prototype.checkIsValidPropertyInSchema = function(property, cb) {
    // is 'property' a valid property of schema.org?
    // returns true is the property is a property of schema.org
    // false otherwise

    // example usage:

    // checkIsValidPropertyInSchema('Person', cb(err, results) { console.log(results) });
    // outputs: 'true'

    var query = 'PREFIX schema: <http://schema.org/>   SELECT ?property  {?property rdf:type <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property>}',
        result = false,
        err;

    this.conn.setReasoning('NONE');

    this.conn.query(this.database, query, null, null, 0, function(data) {

        for (var each = 0; each < data.results.bindings.length; each++) {
            if (data.results.bindings[each].property.value == property) {
                result = true;
                break;
            }
        }
        if (cb) cb(err, result);

    });

}

Validator.prototype.getAllProperties = function(cb) {
    var query = 'PREFIX schema: <http://schema.org/> SELECT ?property  {?property rdf:type <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property>}',
        results = [],
        err;

    this.conn.setReasoning('NONE');

    this.conn.query(this.database, query, null, null, 0, function(data) {
        for (var result = 0; result < data.results.bindings.length; result++)
        results.push(data.results.bindings[result].property.value);
        if (cb) cb(err, results);
    });

}

Validator.prototype.getSuperClasses = function(conn, database, type, cb) {

    var query = 'PREFIX schema: <http://schema.org/> SELECT ?superClass {schema:' + type + ' rdfs:subClassOf ?superClass}',
        results = [],
        err;


    conn.setReasoning('RDFS');

    conn.query(database, query, null, null, 0, function(data) {

        for (var result = 0; result < data.results.bindings.length; result++)
        results.push(data.results.bindings[result].superClass.value);
        if (cb) cb(err, results);
    });

}

Validator.prototype.getProperties = function(type, cb) {

    var properties = [],
        error,
        conn = this.conn,
        database = this.database;


    Validator.prototype.getSuperClasses(conn, database, type, function(err, results) {
        get(results, 0);
    });

    function get(results, superClass) {
        var itemtype = "";

        if (superClass < results.length) {

            if (results[superClass].lastIndexOf('/') > results[superClass].lastIndexOf('#')) itemtype = results[superClass].substring(results[superClass].lastIndexOf('/') + 1);
            else itemtype = results[superClass].substring(results[superClass].lastIndexOf('#') + 1);
            // itemtype= results[superClass];

           
            var query = 'PREFIX schema: <http://schema.org/> SELECT ?property  {?property rdfs:isDefinedBy schema:' + itemtype + '.' + '?property rdf:type <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> }';


            conn.setReasoning('RDFS');

            conn.query(database, query, null, null, 0, function(data) {

                for (var result = 0; result < data.results.bindings.length; result++) {
                    properties.push(data.results.bindings[result].property.value);

                    if (result == data.results.bindings.length - 1) {
                        superClass++;
                        get(results, superClass);
                    }
                }

            });

        }
        if (superClass == results.length - 1) cb(error, properties);
    }



}

Validator.prototype.checkIsValidProperty = function(type, property, cb) {
    // is 'property' a valid property of 'type'?
    // returns true is the property is a property of the type
    // false otherwise

    // example usage: 

    // validateProperty('CreativeWork', 'about', cb(err, results) { console.log(results) });
    // outputs: 'true'

    var ourProperty = 'http://schema.org/' + property,
        result = false,
        error,
        conn = this.conn,
        database = this.database;


    Validator.prototype.getSuperClasses(conn, database, type, function(err, results) {
        
        get(results, 0);
    });

    function get(results, superClass) {
        var itemtype = "";
        
        if (superClass < results.length) {

            if (results[superClass].lastIndexOf('/') > results[superClass].lastIndexOf('#')) itemtype = results[superClass].substring(results[superClass].lastIndexOf('/') + 1);
            else itemtype = results[superClass].substring(results[superClass].lastIndexOf('#') + 1);
            // itemtype= results[superClass];

           
            var query = 'PREFIX schema: <http://schema.org/> SELECT ?property  {?property rdfs:isDefinedBy schema:' + itemtype + '.' + '?property rdf:type <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> }';


            conn.setReasoning('RDFS');

            conn.query(database, query, null, null, 0, function(data) {
                
                if (data.results.bindings.length > 0) {

                    for (var each = 0; each < data.results.bindings.length; each++) {
                        if (data.results.bindings[each].property.value == ourProperty) {
                            result = true;

                            cb(error, result);
                            break;
                        }
                        else if (each == data.results.bindings.length - 1) {
                            superClass++;
                            get(results, superClass);
                        }
                    }
                }
                
                else {
                    superClass++;
                    get(results, superClass);
                }

            });

        }
        else if (superClass >= results.length) cb(error, result);
    }


}



Validator.prototype.checkIsExpectedType = function(property, type, cb) {
    
    //is 'property' of type 'type' of an expectedType?

    var ourType = 'http://schema.org/' + type,
        result = false;
        
   
    this.getExpectedTypes(property, function(err, expectedTypes) {
       
        result = (expectedTypes.indexOf(ourType) != -1);
        if (result) {
            console.log('expected type');
        }
        else {
            console.log('not expected type');

        }
        if (cb) cb(err, result);
    });
}

Validator.prototype.getExpectedTypes = function(property, cb) {
    var conn = this.conn,
        database = this.database,
        query = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>' + 'PREFIX schema: <http://schema.org/>' + 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' + 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +

        'SELECT DISTINCT ?type' + '{  { schema:' + property + ' rdfs:range ?type . }' + 'union {' + 'schema:' + property + ' rdfs:range ?union .' + '?union owl:unionOf ?list.' + '?list rdf:rest*/rdf:first ?type .' + '}' +

        'FILTER(!isBlank(?type))' + ' } ',
        results = [],
        err;

    this.conn.setReasoning('NONE');

    conn.query(database, query, null, null, 0, function(data) {

        getExpectedTypes(0);

        function getExpectedTypes(result) {

            if (result < data.results.bindings.length) {
                results.push(data.results.bindings[result].type.value);
                var type = data.results.bindings[result].type.value.substring(data.results.bindings[result].type.value.lastIndexOf("/") + 1);
                var getSubClassesQuery = 'PREFIX schema: <http://schema.org/> SELECT ?type  {?type rdfs:subClassOf schema:' + type + '}';

                conn.query(database, getSubClassesQuery, null, null, 0, function(data2) {

                    if (data2.results.bindings.length === 0) {
                        result++;
                        getExpectedTypes(result);
                    }
                    for (var subresult = 0; subresult < data2.results.bindings.length; subresult++) {
                        
                        results.push(data2.results.bindings[subresult].type.value);
                        if (subresult == data2.results.bindings.length - 1) {
                            result++;
                            getExpectedTypes(result);
                        }
                    }
                });

            }
            else cb(err, results);
        }
    });

}

Validator.prototype.inferRelationship = function(supertype, subtype, cb) {
    // Return an array of possibly relationships between the two types
    // get a list of properties of the supertype
    // get the expected types of those properties
    // see which ones are satisfiable by the subtype
    // push that property to the array

    this.getProperties(supertype, function(err, properties) {
        for (var typeiterator = 0; typeiterator < properties.length; typeiterator++) {
            console.log('nothing yet');
        }
    });
}