function enableTesting() {
    process.env['TESTING'] = "1"
}

function disableTesting() {
    delete process.env['TESTING']
}

export {
    enableTesting, disableTesting
}