var expect = require('expect')
var {generateMessage} = require('./message.js')

describe('generateMessage',() => {
    it('should generate correct message object',() => {
        var from = 'Jen' ;
        var text = 'Hi! I am new here!';
        var obj = generateMessage(from,text)
    })
})