document.addEventListener("DOMContentLoaded", () => {
  const basePath = "https://fe.it-academy.by/Examples/words_tree/";
  const rootPath = "root.txt";

  const asyncBlock = document.querySelector(".async_block");
  const thenBlock = document.querySelector(".then_block");

  const asyncButton = document.querySelector(".async_button");
  const thenButton = document.querySelector(".then_button");

  function thenFetch(endpoint, resolve) {
    fetch(basePath + endpoint).then(
      function (response) {
        response.text().then(function (data) {
          try {
            const dataArray = JSON.parse(data);
            let promise = Promise.resolve()
            for (let index = 0; index < dataArray.length; index++) {
              promise = promise.then(function () {
                return new Promise(function (resolve) {
                  thenFetch(dataArray[index], resolve);
                });
              });
              if (index == dataArray.length - 1) {
                promise.then(function () {
                  resolve();
                });
              }
            }
          } catch (error) {
            if (resolve) {
              resolve();
            }
            thenBlock.innerHTML += `${data} `;
          }
        });
      },
      function (error) {
        resolve();
        console.error(`Fetch error - ${error}`)
      }
    );
  }

  const asyncFetch = async (endpoint) => {
    try {
      const response = await fetch(basePath + endpoint);
      if (response.ok) {
        const result = await response.text();
        try {
          const dataArray = JSON.parse(result);
          for (let index = 0; index < dataArray.length; index++) {
            await asyncFetch(dataArray[index]);
          }
        } catch (error) {
          asyncBlock.innerHTML += `${result} `;
        }
      }
    } catch (error) {
      console.error(`Fetch error - ${error}`)
    }
  };

  asyncButton.addEventListener("click", () => asyncFetch(rootPath));
  thenButton.addEventListener("click", () => thenFetch(rootPath));
});
