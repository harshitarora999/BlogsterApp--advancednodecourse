const page = require('puppeteer/lib/Page')

page.prototype.login = async function(){
    const user = await userFactory()
    const {session, sig} = sessionFactory(user)
await this.setCookie({ name: 'session', value: session})
await this.setCookie({ name: 'session.sig', value: sig})
await this.goto('localhost:3000')
await this.waitfor('a[href="/auth/logout"]')
}