require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const Student = require('./models/studentModels')
const app = express();
// const auth = require("./middleware/auth"/);
// const mongoose = require("mongoose");
app.use(express.json());
var bcrypt = require('bcryptjs');

app.get('/getStudent', async(req, res) => {
try {
  const student = await Student.find({})
  return res.status(200).json(student)
} catch (error) {
  console.log(error.message)
  return res.status(500).json({message:error.message})
}
})

app.post('/createStudent',async(req,res)=>{
  try {
    // Get user input
    const { name, email, password} = req.body;
    console.log(name)
    console.log(email);
    console.log(password);
    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await Student.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const student = await Student.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // return new user
    return res.status(201).json(student);
  } catch (err) {
    console.log(err);
  }
})

app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    console.log("post request sent")
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }
    // Validate if user exist in our database
    const student = await Student.findOne({ email });

    if (student && (await bcrypt.compare(password, student.password))) {
      
      return res.status(200).json(student);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
app.put("/updateName", async (req, res) => {
  // Get the ID and update fields from the request body
  try{
    const { id, updateFields } = req.body;
    const ObjectId = require('mongodb').ObjectId;
    // Create an ObjectID instance for MongoDB
    const objectId = new ObjectId(id);

    // Specify the filter (criteria to find the document)
    const filter = { _id: objectId };

    // Specify the update operation (using $set to update specific fields)
    const updateOperation = {
      $set: updateFields,
    };

    // Perform the update operation
    const result = await Student.updateOne(filter, updateOperation);
    console.log("filter",filter)
    console.log("updateOperation",updateOperation)
    console.log("update fields", updateFields)
    console.log("object",objectId)
    console.log(result)
    // Log the result
    console.log(`${result.matchedCount} document(s) matched the filter criteria.`);
    console.log(`${result.modifiedCount} document(s) were modified.`);

    res.status(200).json({ message: 'Update successful' });
  } catch (error) {
  console.error('Error updating data:', error);
  res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {

    // Convert the studentId string to MongoDB ObjectId
    const objectId = new ObjectId(studentId);

    // Delete the student with the specified ID
    const result = await Student.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Student deleted successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;