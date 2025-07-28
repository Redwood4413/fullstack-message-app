<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRegleSchema } from '@regle/schemas'
import { registerSchema } from '@message-app/schemas/zod/user'
import { useFocus } from '@vueuse/core'
import { type QInput, type QInputNativeElement } from 'quasar'

const form = ref({
  email: '',
  name: '',
  passwordForm: {
    password: '',
    confirm: '',
  },
  isSelected: false,
})
const { r$ } = useRegleSchema(form, registerSchema)

const emailRef = useTemplateRef<QInput>('email')
const emailInput = ref<QInputNativeElement>()

const nameRef = useTemplateRef<QInput>('name')
const nameInput = ref<QInputNativeElement>()

const passwordRef = useTemplateRef<QInput>('password')
const passwordInput = ref<QInputNativeElement>()

const confirmRef = useTemplateRef<QInput>('confirm')
const confirmInput = ref<QInputNativeElement>()

const { focused: emailFocus } = useFocus(emailInput, { initialValue: true })
const { focused: nameFocus } = useFocus(nameInput)
const { focused: passwordFocus } = useFocus(passwordInput)
const { focused: confirmFocus } = useFocus(confirmInput)

onMounted(() => {
  emailInput.value = emailRef.value?.getNativeElement()
  nameInput.value = nameRef.value?.getNativeElement()
  passwordInput.value = passwordRef.value?.getNativeElement()
  confirmInput.value = confirmRef.value?.getNativeElement()
})

const onSubmit = () => {}
</script>

<template>
  <QForm class="q-pt-xl q-gutter-lg column" @submit.prevent="onSubmit">
    <h1 class="text-weight-thin text-h2">
      Sign up to begin
      <span class="text-bg-clip gradient-primary text-weight-bolder"> chatting.</span>
    </h1>

    <BaseSeparator>
      <RouterLink :to="{ name: 'login-form' }" class="text-overline">
        Already have an account? <span class="text-bg-clip gradient-secondary">Sign in here</span>
      </RouterLink>
    </BaseSeparator>

    <QInput
      v-model.trim.trim="form.email"
      ref="email"
      label="Your E-mail"
      no-error-icon
      :error="r$.email.$error && !emailFocus"
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
    </QInput>
    <QInput
      v-model.trim="form.name"
      ref="name"
      label="Your name"
      no-error-icon
      :error="r$.name.$error && !nameFocus"
      @blur.prevent=""
      name="name"
      bottom-slots
    >
      <template v-slot:prepend>
        <QIcon name="mdi-account-details"></QIcon>
      </template>
      <template v-slot:error>
        <li v-for="error of r$.name.$errors" :key="error">
          {{ error }}
        </li>
      </template>
    </QInput>
    <div>
      <QInput
        v-model.trim.trim="form.passwordForm.password"
        ref="password"
        type="password"
        name="password"
        bottom-slots
        no-error-icon
        :error="r$.passwordForm.password.$error && !passwordFocus"
        label="Your Password"
      >
        <template v-slot:prepend>
          <QIcon name="mdi-lock"></QIcon>
        </template>
        <template v-slot:error>
          <li v-for="error of r$.passwordForm.password.$errors" :key="error">
            {{ error }}
          </li>
        </template>
      </QInput>
      <QInput
        v-model.trim.trim="form.passwordForm.confirm"
        ref="confirm"
        type="password"
        name="confirm-password"
        bottom-slots
        no-error-icon
        :error="r$.passwordForm.confirm.$error && !confirmFocus"
        label="Repeat password"
      >
        <template v-slot:prepend>
          <QIcon name="mdi-repeat-variant"></QIcon>
        </template>
        <template v-slot:error>
          <li v-for="error of r$.passwordForm.confirm.$errors" :key="error">
            {{ error }}
          </li>
        </template>
      </QInput>
    </div>

    <div class="flex justify-between">
      <QCheckbox
        v-model.trim.trim="form.isSelected"
        dense
        label="Keep logged in"
        color="secondary"
      ></QCheckbox>
      <QBtn
        label="Sign up"
        color="secondary"
        type="submit"
        no-caps
        icon-right="mdi-login"
        :disabled="r$.$error || !r$.$anyDirty"
      ></QBtn>
    </div>
    <BaseSeparator>
      <span class="text-overline"> or continue with </span>
    </BaseSeparator>
    <ContinueWith />
  </QForm>
</template>
