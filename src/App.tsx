import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from '@store';
import { AppRouter } from '@router';
import { env } from '@config';
import { authService } from '@shared/services';
import { setUser } from '@store/slices';

function App() {
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      store.dispatch(setUser(user));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
