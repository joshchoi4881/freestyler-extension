const checkKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-api-key"], (result) => {
      resolve(result["openai-api-key"]);
    });
  });
};

const saveKey = () => {
  const input = document.getElementById("key-input");
  if (input) {
    const { value } = input;
    const valueEncoded = encode(value);
    chrome.storage.local.set({ "openai-api-key": valueEncoded }, () => {
      document.getElementById("key-false").style.display = "none";
      document.getElementById("key-true").style.display = "block";
    });
  }
};

const encode = (input) => {
  return btoa(input);
};

const changeKey = () => {
  document.getElementById("key-false").style.display = "block";
  document.getElementById("key-true").style.display = "none";
};

document.getElementById("save-key-button").addEventListener("click", saveKey);
document
  .getElementById("change-key-button")
  .addEventListener("click", changeKey);
checkKey().then((response) => {
  if (response) {
    document.getElementById("key-false").style.display = "none";
    document.getElementById("key-true").style.display = "block";
  }
});
