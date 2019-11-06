const puppeter  = require('puppeteer')
const sessionFactory = require('../factories/sessionfactory')
const userFactory = require('../factories/userfactory')
class CustomPage{
    static async build(){
        const browser =  await puppeter.launch({
            headless: true,
            args: ['--no-sandbox']
        })
        const page = await browser.newPage()
        const customPage = new CustomPage()
        return new Proxy(customPage, {
            get: function(target,property){
                return customPage[property] || browser[property] || page[property]
            }
        })
    }
    constructor(page){//constructor(page,browser)
        this.page = page
        // this.browser = browser//for calling in the close instant of the browser instead of puppeteer page.close
    }
    // close(){
    //     this.browser.close()//to close browser page as by calling it in
    // }
    login(){
        const user = await userFactory()
        const {session, sig} = sessionFactory(user)
    await this.page.setCookie({ name: 'session', value: session})
    await this.page.setCookie({ name: 'session.sig', value: sig})
    await this.page.goto('http://localhost:3000/blogs')
    await this.page.waitfor('a[href="/auth/logout"]')
    }
    async getContentsof(selector){
        return this.page.$eval(selector, el => el.innerHTML)//to select an element from the console tab
    }
}
module.exports() = CustomPage