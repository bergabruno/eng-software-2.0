function login() {
  return {
    ok: true,
    nome: 'Cliente FIAP',
  }
}

function logout() {
  return {
    ok: true,
  }
}

module.exports = {
  login,
  logout,
}
