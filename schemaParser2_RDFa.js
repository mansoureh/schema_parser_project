
/*
 * Default text - Schema parser
 *
 * Author: Mansoureh Targhi
 *
 * Email: [Firstname][Lastname]@gmail.com
 *
 * Copyright (c) 2013 Resopollution
 *
 * Project home:
 *   https://github.com/mansoureh/schema_parser_project
 *
 * Version:  0.1.0
 *
 *
 */
var fs = require("fs"),
    async = require('async'),
    jsdom = require("jsdom"),
    schemaTypeValidation = require('schema.org-type-validator'),
    validator = new schemaTypeValidation.Validator();


var numberOfUrls = fs.readFileSync('./urlsList.txt').toString().split('\n').length,
    urlIndex = 0,
    fileNameCounter = 0;
   

getURLFromFile();

/**
  getURLFromFile function provides a list of urls we want to extract their schema.org markups.

*/
function getURLFromFile() {
    
    if(urlIndex < numberOfUrls ){
    
    //fs.readFileSync('./urlsList.txt').toString().split('\n').forEach(function(line) {
        var line = fs.readFileSync('./urlsList.txt').toString().split('\n')[urlIndex];
        if (line !== "") {
            fileNameCounter++;
            console.log(line);
            parseSchemaOrg(line);
        }
        else {
            urlIndex++;
            getURLFromFile(urlIndex);
        }
    }
}




var schemaArray = [],
    arrayItems = {},
    typeofArray = [];

var currentTypeof = "",
    currentProperty = "",
    currentResource = "", /* "resource" attribute is equivalent to "itemid" attribute in macrodata markup */
    hasVocab = false,
    hasPrefix = false,
    dependentNode = false,
    //nestedInNode = false,
    isOrphanedNode= false,
    rootNode = false,
    isExpectedType = false,
    intelligibleType = false,
    intelligibleProperty = false;


var isTheLastTypeof = false;
var isTheLastProperty = false;


var url = "",
    subject = "",
    node = "";

var blankNodeCounter_b = 0,
    blankNodeCounter_e = 0,
    blankNodeCounter_s = 0,
    blankNodeCounter_o = 0;

var numberOfTypeofInURL ="",
    numberOfPropsInURL="";
    
    
///////////////////////////////////////////////////////////

var prefixNameOfSchema = "",
    typeofIndex = 0,
    propertyIndex = 0;




function parseSchemaOrg(URL) {

    schemaArray = [],
    arrayItems = {},
    typeofArray = [],
    hasVocab = false,
    hasPrefix = false,
    currentTypeof = "",
    currentProperty = "",
    currentResource = "",
    dependentNode = false,
    //nestedInNode = false,
    isOrphanedNode = false,
    rootNode = false,
    isExpectedType = false,
    intelligibleType = false,
    intelligibleProperty = false;


    isTheLastTypeof = false;
    isTheLastProperty = false;


    url = "",
    subject = "",
    node = "";

    blankNodeCounter_b = 0,
    blankNodeCounter_e = 0,
    blankNodeCounter_s = 0,
    blankNodeCounter_o = 0;

    numberOfTypeofInURL = "",
    numberOfPropsInURL = "";
    
    typeofIndex = 0;
    propertyIndex = 0;
   
    //jsdom.env("html.html", ["http://code.jquery.com/jquery.js"],
    jsdom.env(URL, ["http://code.jquery.com/jquery.js"],
    //jsdom.env("http://www.cafepress.com/+obama+gifts", ["http://code.jquery.com/jquery.js"],
    
    

    function(errors, window) {

        if (errors) {
            console.error("# ERROR : " + errors);
            urlIndex++;
            getURLFromFile();
        }
        else {
            var $ = window.$;
            url = URL;



            blankNodeCounter_b = 0,
            blankNodeCounter_e = 0,
            blankNodeCounter_s = 0;
            blankNodeCounter_o = 0;


            numberOfTypeofInURL = $($.find("[typeof]")).length;
            numberOfPropsInURL = $($.find("[property]")).length;

            /** 
         * To parse the url and get all schema.org markup it is necessary to:
            * 1- Get all nodes with typeof attributes in the page.
            * 2- For each one:
            
                    * 2-1: Check if it is schema.org type:
                          * To have schema.org markup in RDFa:
                           * 1- <div vocab = "http://schema.org/" typeof = "Person"> OR <div vocab = "http://schema.org/" >...<div typeof = "Person">...<p property = "name">
                           * 2- <div prefix = "schema: http://schema.org/" typeof = "schema: Person">  OR <div prefix = "schema: http://schema.org/" >...<div typeof = "schema: Person"> ... ...<p property = "schema: name">
                           * 3- <div typeof = "http://schema.org/Person">... <div proerty = "http://schema.org/name">
                    * 2-2: Check if it is 
                                       * 2-2-1: A rootNode (a node with itemtype attr and without property attr which is not situated inside any node With typof attr above):
                                                 * 2-2-1-1: Check if it is intelligible/unintelligible type for schema.org.
                                                 * 2-2-1-2: Check if it is source attribute for the node.
                                             
                                       * 2-2-3: A dependant node (a node with typeof and property attr which is situated in another node with typeof attr above):
                                                 * 2-2-3-1: Check if it is intelligible/unintelligible type for schema.org.
                                                            * 2-2-3-1-1: Intelligible Type: 
                                                                        * 2-2-3-1-1-a: Check if the property is intelligible:
                                                                                        * 2-2-3-1-1-a-1: Check if if the type is an expected/unexpected type for property. 
                                                                                        
                                                                        * 2-2-3-1-1-b: Check if the property is unintelligible.
                                                                        
                                                            * 2-2-3-1-2: Unintelligible Type. 
                                                            
                                                 * 2-2-3-2: Check if it is typeof attribute for the node.
                                                 
                                                 
                                       * 2-2-4: An orphaned/ dependant node (a node with typeof and property attrs which is not situated inside any node With typeof attr above):
                                                * 2-2-4-1: Check if it is intelligible/unintelligible type for schema.org.
                                                         
                                                                        * 2-2-4-1-a: Intelligible Type: 
                                                                        
                                                                                      * 2-2-4-1-a-1: Check if the property is intelligible:
                                                                                                     * 2-2-4-1-a-1-1: Check if if the type is an expected/unexpected type for property. 
                                                                                        
                                                                                      * 2-2-4-1-a-2: Check if the property is unintelligible.
                                                                        
                                                                        * 2-2-4-1-b: Unintelligible Type:
                                                                        
                                                                                      * 2-2-4-1-b-1: Check if the property is intelligible.
                                                                                      * 2-2-4-1-b-2: Check if the property is unintelligible.
                                                                                  
                                                 * 2-2-4-3: Check if it is itemid attribute for the node.
                                                                           
                    * 2-3: Get all properties of current node.                            
                                                 
            * 3- Get Properties:
                    * 3-1: Alone property: A node with property attr without any typeof attr:
                            * 3-1-1: Check if it is intelligible/unintelligible property for schema.org. 
                                     * 3-1-1-1: Intelligible Property:
                                                * 3-1-1-1-1: Check if it is a valid/invalid property for its parent's type.
                                     * 3-1-1-2: Unintelligible Property.
                    * 3-2: Property and Type together: A node with property attr and typeof attr:
                            * 3-2-1: Check if it is intelligible/unintelligible property for schema.org. 
                                     * 3-2-1-1: Intelligible Property:
                                                * 3-1-1-1-1: Check if it is a valid/invalid property for its parent's type.
                                     * 3-2-1-2: Unintelligible Property.
                                    
                    * 3-3: Check if there is at least one property for the parent node with itemtype attr.                
                                    
                                    
             * 4- Get Orphaned Properties: A node with typeof attrs which is not situated inside any node With typeof attr above:
                          * 3-4-1: Check if the property is intelligible.
                          * 3-4-2: Check if the property is unintelligible.
        */

            /** 1- Get all nodes with "typeof" attributes of url: */
            parseNode($);

        }
    });
}

