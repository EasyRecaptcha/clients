document.addEventListener("DOMContentLoaded", function () {

  const formBlocks = document.querySelectorAll('[easyRecaptcha="formWrapper"]');
  const serverUrl = "https://hook.us1.make.com/xkqqq79lce3itmn1t5m36vu3pye90yqk";

  formBlocks.forEach((formBlock) => {

    const form = formBlock.querySelector("form");
    const successBlock = formBlock.querySelector('.w-form-done');
    const errorBlock = formBlock.querySelector('.w-form-fail');
    const submitButton = form.querySelector('[type="submit"]');

    const loadingText = formBlock.getAttribute("easyRecaptchaLoadingText") || "Processing...";
    const originalSubmitText = submitButton.value;

    const hideBadge = formBlock.getAttribute("easyRecaptchaBadge") === "hide";
    if (hideBadge) {
      const style = document.createElement("style");
      style.innerHTML = ".grecaptcha-badge { visibility: hidden; }";
      document.head.appendChild(style);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitButton.value = loadingText;
      
      async function postData(url = "", data = {}) {
      try {
        const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        const siteKey = jsonResponse.record.siteKey
        
        async function handleFormSubmission() {
        try {
          const token = await grecaptcha.execute(siteKey, { action: "submit" });

          let serializedData = {};
          new FormData(form).forEach((value, key) => {
            serializedData[key] = value;
          });

          const response = await fetch(serverUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, formData: serializedData }),
          });

          const data = await response.json();

          submitButton.value = originalSubmitText;

          if (data.formResponse && data.formResponse.success) {
            successBlock.style.display = "block";
            errorBlock.style.display = "none";
            form.style.display = "none";
          } else {
            successBlock.style.display = "none";
            errorBlock.style.display = "block";
          }

          console.log(data);

        } catch (error) {
          submitButton.value = originalSubmitText;
          console.error("Error:", error);
        }
      }

      handleFormSubmission();

      } else {
        //throw new Error('Request failed');
	successBlock.style.display = "none";
        errorBlock.style.display = "block";
        submitButton.value = originalSubmitText;
      }
    } catch (error) {
      //console.error("Error:", error.message);
    }
  }
  
  const url = "https://hook.us1.make.com/xkqqq79lce3itmn1t5m36vu3pye90yqk";
  const data = {
    requestType: "Get Site Key"
  };
  
  postData(url, data);

    });
  });
});
