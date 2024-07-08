class PostgresDBStorage {
  async relationship(model1, relationMethod, model2) {
    await model1[relationMethod](model2)
    return
  }

  async count(model, filter) {
    const quantity = await model.count(filter)

    return quantity
  }

  async find(model, filter) {
    const document = await model.findAll(filter)

    if (!document || !document[0]) return null

    return document
  }

  async findOne(model, filter) {
    const document = await model.findOne(filter)

    if (!document) return null

    return document
  }

  async findById(model, id, filter) {
    const document = await model.findByPk(id, filter)

    if (!document) return null

    return document
  }

  async create(model, data) {
    const document = await model.create(data)

    if (!document) return null

    return document
  }

  async update(model, data, filter) {
    const document = await model.update(data, filter)

    if (!document) return null

    return document
  }

  async delete(model, filter) {
    const document = await model.destroy(filter)

    if (!document) return null

    return document
  }
}

module.exports = PostgresDBStorage
