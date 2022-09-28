import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header';
import buildClient from '../api/build-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // Way to store paths
  const [prevPaths, setPrevPaths] = useState('/');
  const router = useRouter();
  useEffect(() => storePathValues, [router.asPath]);
  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem('currentPath');
    storage.setItem('prevPath', prevPath);
    setPrevPaths(prevPath);
    // Set the current path value by looking at the browser's location object.
    storage.setItem('currentPath', globalThis.location.pathname);
  }

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component
          currentUser={currentUser}
          prevPath={prevPaths}
          {...pageProps}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
