// test files for writing viewing or doing everything related to blogs after login
const page = require('./helpers/page')
let page
beforeEach(async()=>{
    page = await page.build()
    await page.goto('http://localhost:3000')
})
afterEach(async ()=>{
    await page.close()
})
//
describe('After logged in',()=>{
    beforeEach(async()=>{
        await page.login()
        await page.click('a.btn-floating')
    })
    //
    test('Can see the create blog form', async () =>{
        const label = await page.getContentsof('form label')
        expect(label).toEqual('Blog Title')
    })
    describe('if provided right inputs',async()=>{
        beforeEach(async()=>{
            await page.type('.title input', 'My title')
            await page.type('.content input', 'My blog')
            await page.click('form button')
            await page.waitFor('.card')
        })
        test('Please confirm the entry', async()=>{
            const text = await page.getContentsof('h5')
            expect(text).toEqual('Please confirm you entries')
        })
        test('after submitting the confirmation',async()=>{
            await page.click('button.green')
            const title = await page.getContentsof('.card-title')
            const content = await page.getContentsof('p')
            expect(title).toEqual('My title')
            expect(content).toEqual('My blog')
        })
    })
    describe('if provided wrong inputs',async()=>{
        beforeEach(async()=>{
            await page.click('form button')
        })
        test('Form shows an error message',async()=>{
            const titleError = await page.getContentsof('.title red-text')
            const contentError = await page.getContentsof('.content red-text')
            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })
    })
})
//
describe('When not logged in',async()=>{
    test('No Blog creation',async()=>{
    const result = await page.evaluate(
        ()=>{
            return fetch('/api/blogs',{//this input to be written on to the chrome for execution to check user must login
                method: 'POST',
                credentials: 'same-origin',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title: 'My title', content: 'My blog'})
            }).then(res => res.json())
        })
        expect(result).toEqual({error: 'You must log in!'})
    })
    test('not to get blog list',async()=>{
        const result = page.evaluate(
        ()=>{
            return fetch('/api/blogs',{//to check if user must login to see blogs
                method: 'GET',
                credentials: 'same-origin',
                heaaders:{
                    'Content-Type' : 'application/json'
                }
            }).then(res => res.json())
        })
        expect(result).toEqual({error: 'You must log in!'})
    })
})