// TESTING THE APPLICATION SO BY USE OF DIFFERENT METHODS 

// const puppeteer = require('puppeteer')//as to launch  a new browser
// const sessionFactory = require('./factories/sessionfactory')
// const userFactory = require('./factories/userfactory')
const page = require('./helpers/page')
//
let page//so as to use them outside before each also
//
beforeEach(async()=>{//as to make sure as we test again this happens everytime
    // browser = await puppeteer.launch({//launching a new browser by use of puppeteer 
    //     headless: false//as to make sure file runs without headless mode on
    // })
    page = await page.build()
    page = await browser.newPage()
    await page.goto('http://localhost:3000')
})
//
afterEach(async()=>{//so as to make sure to close the browser after closing it
    await page.close()
})
//
test('CHECKING HEADER', async ()=>{
    // const text = await page.$eval('a.brand-logo', el => el.innerHTML)//a tester for an element of the page to be tested out
    const text = await page.getContentsof('a.brand-logo')//to get element of the tab
    expect(text).toEqual('Blogster')//making sure that the header element of the app is having text BLOGSTER
})
//
test('Starting the google oauth Flow', async()=>{
    await page.click('.right a')
    const url = await page.url()
    expect(url).toMatch('/accounts\.google\.com/')
})

test('Shows logout button after signing in', async()=>{
    await page.login()

// we can also provide here a approach here by use of providing a login function 
// under which function we can provide thw below whole login setup as in file >LOGINAPPROACH<

//     const user = await userFactory()
//     const {session, sig} = sessionFactory(user)
// await page.setCookie({ name: 'session', value: session})
// await page.setCookie({ name: 'session.sig', value: sig})
// await page.goto('localhost:3000')
// await page.waitfor('a[href="/auth/logout"]')
//const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
const text = await page.getContentsof('a[href="/auth/logout"]')
expect(text).toEqual('Logout')
})

//puppeteer is taking the function up there and convert it into the text element and send to chromium after that
//chromium send results back this makes process easier as chromium doesnt understands function as defined it 
//the text format