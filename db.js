const Sequelize = require('sequelize')
const _ = require('lodash')
const Faker = require('faker')

const Conn = new Sequelize(
    'myBlog',//db name
    'root',//user name
    'root',//password
    {
        dialect: 'mysql',
        host: 'localhost'
    }
)

const Person = Conn.define('person', {

    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    paranoid: true
})

const Post = Conn.define('post', {

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    paranoid: true
})

//Relationships
Person.hasMany(Post)
Post.belongsTo(Person)

Conn.sync({force: true}).then(() => {
    _.times(10, () => {
        return Person.create({
            firstName: Faker.name.firstName(),
            lastName: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then(person => {
            return person.createPost({
                title: `Sample title by ${person.firstName}`,
                content: 'This is sample article'
            })
        })
    })
})

module.exports = {
    Conn
}