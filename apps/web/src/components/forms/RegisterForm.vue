<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import { useRegleSchema } from '@regle/schemas';
import { useFocus } from '@vueuse/core';
import { Notify, type QInput, type QInputNativeElement } from 'quasar';
import { registerSchema } from '@server/validation/user';
import { FetchMachine } from '@/machines';
import * as z from 'zod';
import { useUserStore } from '@/stores';
import type { RegleExternalErrorTree } from '@regle/core';
import VueTurnstile from 'vue-turnstile';

const form = ref<z.input<typeof registerSchema>>({
  email: '',
  name: '',
  passwordForm: {
    password: '',
    confirm: '',
  },
});
const externalErrors = ref<RegleExternalErrorTree<{ email: string }>>({ email: [] });
const userStore = useUserStore();

const { r$ } = useRegleSchema(form, registerSchema, { externalErrors });

const emailRef = useTemplateRef<QInput>('email');
const emailInput = ref<QInputNativeElement>();

const nameRef = useTemplateRef<QInput>('name');
const nameInput = ref<QInputNativeElement>();

const passwordRef = useTemplateRef<QInput>('password');
const passwordInput = ref<QInputNativeElement>();

const confirmRef = useTemplateRef<QInput>('confirm');
const confirmInput = ref<QInputNativeElement>();

const { focused: emailFocus } = useFocus(emailInput, { initialValue: true });
const { focused: nameFocus } = useFocus(nameInput);
const { focused: passwordFocus } = useFocus(passwordInput);
const { focused: confirmFocus } = useFocus(confirmInput);

onMounted(() => {
  emailInput.value = emailRef.value?.getNativeElement();
  nameInput.value = nameRef.value?.getNativeElement();
  passwordInput.value = passwordRef.value?.getNativeElement();
  confirmInput.value = confirmRef.value?.getNativeElement();
});

const registerMachine = new FetchMachine();
const userFetchMachine = new FetchMachine();

const onSubmit = async () => {
  const input = await r$.$validate();

  if (!input.valid) return;

  registerMachine.send('FETCH');

  await userStore
    .register(input.data)
    .then(() => {
      registerMachine.send('RESOLVE');
      userFetchMachine.send('FETCH');

      userStore
        .fetchUser()
        .then((res) => {
          userFetchMachine.send('RESOLVE');
          // Notify.create({
          //   message: res,
          // })
        })
        .catch((error: AxiosError<NestErrorResponse>) => {
          userFetchMachine.send('REJECT');

          // Notify.create({
          // message: error.response?.data.message,
          // })
        });

      // router.push({ name: 'main' })
    })
    .catch((error: AxiosError<NestErrorResponse<LoginForm>>) => {
      registerMachine.send('REJECT');

      const field = error.response?.data?.cause?.field as keyof typeof externalErrors.value;
      const message = error.response?.data.message;
      if (field && message) externalErrors.value[field]?.push(message);
    })
    .finally(() => registerMachine.send('RESET'));
};
const turnstile = ref();
// <VueTurnstile
//   v-model="turnstile"
//   size="normal"
//   :site-key="'0x4AAAAAABvy2G6H_swwUB41'"
//   @error="(res) => console.log(res)"
// ></VueTurnstile>
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
      v-model.trim="form.email"
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
        v-model.trim="form.passwordForm.password"
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
        v-model.trim="form.passwordForm.confirm"
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
    <div class="flex justify-between items-center">
      <QBtn
        label="Sign up"
        color="secondary"
        type="submit"
        no-caps
        :loading="registerMachine.state.value === 'loading'"
        class="q-ml-auto"
        icon-right="mdi-login"
        :disabled="r$.$error"
      ></QBtn>
    </div>
    <BaseSeparator>
      <span class="text-overline"> or continue with </span>
    </BaseSeparator>
    <ContinueWith />
  </QForm>
</template>
