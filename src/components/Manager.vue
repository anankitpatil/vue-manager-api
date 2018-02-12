<template>
<div class="manager">
  <div class="stats">
    Logged in as <a href="#" @click.prevent="logout()">Logout</a>
  </div>

  <div class="modules">
    <a href="#" @click.prevent="loadModule('user')">Users</a>
  </div>
  <div class="values">
    <div v-if="user.isAdmin">
      <div class="filter">
        <input type="text" />
        <input type="button">Export as CSV</input>
      </div>
      <ul>
        <li v-for="_user in users">{{_user.username}}</li>
      </ul>
    </div>
    <div v-else>User data is only accessible by admin.</div>
  </div>
</div>
</template>

<script>
import auth from '../auth'

export default {
  name: 'Manager',
  data() {
    return {
      user: auth.user,
      users: null
    }
  },
  beforeMount() {
    auth.checkAuth()
  },
  mounted() {
    if (auth.user.isAdmin) auth.getAllUsers(this)
    //setTimeout(function() {console.log(auth.users.data)  }, 1000);
  },
  methods: {
    loadModule(moduleName) {
      if (moduleName == 'user') {
        auth.getAllUsers(this)
      }
    },
    logout() {
      auth.logout()
    }
  },
  events: {
    allUsersLoaded: function(users) {
      console.log(users)
    },
  },
  watch: {
    'users': function(value) {
      console.log(value)
    }
  }
}
</script>
