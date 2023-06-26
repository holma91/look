const handleNavigationStateChange = (navState: any) => {
  // console.log('NAV CHANGE! navState:', navState);
  // if (!navState.loading && webviewRef.current) {
  //   let match = url.match(/https?:\/\/(?:www\.)?(\w+)\./);
  //   if (match && match[1]) {
  //     let domain = match[1];
  //     setDomain(domain + '.com');
  //     let script = jsScripts[domain];
  //     // Very hacky solution
  //     // in the future, throw away the scripts and write something more robust
  //     setTimeout(() => {
  //       if (webviewRef.current) {
  //         webviewRef.current.injectJavaScript(script.interact);
  //         webviewRef.current.injectJavaScript(script.extract);
  //       }
  //     }, 1000);
  //     setTimeout(() => {
  //       if (webviewRef.current) {
  //         webviewRef.current.injectJavaScript(script.interact);
  //       }
  //     }, 1500);
  //   }
  // }
};
