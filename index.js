//#RESTFULL SERVICES
// REST = REPRESENTATIONAL SERVICES TRANSFER
// CRUD OPERATIONS CREATE, READ, UPDATE, DELETE
//# HTTP METHODS 
// GET , POST, PUT, DELETE

const express = require('express');
const app = express();
const Joi = require('joi'); //input validation pakage;name is J as it is class;

app.use(express.json()); //enabling parsing of json object 

app.get('/', (req, res) => {
    res.send('singh');
    //res.end();
})
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.get('/api/courses', (req, res) => {
    res.send(courses);//returning courses id;
});

app.get('/api/courses/:id', (req, res) => {
    //    res.send([2,3,4]);
    // logic to look for the course with the given id
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not found');
    res.send(course);
});

// post function

app.post('/api/courses', (req, res) => {
    //#INPUT VALIDATION(P=1)
    // ALWAYS VALIDATE THE INPUT NEVER TRUST THE USER
    // logic for input validation

    //WORKING OF JOI(P-2)
    // DEFINING SCHEMA

/*    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    //console.log(result); 

    if(result.error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

*/  const { error } = validateCourse(req.body)
    if (error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }
    /*if(!req.body.name || res.body.name.length < 3){
          //400 bad request
          res.status(400).send('name is too short');
          return;
      }
      */
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

//ENVIRONMENT VARIABLE
//since port 3000 may not be avaialble on server where we will deploy our app so we will provide some dynamic variable to it 
// previously
//app.listen(3000, () => console.log('listening at 3000...'));
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to ${port} ...`)); // smart way to add variable to a string


app.get('/api/posts/:months/:years', (req, res) => {
    //res.send(req.params); //to provide arguments as 2/3456;
    res.send(req.query); //to provide arguments as ?sortBy=name;
})

//#HANDLING PUT REQUESTS 
app.put('/api/courses/:id', (req, res) => {
    //we will check if the searched course is there
    //if not existing response 400
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not found');

    //if not present we check the format 
    //if not valid response 400 ie bad request
    //if valid 
    /*const schema = {
        name: Joi.string().min(3).required()
    };
*/
    //const result = Joi.validate(req.body, schema);
    //console.log(result); 
    const { error } = validateCourse(req.body)
    if (error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course 
    course.name = req.body.name;
    //return updated course
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
};

//HANDLING HTTP DELETE REQUESTS
app.delete('/api/courses/:id', (req, res)=>{
    //first check if it exists
    // if no return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given id is not found');


    //if yes delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return delete
    res.send(course);

});