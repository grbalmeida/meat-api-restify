const users = [
    {name: 'Peter Parker', email: 'peter@marvel'},
    {name: 'Bruce Wayne', email: 'bruce@dc'}
]

export class User {
    static findAll(): Promise<any[]> {
        return Promise.resolve(users)
    }
}