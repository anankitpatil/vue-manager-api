import router from '@/router/index'

// endpoints
const API_URL = 'http://localhost:9890/'
const LOGIN_URL = API_URL + 'api/login'
const SIGNUP_URL = API_URL + 'api/signup'
const SECURE_URL = API_URL + 'secureApi/user'

export default {
  // Auth user object
  user: {
    authenticated: false,
    isAdmin: false
  },

  login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds, {
      headers: {
        "content-type": "application/json"
      }
    }).then(result => {
      // Save token on browser
      localStorage.setItem('token', result.body.token)
      // Set global auth state
      this.user.authenticated = true
      // Save admin status on browser
      localStorage.setItem('access', result.body.data[0].admin.data[0])
      // Check if admin
      if (1 == result.body.data[0].admin.data[0]) {
        // Save admin status locally
        this.user.isAdmin = true
      } else {
        this.user.isAdmin = false
      }
      // redirect to dashboard
      if (redirect) {
        router.push(redirect)
      }
    }, error => {
      console.error(error)
    })
  },

  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds, {
      headers: {
        "content-type": "application/json"
      }
    }).then(result => {
      // Save token on browser
      localStorage.setItem('token', result.body.token)
      // Set global auth state
      this.user.authenticated = true
    }, error => {
      console.error(error)
    })
  },

  logout() {
    // Remove token from browser
    localStorage.removeItem('token')
    // Set global auth state
    this.user.authenticated = false
    // redirect to login
    router.push('/login')
  },

  checkAuth() {
    var jwt = localStorage.getItem('token')
    if (jwt) {
      this.user.authenticated = true
      if (1 == localStorage.getItem('access')) {
        // Save admin status locally
        this.user.isAdmin = true
      } else {
        this.user.isAdmin = false
      }
    } else {
      this.user.authenticated = false
    }
  },

  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  },

  getAllUsers(context) {
    context.$http.get(SECURE_URL, {
      headers: {
        "Content-Type": "application/json",
        "Token": localStorage.getItem('token')
      }
    }).then(result => {
      // Send users to manager
      context.users = result.body

    }, error => {
      console.error(error)
    })
  },

  getUserById(id) {
    context.$http.get(SECURE_URL + '/' + id, {
      headers: {
        "Content-Type": "application/json",
        "Token": localStorage.getItem('token')
      }
    }).then(result => {


    }, error => {
      console.error(error)
    })
  }
}
