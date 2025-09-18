import { FetchMachine } from '@/machines';
import { client } from '@/services/api/client';
import { AUTH_GET_PROFILE, AUTH_SIGNIN, AUTH_SIGNUP } from '@/services/api/endpoints';
import type { NestErrorResponse } from '@/types/NestErrorResponse';
import type { UserDto } from '@/types/UserDto';
import type { loginSchema, registerSchema } from '@server/validation/user';
import type { AxiosError, AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { ref } from 'vue';
import type z from 'zod';

export default defineStore('user', () => {
  const user = ref<UserDto>();

  const register = async (form: z.input<typeof registerSchema>) =>
    await client.post(AUTH_SIGNUP, form, { withCredentials: true });
  const login = async (form: z.input<typeof loginSchema>) => {
    const loginMachine = new FetchMachine();
    loginMachine.send('FETCH');

    await client
      .post(AUTH_SIGNIN, form, { withCredentials: true })
      .then(async () => {
        loginMachine.send('RESOLVE');
        // router.push({ name: 'main' })
      })
      .catch((error: AxiosError<NestErrorResponse>) => {
        loginMachine.send('REJECT');
        throw error;
      })
      .finally(() => loginMachine.send('RESET'));
    return { state: loginMachine.state };
  };

  const fetchUser = async () => {
    const userFetchMachine = new FetchMachine();
    if (user.value) {
      throw new Error('User already in the store!');
    }
    userFetchMachine.send('FETCH');
    await client
      .get(AUTH_GET_PROFILE, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<UserDto>) => {
        userFetchMachine.send('RESOLVE');
        // console.log(res);
        user.value = res.data;
      })
      .catch((error: AxiosError<NestErrorResponse>) => {
        userFetchMachine.send('REJECT');

        // Notify.create({
        //   message: error.message,
        // });
        return null;
      })
      .finally(() => userFetchMachine.send('RESET'));

    return {
      state: userFetchMachine.state,
    };
  };

  return {
    user,
    fetchUser,
    register,
    login,
  };
});
