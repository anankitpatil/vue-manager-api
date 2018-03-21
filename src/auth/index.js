import router from '@/router/index'

var moment = require('moment')

// endpoints
const API_URL = 'http://localhost:9890/'
const LOGIN_URL = API_URL + 'api/login'
const SIGNUP_URL = API_URL + 'api/signup'
const SECURE_URL = API_URL + 'secureApi/user'

export default {
  // Auth user object
  user: {
    authenticated: false,
    isAdmin: false,
    name: ''
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
      // Save id on browser
      localStorage.setItem('id', result.body.data[0].id)
      // Set global user's name
      this.user.name = result.body.data[0].name
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

  checkAuth(context) {
    context.$http.get(SECURE_URL + '/' + localStorage.getItem('id'), {
      headers: {
        "Content-Type": "application/json",
        "Token": localStorage.getItem('token')
      }
    }).then(result => {
      this.user.authenticated = true
      this.user.name = result.body.data[0].name
      if (1 == result.body.data[0].admin.data[0]) {
        // Save admin status locally
        this.user.isAdmin = true
      } else {
        this.user.isAdmin = false
      }
    }, error => {
      console.error(error)
    })
    /*var jwt = localStorage.getItem('token')
    if (jwt) {
      this.user.authenticated = true
      this.user.name = localStorage.getItem('name')
      if (1 == localStorage.getItem('access')) {
        // Save admin status locally
        this.user.isAdmin = true
      } else {
        this.user.isAdmin = false
      }
    } else {
      this.user.authenticated = false
    }*/
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
      // Correct dates
      for(var i = 0; i < result.body.length; i++) {
        result.body[i].created = moment(result.body[i].created).format('D/M/YY h:m');
        console.log(result.body[i].created)
      }
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
