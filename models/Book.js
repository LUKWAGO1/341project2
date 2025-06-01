const { ObjectId } = require('mongodb');
const db = require('../config/database');

class Book {
  static async checkConnection() {
    return await db.checkConnection();
  }

  static async findAll() {
    const database = await this.checkConnection();
    return await database.collection('books').find({}).toArray();
  }

  static async findById(id) {
    const database = await this.checkConnection();
    return await database.collection('books').findOne({ _id: new ObjectId(id) });
  }

  static async create(bookData) {
    const database = await this.checkConnection();
    const result = await database.collection('books').insertOne({
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.ops[0];
  }

  static async update(id, updateData) {
    const database = await this.checkConnection();
    const result = await database.collection('books').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );
    return result;
  }

  static async delete(id) {
    const database = await this.checkConnection();
    return await database.collection('books').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Book;
