<template>
<div>
  <h2>Login</h2>
  <p v-if="$route.query.redirect">
    You need to login first.
  </p>
  <form @submit.prevent="submit">
    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    <div>
      <label>Email
        <input v-model="credentials.username" placeholder="Email">
      </label>
    </div>
    <div>
      <label>Password
        <input v-model="credentials.password" placeholder="Password" type="password">
      </label>
    </div>
    <button type="submit">Login</button>
  </form>
</div>
</template>

<script>
import auth from '../auth'

export default {
  name: 'Login',
  data() {
    return {
      user: auth.user,
      credentials: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    submit() {
      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      auth.login(this, credentials, '/manager')
    },
    logout() {
      auth.logout()
    }
  }
}
</script>
