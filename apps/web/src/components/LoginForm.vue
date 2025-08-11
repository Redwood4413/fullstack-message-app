<script setup lang="ts">
import { loginSchema } from '@server/validation/user'
import { useRegleSchema } from '@regle/schemas'
import { useFocus } from '@vueuse/core'
import type { QInput, QInputNativeElement } from 'quasar'
import { onMounted, ref, useTemplateRef } from 'vue'

const form = ref({
  email: '',
  password: '',
  isSelected: false,
})

const { r$ } = useRegleSchema(form, loginSchema)

const inputRef = useTemplateRef<QInput>('inputRef')
const input = ref<QInputNativeElement>()

const { focused } = useFocus(input, { initialValue: true })

onMounted(() => {
  input.value = inputRef.value?.getNativeElement()
})
const onSubmit = () => {}
</script>
<template>
  <QForm class="q-pt-xl q-gutter-lg column" @submit.prevent="onSubmit">
    <h1 class="text-weight-thin text-h2">
      Sign in to begin
      <span class="text-bg-clip gradient-primary text-weight-bolder">chatting.</span>
    </h1>
    <BaseSeparator>
      <RouterLink :to="{ name: 'register-form' }" class="text-overline">
        Not a member? <span class="text-bg-clip gradient-secondary">Sign up here</span>
      </RouterLink>
    </BaseSeparator>
    <QInput
      v-model="form.email"
      label="Your E-mail"
      ref="inputRef"
      no-error-icon
      :error="r$.email.$error && !focused"
      name="email"
      bottom-slots
    >
      <template v-slot:prepend>
        <QIcon name="mdi-account"></QIcon>
      </template>
      <template v-slot:error>
        <li v-for="error of r$.email.$errors" :key="error">
          {{ error }}
        </li>
      </template>
      <template #before></template>
      <template #counter></template>
    </QInput>
    <div>
      <QInput
        v-model.trim="form.password"
        type="password"
        name="password"
        ref="passwordRef"
        bottom-slots
        no-error-icon
        :error="r$.password.$error"
        label="Your Password"
      >
        <template v-slot:prepend>
          <QIcon name="mdi-lock"></QIcon>
        </template>
        <template v-slot:error>
          <li v-for="error of r$.password.$errors" :key="error">
            {{ error }}
          </li>
        </template>
      </QInput>
      <RouterLink :to="{ name: 'reset-password' }" class="text-overline float-right"
        >Forgot your password?
        <span class="text-bg-clip gradient-secondary">Reset it</span></RouterLink
      >
    </div>

    <div class="flex justify-between">
      <QCheckbox v-model="form.isSelected" dense label="Remember me" color="secondary"></QCheckbox>
      <QBtn
        label="Sign in"
        color="secondary"
        type="submit"
        no-caps
        icon-right="mdi-login"
        :disabled="r$.$error || !r$.$anyDirty"
      ></QBtn>
    </div>
    <BaseSeparator>
      <span class="text-overline">or continue with</span>
    </BaseSeparator>
    <ContinueWith />
  </QForm>
</template>

<style lang="scss" scoped>
h1 {
  text-wrap: balance;
}
</style>
