<script setup lang="ts">
interface LoginForm {
  email: string
  password: string
}

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { UserSchema } from '@message-app/shared-schemas'

// const schema = toTypedSchema(UserSchema)

// const { defineField,  } = useForm({
// validationSchema: schema
// })

// const [email] = defineField('email')
// const [password] = defineField('password')
// const {} = useForm({
// validationSchema: schema
// })

const onSubmit = () => {
  console.log('submit')
}

// const quasarConfig = (state) => ({
//   props: {
//     error: !!state.errors[0],
//     'error-message': state.errors[0],
//   },
// });
</script>
<template>
  <QForm class="q-pt-xl q-gutter-lg column" @submit.prevent="onSubmit">
    <div class="separator-container">
      <QSeparator spaced="auto" />
      <RouterLink :to="{ name: 'register-form' }" class="text-overline">
        Not a member? <span class="text-bg-clip gradient-secondary">Sign up here</span>
      </RouterLink>
      <QSeparator spaced="auto" />
    </div>
    <QInput v-model.trim="email" label="Your E-mail">
      <template v-slot:prepend>
        <QIcon name="mdi-account"></QIcon>
      </template>
    </QInput>
    <QInput v-model.trim="password" type="password" label="Your Password">
      <template v-slot:prepend>
        <QIcon name="mdi-lock"></QIcon>
      </template>
    </QInput>
    <div class="flex justify-between">
      <QCheckbox
        v-model="isRememberSelected"
        dense
        label="Remember me"
        color="secondary"
      ></QCheckbox>
      <QBtn
        label="Sign in"
        color="secondary"
        type="Login"
        no-caps
        :to="{ name: 'main' }"
        icon-right="mdi-login"
      ></QBtn>
    </div>
    <div class="separator-container">
      <QSeparator spaced="auto" />
      <span class="text-overline">or continue with</span>
      <QSeparator spaced="auto" />
    </div>

    <QBtnGroup class="justify-center" flat>
      <QBtn icon="mdi-google" title="Continue with Google" />
      <QBtn icon="mdi-github" title="Continue with GitHub" />
      <QBtn icon="mdi-facebook" title="Continue with Facebook" />
      <QBtn icon="fa-brands fa-discord" title="Continue with Discord" />
    </QBtnGroup>
  </QForm>
</template>

<style scoped lang="scss">
.separator-container {
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  gap: 1rem;
  padding-inline: 1rem;
}
</style>
