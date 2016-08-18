module.exports = (func) => {
  try {
    func()
  } catch (e) {
    console.warn(e.stack)
  }
}
