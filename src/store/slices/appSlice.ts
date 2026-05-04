import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { KEYS, getJson, setJson } from '../../utils/storage';
interface AppState {
  hasCompletedOnboarding: boolean;
  bootstrapped: boolean;
  splashDone: boolean;
}

const initialState: AppState = {
  hasCompletedOnboarding: false,
  bootstrapped: false,
  splashDone: false,
};

export const bootstrapApp = createAsyncThunk('app/bootstrap', async () => {
  const onboarding = await getJson<boolean>(KEYS.ONBOARDING);
  return {
    hasCompletedOnboarding: onboarding === true,
  };
});

export const completeOnboarding = createAsyncThunk('app/completeOnboarding', async () => {
  await setJson(KEYS.ONBOARDING, true);
});

export const persistOnboardingReset = createAsyncThunk('app/resetOnboarding', async () => {
  await setJson(KEYS.ONBOARDING, false);
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSplashDone(state, action: PayloadAction<boolean>) {
      state.splashDone = action.payload;
    },
    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.hasCompletedOnboarding = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapApp.fulfilled, (state, action) => {
        state.bootstrapped = true;
        state.hasCompletedOnboarding = action.payload.hasCompletedOnboarding;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.hasCompletedOnboarding = true;
      });
  },
});

export const { setSplashDone, setOnboardingComplete } = appSlice.actions;
export default appSlice.reducer;
