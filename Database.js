const mongoose = require('mongoose')

class Database {
  constructor() {
    this.connect()
  }

  async connect() {
    try {
      const con = await mongoose.connect(
        'mongodb://localhost:27017/node_blog',
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      )
      console.log(`MongoDB connected: ${con.connection.host}`)
    } catch (err) {
      console.log(err.message)
    }
  }
}
module.exports = new Database()