function parseNode($) {
    if (typeofIndex < numberOfTypeofInURL) {
        
        hasVocab = false,
        hasPrefix = false,
        dependentNode = false,
        //nestedInNode = false,
        isOrphanedNode = false,
        rootNode = false,
        isExpectedType = false,
        intelligibleType = false,
        intelligibleProperty = false,
        subject = "",
        node = $.find("[typeof]")[typeofIndex],
        currentTypeof = $(node).attr("typeof"),
        currentResource = $(node).attr("resource"),
        currentProperty = "";
        

         prefixNameOfSchema = "";


         /**
          * To have schema.org markup in RDFa:
          * 1- <div vocab = "http://schema.org/" typeof = "Person"> OR <div vocab = "http://schema.org/" >...<div typeof = "Person">...<p property = "name">
          * 2- <div prefix = "schema: http://schema.org/" typeof = "schema: Person">  OR <div prefix = "schema: http://schema.org/" >...<div typeof = "schema: Person"> ... ...<p property = "schema: name">
          * 3- <div typeof = "http://schema.org/Person">... <div proerty = "http://schema.org/name">
          **/
        
          
         //1- <div vocab = "http://schema.org/" typeof = "Person"> OR <div vocab = "http://schema.org/" >...<div typeof = "Person">...<p property = "name">
         if (($(node).attr("vocab") && $(node).attr("vocab").match("http://schema.org/")) || $($(node).closest('[vocab*= "http://schema.org/"]')).length !== -1) {
           
           //This if means that: this node is directly related to schema.org markup
             if (currentTypeof.match("http://schema.or/") || currentTypeof.indexOf(":") == -1) {

                hasVocab = true;
                hasPrefix = false;
                typeofArray.push(node);
                 //Check the validity of typeof by calling checkTypeof() function:
                checkTypeof($, node, currentTypeof);              
             }

         }
         //2- <div prefix = "schema: http://schema.org/" typeof = "schema: Person">  OR <div prefix = "schema: http://schema.org/" >...<div typeof = "schema: Person"> ... ...<p property = "schema: name">
         else if (($(node).attr("prefix") && $(node).attr("prefix").match("http://schema.org/")) || $($(node).closest('[prefix*= "http://schema.org/"]')).length !== -1) {

             /*
            There is a prefix for schema.org and we
            need to extract the prefix to check the
            match with typeof and property attributes:
            */
             if ($(node).attr("prefix") && $(node).attr("prefix").match("http://schema.org")) getSchemaPrefix($(node).attr("prefix"));
             else if ($($(node).closest('[prefix*= "http://schema.org"]')).length !== -1) getSchemaPrefix($(node).closest('[prefix*= "http://schema.org"]').attr("prefix"));

             if (prefixNameOfSchema !== "" && currentTypeof.match(prefixNameOfSchema)) {
                
                // Getting typeof value without the prefix:
 //  //          var itemtype = $(node).attr("typeof");
                 currentTypeof = currentTypeof.substring(currentTypeof.indexOf(prefixNameOfSchema) + prefixNameOfSchema.length);
                 if (currentTypeof.indexOf(' ') !== -1) currentTypeof = currentTypeof.substring(0, currentTypeof.indexOf(' '));

                hasVocab = false;
                hasPrefix = true;
                typeofArray.push(node);
                //Check the validity of typeof by calling checkTypeof() function:
                checkTypeof($, node, currentTypeof);
                

             }
         }
         
         //3- <div typeof = "http://schema.org/Person">... <div proerty = "http://schema.org/name">         
         else if (currentTypeof.match("http://schema.org/")) {
             
            // Getting typeof value without "http://schema.org/":
            // currentTypeof = currentTypeof.substring(currentTypeof.lastIndexOf('/')+1);
             currentTypeof = currentTypeof.substring(currentTypeof.indexOf("http://schema.org/") + 18);
             if (currentTypeof.indexOf(' ') !== -1) currentTypeof = currentTypeof.substring(0, currentTypeof.indexOf(' '));
            console.log(currentTypeof);
                 
            hasVocab = false;
            hasPrefix = false;
            
            typeofArray.push(node);  
            //Check the validity of typeof by calling checkTypeof() function:
            checkTypeof($, node, currentTypeof); 
         }
         else {
            typeofIndex++;
            parseNode($);
        }
    }
    else {

        isTheLastTypeof = true;
        /** 4- Get Orphaned Properties: 
                
          * IF(there is a tag with "property" attr that does not belong to any schema type) THEN(This will be an orphaned property)
          * 1- <div vocab = "http://schema.org/"> ... <p property = "name">
          * 2- <div prefix = "schema: http://schema.org/"> ... <p property = "schema: name">
          * 3- <p property = "http://schema.org/name">
          */
        getOrphanedProperties($);

    }
    
}


