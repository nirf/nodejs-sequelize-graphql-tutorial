const Graphql = require('graphql')
const Db = require('./db')
//need to add .then to each resolver to work async(promise)
const Person = new Graphql.GraphQLObjectType({
        name: 'Person',
        description: 'This represents a Person',
        fields: () => {
            return {
                id: {
                    type: Graphql.GraphQLInt,
                    resolve(person) {//resolver here is not mandatory because it knows that on a scallar filed it can return the same type and here is where we can do some bl if we want
                        return person.id
                    }
                },
                firstName: {
                    type: Graphql.GraphQLString,
                    resolve(person) {
                        return person.firstName
                    }
                },
                lastName: {
                    type: Graphql.GraphQLString,
                    resolve(person) {
                        return person.lastName
                    }
                },
                email: {
                    type: Graphql.GraphQLString,
                    resolve(person) {
                        return person.email
                    }
                },
                posts: {
                    type: new Graphql.GraphQLList(Post),
                    resolve(person) {
                        return person.getPosts()
                    }
                }
            }
        }
    }
)

const Post = new Graphql.GraphQLObjectType({
    name: 'Post',
    description: 'This is a Post',
    fields: () => {
        return {
            id: {
                type: Graphql.GraphQLInt,
                name: 'x',
                description: 'y',
                resolve(post) {
                    return post.id
                }
            },
            title: {
                type: Graphql.GraphQLString,
                resolve(post) {
                    return post.title
                }
            },
            content: {
                type: Graphql.GraphQLString,
                resolve(post) {
                    return post.content
                }
            },
            person: {
                type: Person,
                resolve(post) {
                    return post.getPerson()
                }
            }
        }
    }
})

const Query = new Graphql.GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: () => {
        return {
            persons: {
                type: new Graphql.GraphQLList(Person),
                args: {
                    id: {
                        type: Graphql.GraphQLInt
                    },
                    email: {
                        type: Graphql.GraphQLString
                    }
                },
                resolve(root, args) {
                    return Db.Conn.models.person.findAll({where: args})
                        .then((persons) => {
                            return persons
                        });
                }
            },
            posts: {
                type: new Graphql.GraphQLList(Post),
                resolve(root, args) {
                    return Db.Conn.models.post.findAll({where: args});
                }
            }
        }
    }
})
// Graphql.GraphQLInputObjectType - can be used instead of the type person below
const Mutation = new Graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Fuctions to create stuff',
    fields() {
        return {
            addPerson: {
                type: Person,
                args: {
                    firstName: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    },
                    lastName: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    },
                    email: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    }
                },
                resolve(_, args) {
                    return Db.Conn.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    })
                }
            },
            updatePerson: {
                type: Person,
                args: {
                    firstName: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    },
                    lastName: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    },
                    email: {
                        type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)
                    }
                },
                resolve(_, args) {
                    return Db.Conn.models.person.create({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email.toLowerCase()
                    })
                }
            }
        }
    }
})

const Schema = new Graphql.GraphQLSchema({
    query: Query,
    mutation: Mutation
})


module.exports = {
    Schema,
    Mutation
}