function initPromoPopup() {
  console.log("PromoPopup: Script initialized");
  if (localStorage.getItem("promopopup_shown") === "true") {
    console.log("PromoPopup: Already shown in this session. Exiting.");
    return;
  }

  var wrapper = document.getElementById("promopopup-wrapper");
  if (!wrapper) {
    console.log("PromoPopup: Wrapper element not found!");
    return;
  }
  
  var shop = wrapper.getAttribute("data-shop");
  console.log("PromoPopup: Shop domain from liquid:", shop);
  if (!shop) return;

  console.log("PromoPopup: Fetching settings for shop:", shop);
  fetch("/apps/promopopup/api/settings?shop=" + shop)
    .then(function(response) {
      console.log("PromoPopup: Response status:", response.status);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(function(settings) {
      console.log("PromoPopup: Received settings:", settings);
      var plan = settings.currentPlan || "free";
      
      var delayMs = 5000;
      if (plan === "basic" || plan === "pro") {
        delayMs = (settings.delaySeconds || 5) * 1000;
      } else {
        delayMs = 5000; // Free plan must always use 5 second delay
      }

      console.log("PromoPopup: Waiting for " + delayMs + "ms before showing...");
      setTimeout(function() {
        console.log("PromoPopup: Showing popup now!");
        showPopup(settings, plan);
      }, delayMs);
    })
    .catch(function(error) {
      console.error("PromoPopup error during fetch:", error);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPromoPopup);
} else {
  initPromoPopup();
}

function showPopup(settings, plan) {
  var template = settings.selectedTemplate || "minimal";
  var isPro = plan === "pro";
  
  // Template styles
  var tStyles = {
    background: '#FFFFFF', color: '#000000', buttonBg: '#000000', buttonText: '#FFFFFF', radius: '4px', font: 'sans-serif', border: '1px solid #E0E0E0'
  };
  if (template === 'bold') {
    tStyles = { background: '#1A1A1A', color: '#FFFFFF', buttonBg: '#FF4444', buttonText: '#FFFFFF', radius: '4px', font: 'sans-serif', border: 'none' };
  } else if (template === 'elegant') {
    tStyles = { background: '#FDF6F0', color: '#5C4033', buttonBg: '#C49A6C', buttonText: '#FFFFFF', radius: '20px', font: 'Georgia, serif', border: '1px solid #E8D5C4' };
  } else if (template === 'dark') {
    tStyles = { background: '#0D0D0D', color: '#FFFFFF', buttonBg: '#00FF88', buttonText: '#000000', radius: '6px', font: 'monospace', border: '1px solid #00FF88' };
  }

  var bgColor = isPro ? settings.bgColor : tStyles.background;
  var textColor = isPro ? settings.textColor : tStyles.color;
  var buttonColor = isPro ? settings.buttonColor : tStyles.buttonBg;
  var buttonTextColor = isPro ? settings.buttonTextColor : tStyles.buttonText;
  var overlayColor = isPro ? settings.overlayColor : "rgba(0,0,0,0.5)";

  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = overlayColor;
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  var popup = document.createElement("div");
  popup.style.maxWidth = "480px";
  popup.style.width = "90%";
  popup.style.padding = "32px";
  popup.style.backgroundColor = bgColor;
  if (tStyles.border !== "none") popup.style.border = tStyles.border;
  popup.style.borderRadius = tStyles.radius;
  popup.style.fontFamily = tStyles.font;
  popup.style.position = "relative";
  popup.style.boxSizing = "border-box";

  var closeBtn = document.createElement("div");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "15px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.color = textColor;
  closeBtn.style.lineHeight = "1";

  popup.appendChild(closeBtn);

  if (isPro && settings.imageUrl && settings.imageUrl.trim() !== "") {
    var img = document.createElement("img");
    img.src = settings.imageUrl;
    img.style.width = "calc(100% + 64px)";
    img.style.maxHeight = "200px";
    img.style.objectFit = "cover";
    img.style.borderTopLeftRadius = tStyles.radius;
    img.style.borderTopRightRadius = tStyles.radius;
    img.style.marginTop = "-32px";
    img.style.marginLeft = "-32px";
    img.style.marginBottom = "16px";
    img.style.display = "block";
    popup.appendChild(img);
  }

  var headline = document.createElement("div");
  headline.innerText = settings.headline || "";
  headline.style.color = textColor;
  headline.style.fontSize = "22px";
  headline.style.fontWeight = "bold";
  headline.style.marginBottom = "12px";
  popup.appendChild(headline);

  var message = document.createElement("div");
  message.innerText = settings.message || "";
  message.style.color = textColor;
  message.style.fontSize = "15px";
  message.style.marginBottom = "20px";
  popup.appendChild(message);

  var gotItBtn = document.createElement("button");
  gotItBtn.innerText = "Got it!";
  gotItBtn.style.backgroundColor = buttonColor;
  gotItBtn.style.color = buttonTextColor;
  gotItBtn.style.border = "none";
  gotItBtn.style.borderRadius = tStyles.radius;
  gotItBtn.style.padding = "10px 20px";
  gotItBtn.style.cursor = "pointer";
  gotItBtn.style.width = "100%";
  gotItBtn.style.fontSize = "16px";
  gotItBtn.style.fontFamily = "inherit";
  popup.appendChild(gotItBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  function closePopup() {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
    localStorage.setItem("promopopup_shown", "true");
  }

  closeBtn.addEventListener("click", closePopup);
  gotItBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      closePopup();
    }
  });
}