function checkTypeof($, node, currenttypeof){
    
     async.waterfall([
            
            function(cb) {
                /** Check for intelligibility/unintelligibility of typeof*/
                validator.checkIsValidTypeInSchema(currenttypeof, function(err, result) {
                    
                    if (result) {
                        intelligibleType = true;                        
                        cb();
                    }
                    else if (!result) {
                        intelligibleType = false;                       
                        cb();
                    }
                    else if (err) {                        
                        console.log(err);
                    }

                });                
            },
            function(cb) {                
                checkTypeOfNode($, node, currenttypeof, function(currentproperty){
                cb(currentproperty);
                });
            },
            function(currentproperty, cb) {
                buildTriples($, node, currenttypeof, currentproperty);
                cb();
            },
            function(cb) {
                
                if(currentResource)
                    getResourceAttr(currentResource, subject, function() {                       
                       cb(); 
                    });                    
                
            },            
            function(cb) {                
                /**  2-3: Get all properties of current node. */
                getAllProperties($, $(node), subject, intelligibleType, function() {
                    cb();
                });
            },
            
            function(cb) {
                
                typeofIndex++;
                parseNode($);
            },

            ]);
    
}


/** 2-2: Check the type of node: ?(RootNode, Dependent, Orphaned) 
Notice that we do not have rootNode, nestedIn concepts in RDFa schema.org markup since
even if there is a typeof tag without property attr inside another typeof tag, it will 
considered as an independant node not nestedIn node. Example:
 <div typeof="schema:BlogPosting">    
   <div typeof="schema:Person">    
      <div property="schema:name">

Then BlogPosting and Person are two independent nodes. However in follow example:

<div resource="/alice/posts/trouble_with_bob" typeof="schema:BlogPosting">    
   <div property="schema:author"  typeof="schema:Person">    
      <div property="schema:name">
Person is a child of BlogPosting ....      

*/

function checkTypeOfNode($,element, currenttypeof, callback) {
   
        var currentproperty = "";
        if ($(element).attr("property")) 
        {             
             if (hasVocab && $(element).attr("property").indexOf(":") == -1) currentproperty = $(element).attr("property");
               else if (hasPrefix && $(element).attr("property").match(prefixNameOfSchema)) {
                   currentproperty = $(element).attr("property").substring($(element).attr("property").indexOf(prefixNameOfSchema) + prefixNameOfSchema.length);
                   if (currentproperty.indexOf(' ') !== -1) currentproperty = currentproperty.substring(0, currentproperty.indexOf(' '));
               }
               else if (!hasVocab && !hasPrefix && $(element).attr("property").match("http://schema.org/")) {
                   //TO DO: change it to baseschema or sth
                   currentproperty = $(element).attr("property").substring($(element).attr("property").indexOf("http://schema.org/") + 18);
                   if (currentproperty.indexOf(' ') !== -1) currentproperty = currentproperty.substring(0, currentproperty.indexOf(' '));
               }
               //TO DO : check if we need to add currentproperty.indexOf(' ') !== -1
               if (currentproperty !== "" || currentproperty.indexOf(' ') !== -1) /** Dependent form of node */
               {
                   
                 // Check that the current node with property attr does have a parent.
                   var currentNodeParents = $(element).parent("[typeof]");
                   for (var currentNodeParentsIndex in currentNodeParents) {
                       for (var typeofArrayIndex in typeofArray) {
                           if ($(typeofArray[typeofArrayIndex]).is($(currentNodeParents[currentNodeParentsIndex])))
                           {
                               isOrphanedNode = true;
                               break;
                           }
                       }
                   }
               
                   dependentNode = true;
                   async.waterfall([
                   function(cb) {
                       /** Check the intelligibility of current node property :*/
                       validator.checkIsValidPropertyInSchema('http://schema.org/' + currentproperty,

                       function(err, result) {
                           if (result) {
                               intelligibleProperty = true;
                               cb();
                           }
                           else if (!result) {
                               intelligibleProperty = false;
                               cb();
                           }
                           else if (err) {
                               console.log(err);
                           }
                       });
                   },
                   function(cb) {
                       /** Check the expectability of current node typeof for property:(if type and property have been intelligible)*/

                       if (intelligibleType && intelligibleProperty) {
                           validator.checkIsExpectedType(currentproperty, currenttypeof,

                           function(err, result) {
                               if (result) {
                                   isExpectedType = true;
                                   callback(currentproperty);
                               }
                               else if (!result) {
                                   isExpectedType = false;
                                   callback(currentproperty);
                               }
                               else if (err) {
                                   console.log(err);
                               }
                           });
                       }

                   }, ]);
               }
               else {
                   rootNode = true;
                   callback(currentproperty);
               }
        }
        if (!$(element).attr("property")) /** rootNode form of node */
        {            
            rootNode = true;
            callback(currentproperty);           
        }
    
}

