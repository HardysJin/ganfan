<script>
export default {
  data: () => ({
    form: false,
    name: null,
    policy: true,
    loading: false,
  }),

  methods: {
    async onSubmit() {
      if (!this.form)
        return

      const data = { name: this.name }
      // console.log(data)
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        const result = await response.json()
        // localStorage.setItem('_id', result._id)
        // localStorage.setItem('name', result.name)
        // localStorage.setItem('isAdmin', result.isAdmin)
        globalStore().user._id = result._id
        globalStore().user.name = result.name
        globalStore().user.isAdmin = result.isAdmin
        globalStore().login = result._id === null
      }
      catch (error) {
        // console.error("Error:", error);
      }
    },
    required(v) {
      return !!v || 'Field is required'
    },
  },
}
</script>

<template>
  <v-dialog v-model="globalStore().login" class="bg-purple-lighten-3 pa-12" persistent rounded>
    <v-card class="mx-auto px-6 py-8" max-width="80%">
      <v-card-title class="text-h7">
        <v-icon icon="mdi-pistol" />
        Hands Up!
      </v-card-title>
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="name"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Name"
        />

        <v-checkbox
          v-model="policy"
          :readonly="loading"
          :rules="[required]"
          label="term & policy: 别搞事！"
          color="success"
          value="success"
          density="compact"
          hide-details
        />
        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          block
          color="success"
          size="large"
          type="submit"
          variant="elevated"
        >
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>
