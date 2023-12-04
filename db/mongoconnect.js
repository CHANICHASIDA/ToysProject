
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery' , false);
  console.log("mongo connect started");
     await mongoose.connect('mongodb+srv://chani2172003:ch2172003@cluster0.2v7qs8c.mongodb.net/toysDB');
}