function buildTriples($,element, currenttypeof, currentproperty) {

   
    /** 2-2-1-1 */
    if (rootNode && intelligibleType) {
     
        /**
         * <RDFa_bi> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
         * <RDFa_bi> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <typeof>
         */
        subject = "<RDFa_b" + blankNodeCounter_b + ">";
        blankNodeCounter_b++;
        

        arrayItems = {
            subjectForFurtherUse: '',
            node: "",
            subject: subject,
            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
            object: url,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: subject,
            node: $(element),
            subject: subject,
            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
            object: currenttypeof,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);
    }
    else if (rootNode && !intelligibleType) {
        /**
         * <RDFa_bi> <http://www.redhat.com/2013/schema-parser#rootNodeOf> <url>
         * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType> 
         * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
         * <RDFa_bi> <RDFa_ek> <RDFa_bi.k>
         */

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<RDFa_b" + blankNodeCounter_b + ">",
            predicate: "<http://www.redhat.com/2013/schema-parser#rootNodeOf>",
            object: url,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<RDFa_e" + blankNodeCounter_e + ">",
            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        arrayItems = {
            subjectForFurtherUse: '',
            node: '',
            subject: "<RDFa_e" + blankNodeCounter_e + ">",
            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
            object: currenttypeof,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        subject = "<RDFa_b" + blankNodeCounter_b + '.' + blankNodeCounter_e + ">";
        arrayItems = {
            subjectForFurtherUse: subject,
            node: $(element),
            subject: "<RDFa_b" + blankNodeCounter_b + ">",
            predicate: "<RDFa_e" + blankNodeCounter_e + ">",
            object: subject,
            objectForFurtherUse: ''
        };
        schemaArray.push(arrayItems);

        blankNodeCounter_b++;
        blankNodeCounter_e++;

    }

    /** 2-2-3-1 */
    if (dependentNode && !orphanedNode) {
        
       
        /**
         * As we need to find the parent node subject for the relation:
         * We got the closest node with typeof attr which is matched to schema.org:
         */

        for (var j = 0; j < schemaArray.length; j++) {
             if ($(schemaArray[j].node).is($(element)) && schemaArray[j].objectForFurtherUse !== '') {
                subject = schemaArray[j].objectForFurtherUse;
            }
        }

        /** 2-2-3-1-1-a && 2-2-3-1-1-b */
        if ((intelligibleType && intelligibleProperty && isExpectedType) || (intelligibleType && !intelligibleProperty)) {
            /**
             * <RDFa_si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <typeof>
             */
            
            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: currenttypeof,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

        }

        else if (intelligibleType && intelligibleProperty && !isExpectedType) {            
            
            /**
             * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notExpectedType>
             * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
             * <RDFa_si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <RDFa_ek>
             */
            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<RDFa_e" + blankNodeCounter_e + ">",
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<http://www.redhat.com/2013/schema-parser#notExpectedType>",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<RDFa_e" + blankNodeCounter_e + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                object: currenttypeof,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<RDFa_e" + blankNodeCounter_e + ">",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            blankNodeCounter_e++;
        }


        /** 2-2-3-1-2 */

        else if (!intelligibleType) {
            /**
             * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
             * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
             * <RDFa_si>(objectForFurtherUse) <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <RDFa_ek>
             */
            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<RDFa_e" + blankNodeCounter_e + ">",
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: '',
                node: '',
                subject: "<RDFa_e" + blankNodeCounter_e + ">",
                predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                object: currenttypeof,
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            arrayItems = {
                subjectForFurtherUse: subject,
                node: $(element),
                subject: subject,
                predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                object: "<RDFa_e" + blankNodeCounter_e + ">",
                objectForFurtherUse: ''
            };
            schemaArray.push(arrayItems);

            blankNodeCounter_e++;
        }

    }

    /** 2-2-4 */
    if (orphanedNode) {

        /** 2-2-4-1 */
        if (intelligibleType) {
            if (intelligibleProperty && isExpectedType) {
                /**
                 * <RDFa_N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <RDFa_N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <RDFa_N0> <itemprop> <RDFa_s0>
                 * <RDFa_s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <typeof>
                 */

                subject = "<RDFa_s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentproperty+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currenttypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);
                blankNodeCounter_o++;

            }
            else if (intelligibleProperty && !isExpectedType) {

                /**
                 * <RDFa_N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <RDFa_N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <RDFa_N0> <itemprop> <RDFa_s0>
                 * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notExpectedType>
                 * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
                 * <RDFa_s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <RDFa_ek>
                 */

                subject = "<RDFa_s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentproperty+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#notExpectedType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currenttypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<RDFa_e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
            else if (!intelligibleProperty) {

                /**
                 * <RDFa_N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <RDFa_N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property>
                 * <RDFa_N0> <RDFa_ek> <RDFa_sj>
                 * <RDFa_sj> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <typeof>
                 */

                subject = "<RDFa_s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentproperty,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<RDFa_e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: currenttypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
        }
        else if (!intelligibleType) {
            if (intelligibleProperty) {
                /**
                 * <RDFa_N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <RDFa_N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <RDFa_N0> <property> <RDFa_sj>
                 * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
                 * <RDFa_s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <RDFa_ek>
                 */

                subject = "<RDFa_s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://schema.prg/" + currentproperty+">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currenttypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<RDFa_e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;
            }
            else if (!intelligibleProperty) {
                /**
                 * <RDFa_N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                 * <RDFa_N0> <http://rdf.data-vocabulary.org/#url> <url>
                 * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                 * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property>
                 * <RDFa_N0> <RDFa_ek> <RDFa_sj>
                 * <RDFa_ek+1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleType>
                 * <RDFa_ek+1> <http://www.redhat.com/2013/schema-parser#specifiedType> <typeof>
                 * <RDFa_s0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <RDFa_ek+1>
                 */

                subject = "<RDFa_s" + blankNodeCounter_s + ">";
                blankNodeCounter_s++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<http://rdf.data-vocabulary.org/#url>",
                    object: url,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                    object: "http://schema.prg/" + currentproperty,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: "<RDFa_N" + blankNodeCounter_o + ">",
                    predicate: "<RDFa_e" + blankNodeCounter_e + ">",
                    object: subject,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                blankNodeCounter_e++;

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<http://www.redhat.com/2013/schema-parser#unintelligibleType>",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);

                arrayItems = {
                    subjectForFurtherUse: '',
                    node: '',
                    subject: "<RDFa_e" + blankNodeCounter_e + ">",
                    predicate: "<http://www.redhat.com/2013/schema-parser#specifiedType>",
                    object: currenttypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                arrayItems = {
                    subjectForFurtherUse: subject,
                    node: $(element),
                    subject: subject,
                    predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                    object: "<RDFa_e" + blankNodeCounter_e + ">",
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);


                blankNodeCounter_o++;
                blankNodeCounter_e++;

            }
        }
    }
}

function getResourceAttr(currentResource, subject, callback) {
   
    /* Getting the resource attr of tag*/
    var subUrl = url;
    if (url.lastIndexOf("/") === url.length - 1) subUrl = subUrl.substring(0, subUrl.length - 1);
    if (currentResource.indexOf("www") === -1) currentResource = subUrl + currentResource;

    arrayItems = {
        subjectForFurtherUse: '',
        node: "",
        subject: subject,
        predicate: "<http://www.w3.org/2002/07/owl#sameAs>",
        object: currentResource,
        objectForFurtherUse: ''
    };
    schemaArray.push(arrayItems);
    if(callback) callback();
}

/** 3- Get Properties: */
var atLeastOneAcceptableProperty = false,
     currentNodeTypeof = "",
     numberOfPropertiesInCurrentNode = ""; 
     
function getAllProperties($, currentNode, parentSubject, parentItemtypeIntelligibility, callback){      
    
    atLeastOneAcceptableProperty = false,
    currentNodeTypeof = $(currentNode).attr("typeof"),
    numberOfPropertiesInCurrentNode = currentNode.find("[property]").length;
    
    /**
      To find properties of each node, we use "currentNode" and get all nodes with property attribute 
      which are situated inside the "currentNode" and can be considered as a schema.orh property. 
      As we should find the closest node with "typeof" attr which matches our 'currentNode', we use "$(this).parent().closest("[itemtype*='http://schema.org']")".
     **/
     
    getCurrentNodeProperties(0);
    
    function getCurrentNodeProperties(currentNodePropertyIndex){
   
       
      if(currentNodePropertyIndex < numberOfPropertiesInCurrentNode) {

        var intelligibleProperty = false,
            validPropertyForType = false,
            propertyBesideTypeof = false,
            theCurrentNodeIsTheClosestParent = false,
            propertyValue = "",
            object = "",
            propertyNode = $(currentNode).find("[property]")[currentNodePropertyIndex],
            currentProperty = "",
            propertyParents = $(propertyNode).parent("[typeof]");
       
        for(var propertyParentsIndex in propertyParents){
           if(propertyParents[propertyParentsIndex] && propertyParents[propertyParentsIndex].is($(currentNode))){
               theCurrentNodeIsTheClosestParent = true;
               break;
           }
        }
       
        if (theCurrentNodeIsTheClosestParent) {
            
            if (hasVocab && $(propertyNode).attr("property").indexOf(":") == -1) {
                    currentProperty = $(propertyNode).attr("property");
                    if ($(propertyNode).attr("typeof") && $(propertyNode).attr("typeof").indexOf(":") == -1) propertyBesideTypeof = true;                 
                }
               else if (hasPrefix && $(propertyNode).attr("property").match(prefixNameOfSchema)) {
                   currentProperty = $(propertyNode).attr("property").substring($(propertyNode).attr("property").indexOf(prefixNameOfSchema) + prefixNameOfSchema.length);
                   if (currentProperty.indexOf(' ') !== -1) {
                       currentProperty = currentProperty.substring(0, currentProperty.indexOf(' '));
                       if ($(propertyNode).attr("typeof") && $(propertyNode).attr("typeof").match(prefixNameOfSchema)) propertyBesideTypeof = true;                          
                   }
               }
               else if (!hasVocab && !hasPrefix && $(propertyNode).attr("property").match("http://schema.org/")) {
                   //TO DO: change it to baseschema or sth
                   currentProperty = $(propertyNode).attr("property").substring($(propertyNode).attr("property").indexOf("http://schema.org/") + 18);
                   if (currentProperty.indexOf(' ') !== -1) {
                       currentProperty = currentProperty.substring(0, currentProperty.indexOf(' '));
                       if ($(propertyNode).attr("typeof") && $(propertyNode).attr("typeof").match(prefixNameOfSchema)) propertyBesideTypeof = true;                          
                   }
               }
            
            if(currentProperty !== "") {
                
                  async.waterfall([

            function(cb) {
                
                /** Check the intelligibility of current property :*/
                validator.checkIsValidPropertyInSchema('http://schema.org/' + currentProperty,

                function(err, result) {
                    
                    if (result) {
                        intelligibleProperty = true;
                            cb();
                        }
                    else if (!result) {
                        intelligibleProperty = false;
                        cb();
                        }
                    else if (err) {
                        
                        console.log(err);
                    }
                });
                
            },

            function(cb) {
                /**
                  To check that the current property is valid property for the typeof of parent, we need to use "checkIsValidProperty" module.               
                */
                if (parentItemtypeIntelligibility && intelligibleProperty) {
                   
                    // var typeofParent = $(itempropParent).attr("itemtype");
                    // itemtypeOfParent = itemtypeOfParent.substring(itemtypeOfParent.lastIndexOf('/') + 1);
                    var typeofParent = currentTypeof;

                    validator.checkIsValidProperty(typeofParent, currentProperty,

                    function(err, result) {
                        
                        if (result) {
                            validPropertyForType = true;
                            cb();
                        }
                        else if (!result) {
                            validPropertyForType = false;
                            cb();
                        }
                        else if (err) {
                            
                            console.log(err);

                        }
                    });
                }
                else {
                    
                    cb();
                }
            },

            function(cb) {
               
                /** 3-1: Alone property: */
                if (!propertyBesideTypeof) {
                   
                    async.waterfall([

                        function(cb_) {
                            getPropertyValue($, $(propertyNode),
    
                            function(error, result) {
                                if (result) {
                                    propertyValue = result.trim();
                                    
                                    cb_();
                                }
                                else if (error) {
                                    
                                    console.log(error);
                                }
                            });
                        },
                        function(cb_) {
                           
                             if ((parentItemtypeIntelligibility && intelligibleProperty && validPropertyForType) || (!parentItemtypeIntelligibility && intelligibleProperty)) {
                                 /**
                                  * <RDFa_bi> <itemprop> <value>
                                  */

                                 arrayItems = {
                                     subjectForFurtherUse: '',
                                     node: "",
                                     subject: parentSubject,
                                     predicate: "<http://schema.org/" + currentProperty + ">",
                                     object: propertyValue,
                                     objectForFurtherUse: ''
                                 };
                                 schemaArray.push(arrayItems);

                                 atLeastOneAcceptableProperty = true;

                    }
                             else if (parentItemtypeIntelligibility && intelligibleProperty && !validPropertyForType) {
            
                                    /**
                                     * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notValidPropertyForType>
                                     * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property> 
                                     * <RDFa_bi> <RDFa_ek> <value>
                                     */
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<RDFa_e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                                        object: "<http://www.redhat.com/2013/schema-parser#notValidPropertyForType>",
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<RDFa_e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                        object: "http://schema.org/" + currentProperty,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: parentSubject,
                                        predicate: "<RDFa_e" + blankNodeCounter_e + ">",
                                        object: propertyValue,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
            
                                    blankNodeCounter_e++;
            
                                }
                             else if (!intelligibleProperty) {
                                
                                    /**
                                     * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                                     * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property> 
                                     * <RDFa_bi> <RDFa_ek> <value>
                                     */
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<RDFa_e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                                        object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: "<RDFa_e" + blankNodeCounter_e + ">",
                                        predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                                        object: "http://schema.org/" + currentProperty,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                    arrayItems = {
                                        subjectForFurtherUse: '',
                                        node: "",
                                        subject: parentSubject,
                                        predicate: "<RDFa_e" + blankNodeCounter_e + ">",
                                        object: propertyValue,
                                        objectForFurtherUse: ''
                                    };
                                    schemaArray.push(arrayItems);
                                
                                    blankNodeCounter_e++;
                                }   
                             if(cb_) cb();   
                    }
                    
                    
                    ])
                 
                }
                /** 3-2: Property and Type together: */
                else if (propertyBesideTypeof) {
                    
                    if ((parentItemtypeIntelligibility && intelligibleProperty && validPropertyForType) || (!parentItemtypeIntelligibility && intelligibleProperty)) {

                        /**
                         * <RDFa_bi> <itemprop> <sj>
                         */

                        object = "<RDFa_s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(propertyNode),
                            subject: parentSubject,
                            predicate: "<http://schema.org/" + currentProperty+">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    else if (parentItemtypeIntelligibility && intelligibleProperty && !validPropertyForType) {

                        /**
                         * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#notValidPropertyForType>
                         * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property> 
                         * <RDFa_bi> <RDFa_ek> <RDFa_sj>
                         */

                        object = "<RDFa_s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<RDFa_e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                            object: "<http://www.redhat.com/2013/schema-parser#notValidPropertyForType>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<RDFa_e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                            object: "http://schema.org/" + currentProperty,
                            objectForFurtherUse: ''
                        };

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(propertyNode),
                            subject: parentSubject,
                            predicate: "<RDFa_e" + blankNodeCounter_e + ">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    else if (!intelligibleProperty) {

                        /**
                         * <RDFa_ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                         * <RDFa_ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property> 
                         * <RDFa_bi> <RDFa_ek> <RDFa_si>
                         */

                        object = "<RDFa_s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<RDFa_e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ",
                            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<RDFa_e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                            object: "http://schema.org/" + currentProperty,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);

                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: $(propertyNode),
                            subject: parentSubject,
                            predicate: "<e" + blankNodeCounter_e + ">",
                            object: object,
                            objectForFurtherUse: object
                        };
                        schemaArray.push(arrayItems);

                        blankNodeCounter_e++;
                    }
                    cb();
                    
                }
            },
            
            function(cb) {
                
                 currentNodePropertyIndex++;
                 getCurrentNodeProperties(currentNodePropertyIndex);
            }
            
            ]);
            }
            else{
               currentNodePropertyIndex++;
               getCurrentNodeProperties(currentNodePropertyIndex);
            }           
        }
        else {
            currentNodePropertyIndex++;
            getCurrentNodeProperties(currentNodePropertyIndex);
        }
        
      }
      else if (currentNodePropertyIndex >= numberOfPropertiesInCurrentNode) {
                                  
            /** 3-3: Check if there is at least one property for the parent node with itemtype attr. */
            if (!atLeastOneAcceptableProperty) {
                /** 
                 * <bi> <http://www.redhat.com/2013/schema-parser#itemtypeWithoutAnyProperty> <itemtype>
                 */
                arrayItems = {
                    subjectForFurtherUse: '',
                    node: "",
                    subject: parentSubject,
                    predicate: "<http://www.redhat.com/2013/schema-parser#itemtypeWithoutAnyProperty>",
                    //TO DO : check if it is correct.....
                    object: currentTypeof,
                    objectForFurtherUse: ''
                };
                schemaArray.push(arrayItems);
            }
            
            callback();
           
        }          
    
}

}

function getPropertyValue($, propertynode, callback) {

    var result = "",
        error;
    /**
     * When there is a node with property attribute,
     * triples will be :
     * <RDFa_b0> <"http://schema.org/property"> <VALUE>
     * this value can be different based on the type of tag of the node:
     */

    if ($(propertynode)[0].tagName === "TIME") {

        if ($(propertynode).attr("datetime")) result = $(propertynode).attr("datetime");
        else result = $(propertynode).text();
    }
    else if ($(propertynode)[0].tagName === "META") {

        if ($(propertynode).attr("content")) result = $(propertynode).attr("content");
        else result = $(propertynode).text();

    }
    else if ($(propertynode)[0].tagName === "LINK") {

        if ($(propertynode).attr("href")) result = $(propertynode).attr("href");
        else result = $(propertynode).text();
    }
    else if ($(propertynode)[0].tagName === "IMG") {

        if ($(propertynode).attr("src")) {
            result = $(propertynode).attr("src");
        }
        else result = $(propertynode).text();
    }

    else result = $(propertynode).text();


    if (callback) callback(error, result);
}


function getOrphanedProperties($) {
  
    if (propertyIndex < numberOfPropsInURL) {

         var orphanedNode = $.find("[property]")[propertyIndex],
                orphanedProp = $(orphanedNode).attr("property"),
                isOrphanedProp = false,
                propHasParent = false,
                propertyParents = $(orphanedNode).parents("[typeof]");
                
                
        for (var propertyParentsIndex in propertyParents) {
             for (var typeofArrayIndex in typeofArray) {
                   if ($(typeofArray[typeofArrayIndex]).is($(propertyParents[propertyParentsIndex])))
                   {
                       propHasParent = true;
                       break;
                   }
            }
        }
        if(!propHasParent){
            
           
                 if ($($(orphanedNode).closest('[vocab*= "http://schema.org/"]')).length !== -1) {    
                   
                     if (orphanedProp.match("http://schema.or/") || orphanedProp.indexOf(":") == -1) {  
                          isOrphanedProp= true;
                         
                     }                
                 }
                 else if ($($(orphanedNode).closest('[prefix*= "http://schema.org/"]')).length !== -1) {
                     
                     getSchemaPrefix($(orphanedNode).closest('[prefix*= "http://schema.org"]').attr("prefix"));         
                     if (prefixNameOfSchema !== "" && orphanedProp.match(prefixNameOfSchema)) {
                         
                         orphanedProp = orphanedProp.substring(orphanedProp.indexOf(prefixNameOfSchema) + prefixNameOfSchema.length);
                         if (orphanedProp.indexOf(' ') !== -1) orphanedProp = orphanedProp.substring(0, orphanedProp.indexOf(' '));
                         isOrphanedProp= true;
                         
                     }
                 }
                 else if (orphanedProp.match("http://schema.org/")) {
                     
                     orphanedProp = orphanedProp.substring(orphanedProp.indexOf("http://schema.org/") + 18);
                     if (orphanedProp.indexOf(' ') !== -1) orphanedProp = orphanedProp.substring(0, orphanedProp.indexOf(' '));
                     console.log(orphanedProp);
                     isOrphanedProp= true;
                     
                 }
                 
                 
             if(isOrphanedProp)  triplesOfOrphanedProperties($,orphanedNode,orphanedProp); 
             else{
                propertyIndex++;
                getOrphanedProperties($, propertyIndex);
            }

        }
        else{
            propertyIndex++;
            getOrphanedProperties($, propertyIndex);
        }

    }
    else {
       
        isTheLastProperty = true;
        if (isTheLastTypeof && isTheLastProperty) {
            console.log(schemaArray);
            writeInFile();
        }
    }
}
  
function triplesOfOrphanedProperties($,orphanedNode, orphanedProp) {
    
    var isOrphanedPropwithouttypeof = false,
        intelligibleOrphanedProperty = false,
        propValue = "";
        
    if (!$(orphanedNode).attr("typeof") || $(orphanedNode).attr("typeof")) {
       if(!$(orphanedNode).attr("typeof")) isOrphanedPropwithouttypeof = true;
       if ($(orphanedNode).attr("typeof")) {
           for (var typeofArrayIndex in typeofArray) {
               if ($(typeofArray[typeofArrayIndex]).is($(orphanedNode))) {
                   isOrphanedPropwithouttypeof = true;
                   break;
               }
           }
       }
    }
    
    if(isOrphanedPropwithouttypeof){
              async.waterfall([

                function(callback) {
                    /** Check the intelligibility of current node itemprop :*/
                    validator.checkIsValidPropertyInSchema('http://schema.org/' + orphanedProp,

                    function(err, result) {
                        if (result) {
                            intelligibleOrphanedProperty = true;
                            callback();
                        }

                        else if (!result) {
                            intelligibleOrphanedProperty = false;
                            callback();
                        }
                        else if (err) {
                           
                            console.log(err);
                        }
                    });
                },

                function(callback) {

                    getPropertyValue($, $(orphanedNode),

                    function(error, result) {
                        if (result) {
                            propValue = result.trim();
                            callback();
                        }
                        else if (error) {
                            /* TODO: what should be done for this part? */
                            console.log(error);
                        }
                    });

                },

                function(callback) {
                
                    if (intelligibleOrphanedProperty) {
                        /**
                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                         * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                         * <N0> <property> <value>
                         */
            
                        subject = "<s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<http://rdf.data-vocabulary.org/#url>",
                            object: url,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: '',
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<http://schema.org/" + orphanedProp+">",
                            object: propValue,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
            
                        blankNodeCounter_o++;
                    }
                    else if (!intelligibleOrphanedProperty) {
                        /**
                         * <N0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#orphanedProperty>
                         * <N0> <http://rdf.data-vocabulary.org/#url> <url>
                         * <ek> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.redhat.com/2013/schema-parser#unintelligibleProperty>
                         * <ek> <http://www.redhat.com/2013/schema-parser#specifiedProperty> <property> 
                         * <N0> <ek> <value>
                         */
            
                        subject = "<s" + blankNodeCounter_s + ">";
                        blankNodeCounter_s++;
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                            object: "<http://www.redhat.com/2013/schema-parser#orphanedProperty>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<http://rdf.data-vocabulary.org/#url>",
                            object: url,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: '',
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>",
                            object: "<http://www.redhat.com/2013/schema-parser#unintelligibleProperty>",
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: '',
                            subject: "<e" + blankNodeCounter_e + ">",
                            predicate: "<http://www.redhat.com/2013/schema-parser#specifiedProperty>",
                            object: "http://schema.org/" + orphanedProp,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        arrayItems = {
                            subjectForFurtherUse: '',
                            node: "",
                            subject: "<N" + blankNodeCounter_o + ">",
                            predicate: "<e" + blankNodeCounter_e + ">",
                            object: propValue,
                            objectForFurtherUse: ''
                        };
                        schemaArray.push(arrayItems);
            
                        blankNodeCounter_o++;
                        blankNodeCounter_e++;
                    }
                    callback();
                },
                
                function(callback) {
                    
                   propertyIndex++;
                   getOrphanedProperties($); 
                }

                            ]);
        }
    else{
        propertyIndex++;
        getOrphanedProperties($);
    }
}

function getSchemaPrefix(prefix) {
    prefix = prefix.substring(0, prefix.indexOf("schema.org")).trim();
    prefixNameOfSchema = prefix.substring(prefix.lastIndexOf(' ')).trim();
}


function writeInFile() {

    if (schemaArray.length !== 0) {
        var fileName = "./rdfa" + fileNameCounter + ".txt";
        fs.writeFile(fileName, "");

        for (var j = 0; j < schemaArray.length; j++) {

            var item1 = schemaArray[j].subject + "  " + schemaArray[j].predicate + "  " + schemaArray[j].object + "\n";
            fs.appendFileSync(fileName, item1 + "\n");

        }
        console.log("done!");
    }
    
          urlIndex++;
          getURLFromFile();
}



