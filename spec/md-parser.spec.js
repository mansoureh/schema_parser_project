var mdparser = require ('./../schemaParser_1'),
    `fs = require('fs');

describe ('Microdata Parser', function () {
    var smallTestFile = 'lib/smallfile.html',
        bigTestFile = 'lib/bigfile.html';

   it('should correctly parse a small file',
   function (done) {
       var html = fsreadSync(smallTestFile, 'utf8');
       mdparser.parseSchemaOrg(html, function (result){
           console.log(result);
           done()
       })

   });

//   it('should correctly parse a large file',
//   function(done) {
//
//   });


});