const { ObjectId } = require('mongodb');
const db = require('../config/database');

class Author {
  static async checkConnection() {
    return await db.checkConnection();
  }

  static async findAll() {
    const database = await this.checkConnection();
    return await database.collection('authors').find({}).toArray();
  }

  static async findById(id) {
    const database = await this.checkConnection();
    return await database.collection('authors').findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    const database = await this.checkConnection();
    return await database.collection('authors').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async update(id, updateData) {
    const database = await this.checkConnection();
    const result = await database.collection('authors').updateOne(
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
    return await database.collection('authors').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Author;
