var fs = require("fs");
var schemaTypeValidation = require('schema.org-type-validator');


var validator = new schemaTypeValidation.Validator ();
validator.endpoint = 'http://fedorareloaded.com:5822/';
validator.username = 'admin';
validator.password = 'admin';
validator.database = 'schema';
validator.configureConnection();

//validator.getProperties('LocalBusiness', function (err, properties) {
//    //for (var prop = 0; prop < properties.length; prop ++)
//        console.log(properties);
//});

//validator.checkIsValidTypeInSchema('http://schema.org/Person', 
//    function (err, result) {
//        
//        console.log(result);
//        //console.log(err);
//    }
//);
validator.getExpectedTypes('author', function (err, result) {
   for (var type = 0; type < result.length; type ++)
       console.log(result[type]);
})
//
validator.checkIsExpectedType('author', 'http://schema.org/Organization', 
   function (err, result) {
       console.log(result);
//        var word = ((result) ? 'is' : 'is not');
//        console.log('Place ' + word +
//            ' a valid type for a copyrightHolder');
   }
);

// validator.checkIsValidProperty ('LocalBusiness', 'addreddss', function (err, result) {
//         
//         console.log(result);
//         //console.log(err);
//     }); 

//validator.getAllProperties( 
//    function (err, results) {
//        fs.writeFile("Hello.json", '');
//        for (var j = 0; j < results.length; j++) {
//
//             
//            fs.appendFileSync('Hello.json', "'"+results[j]+"'," + "\n");
//
//        }
//        
//        
//        //console.log(results);
//        //console.log(err);
//    }
//);
////
//validator.checkIsValidPropertyInSchema('http://schema.org/name', 
//    function (err, result) {
//        
//        console.log(result);
//        //console.log(err);
//    }
//);