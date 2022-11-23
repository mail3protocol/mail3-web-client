const fs = require('fs')
const path = require('path')

const allowAllRobotsTxt = `User-agent: *`

if (process.env.ALLOW_CRAWLERS) {
  const robotsTxtPath = path.relative(process.cwd(),'./public/robots.txt')
  fs.writeFileSync(robotsTxtPath, allowAllRobotsTxt, 'utf8')
}
