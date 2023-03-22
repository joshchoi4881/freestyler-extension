const generateCompletion = async (input) => {
  try {
    sendMessage("generating...");
    const { selectionText } = input;
    const firstPromptPrefix = `
    List 25 words that are associated with a person's lexicon.

    Person:
      `;
    const firstPromptCompletion = await generate(
      `${firstPromptPrefix}${selectionText}`
    );
    const secondPromptPrefix = `
    Write a rap in the style of a person. Incorporate some of the words listed below. The rap must rhyme and have clever wordplay and punchlines. Make sure to include personal details about the person.

    Person: ${selectionText}
    
    Words: ${firstPromptCompletion.text}
  
    Rap:
      `;
    const secondPromptCompletion = await generate(secondPromptPrefix);
    sendMessage(secondPromptCompletion.text);
  } catch (error) {
    console.log(error);
    sendMessage(error.toString());
  }
};

const sendMessage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabActive = tabs[0].id;
    chrome.tabs.sendMessage(
      tabActive,
      { message: "inject", content: message },
      (response) => {
        if (response.status === "failed") {
          console.log("injection failed");
        }
      }
    );
  });
};

const generate = async (input) => {
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.7,
      max_tokens: 1250,
    }),
  });
  const promptCompletion = await res.json();
  return promptCompletion.choices.pop();
};

const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["openai-api-key"], (result) => {
      if (result["openai-api-key"]) {
        const keyDecoded = atob(result["openai-api-key"]);
        resolve(keyDecoded);
      }
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "generate freestyle",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(generateCompletion);
