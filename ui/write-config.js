const fs = require('fs')

const json = JSON.stringify({
  // Services / Auth
  REACT_APP_NOPAS_ENDPOINT: process.env.REACT_APP_NOPAS_ENDPOINT,
})

// Purposely created on a sub-directory because dist/ might be readonly
const confDir = 'build/env'

if (!fs.existsSync(confDir)){
  fs.mkdirSync(confDir);
}

fs.writeFileSync(
  `${confDir}/config.js`,
`
window.config = {
  env: ${json}
}
`
)
