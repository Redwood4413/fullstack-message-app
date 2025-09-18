<script setup lang="ts">
import { loginSchema } from '@server/validation/user';
import { useRegleSchema } from '@regle/schemas';
import { type RegleExternalErrorTree } from '@regle/core';
import { useFocus } from '@vueuse/core';
import { Notify, type QInput, type QInputNativeElement } from 'quasar';
import { onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useUserStore } from '@/stores/';
import type { AxiosError, AxiosResponse } from 'axios';
import type { NestErrorResponse } from '@/types/NestErrorResponse';
import { FetchMachine } from '@/machines';
import router from '@/router';
import type { UserDto } from '@/types/UserDto';
import axios from 'axios';
import type { FetchState } from '@/machines/FetchMachine';

const userStore = useUserStore();
const form = ref({
  email: '',
  password: '',
  isRememberMe: false,
});
const externalErrors = ref<RegleExternalErrorTree<typeof form>>({ email: [], password: [] });
const { r$ } = useRegleSchema(form, loginSchema, {
  externalErrors,
  syncState: {
    onValidate: true,
  },
});
const inputRef = useTemplateRef<QInput>('inputRef');
const input = ref<QInputNativeElement>();

const { focused } = useFocus(input, { initialValue: true });

onMounted(() => {
  input.value = inputRef.value?.getNativeElement();
});

const loginState = shallowRef<FetchState>();
const userFetchState = shallowRef<FetchState>();

const onSubmit = async () => {
  const input = await r$.$validate();
  if (!input.valid) return;
  console.log(input.data);
  try {
    const { state } = await userStore.login(input.data);
    loginState.value = state.value;

    const { state: fetchState } = await userStore.fetchUser();
    userFetchState.value = fetchState.value;
    router.push({ name: 'main' });
  } catch (error) {
    if (!axios.isAxiosError<NestErrorResponse<typeof form>>(error)) return;

    const field = error.response?.data?.cause?.field as keyof typeof externalErrors.value;
    const message = error.response?.data.message;
    if (field && message) externalErrors.value[field]?.push(message);
  }
};
</script>
<template>
  <QForm class="q-pt-xl q-gutter-lg column" @submit.prevent="onSubmit">
    <h1 class="text-weight-thin text-h2">
      Welcome back! Ready to
      <span class="text-bg-clip gradient-primary text-weight-bolder">chat?</span>
    </h1>
    <BaseSeparator>
      <RouterLink :to="{ name: 'register-form' }" class="text-overline">
        Not a member? <span class="text-bg-clip gradient-secondary">Sign up here</span>
      </RouterLink>
    </BaseSeparator>
    <QInput
      v-model.trim="form.email"
      label="Your E-mail"
      ref="inputRef"
      no-error-icon
      autocomplete="email"
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
      <template #hint></template>
    </QInput>
    <div>
      <QInput
        v-model="form.password"
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
      <QCheckbox
        v-model="form.isRememberMe"
        dense
        label="Remember me"
        color="secondary"
      ></QCheckbox>
      <QBtn
        label="Log in"
        :loading="loginState === 'loading'"
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
