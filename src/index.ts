async function main(ms: number): Promise<void> {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
}

(async function () {
  await main(2000);
  console.log("Hello voltbras");
})();
