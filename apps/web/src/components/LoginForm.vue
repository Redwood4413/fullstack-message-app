<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { ref } from 'vue'


const schema = toTypedSchema(z.object({
  email: z.email(),
  password: z.string().min(6)
}))

const {} = useForm({
  validationSchema: schema
})

const onSubmit = () => {
  console.log('submit')
}

const quasarConfig = (state) => ({
  props: {
    error: !!state.errors[0],
    'error-message': state.errors[0],
  },
});

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
    <QInput v-model="email"  label="Your E-mail">
      <template v-slot:prepend>
        <QIcon name="mdi-account"></QIcon>
      </template>
    </QInput>
    <QInput v-model="password" type="password" label="Your Password">
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

      <QBtnGroup class="justify-center " flat>
        <QBtn icon="mdi-google" title="Continue with Google"/>
        <QBtn icon="mdi-github" title="Continue with GitHub"/>
        <QBtn icon="mdi-facebook"title="Continue with Facebook" />
        <QBtn icon="fa-brands fa-discord" title="Continue with Discord"/>
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
