const Student = require('./entity/Student')

const alice = new Student(1, 'Alice', 9)
const bob = new Student(2, 'Bob', 9)

alice.eat('早饭')
alice.goToSchool()

bob.leaveSchool()
bob.sleep()
