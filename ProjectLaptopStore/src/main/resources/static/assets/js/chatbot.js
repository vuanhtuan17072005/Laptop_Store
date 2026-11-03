const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbotBtn = document.querySelector("#close-chatbot");
const initialInputHeight = messageInput.scrollHeight;
// API setup
const API_KEY = "sk-or-v1-xxxxxxxx";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

// Biến lưu dữ liệu training và lịch sử trò chuyện
let trainingData = [];
let conversationHistory = [];

// Lắng nghe message từ trang chủ
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRAINING_DATA") {
    trainingData = event.data.data;
    console.log("✅ Đã nhận dữ liệu training:", trainingData);
    if (document.body.classList.contains("show-chatbot")) {
      showWelcomeMessage();
    }
  }
});

// Hiển thị tin nhắn chào với câu hỏi gợi ý
const showWelcomeMessage = () => {
  if (trainingData.length === 0) return;

  const welcomePrompt = `
      Bạn là chatbot tư vấn laptop.
      Luôn trả lời bằng tiếng Việt.
      Hãy trả lời đúng đúng 1 câu:
      Xin chào 👋 Tôi có thể tư vấn laptop cho bạn.
      `;

  const messageContent = `<svg
            class="bot-avatar"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4 .7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
            ></path>
          </svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
  const welcomeMessageDiv = createMessageElement(
    messageContent,
    "bot-message",
    "thinking"
  );
  chatBody.appendChild(welcomeMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:8080",
      "X-Title": "LaptopStore"
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: welcomePrompt
        }
      ]
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) throw new Error(data.error.message);
      const apiResponseText = data.choices[0].message.content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      welcomeMessageDiv.querySelector(".message-text").textContent =
        apiResponseText;
      conversationHistory.push({ role: "bot", content: apiResponseText });
    })
    .catch((error) => {
      console.log(error);
      welcomeMessageDiv.querySelector(".message-text").textContent =
        error.message;
      welcomeMessageDiv.querySelector(".message-text").style.color = "#ff0000";
    })
    .finally(() => {
      welcomeMessageDiv.classList.remove("thinking");
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    });
};

// Định dạng training data (rút gọn)
const formatTrainingData = (products = trainingData) => {
  let prompt = "";
  trainingData.slice(0, 5).forEach((product) => {
    prompt += `\n\n--- Thông tin sản phẩm ${product.productName} ---`;
    prompt += `\n- CPU: ${product.cpuCompany} ${product.cpuTechnology} ${product.cpuType} (${product.minimumCPUspeed}-${product.maximunSpeed} GHz, Nhân: ${product.multiplier}, Cache: ${product.processorCache})`;
    prompt += `\n- Đồ họa: Card Onboard: ${product.brandCardOboard} ${product.modelCardOboard} (${product.fullNameCardOboard}), Card rời: ${product.vgaFullName}`;
    prompt += `\n- RAM: ${product.ramCapacity} GB ${product.ramType} (${product.ramSpeed}), Số khe rời: ${product.numberOfRemovableSlots}, RAM Onboard: ${product.numberOfOnboardRAM}, Hỗ trợ tối đa: ${product.maximumRAMSupport} GB`;
    prompt += `\n- Lưu trữ: Ổ cứng: ${product.hardDriveType} ${product.capacity} GB, Tổng khe SSD/HDD: ${product.totalSSDHDDSlots}, Khe còn lại: ${product.numberOfSpacesHDDSlotsRemaining}, Nâng cấp tối đa: ${product.maximumHardDriveExpansionCapacity}`;
    prompt += `\n- Màn hình: ${product.screenSize} inch ${product.displayTechnology} (${product.resolution}, Loại: ${product.screenType}, Tần số quét: ${product.scanningFrequency}, Tấm nền: ${product.basePlate}, Độ sáng: ${product.brightness}, Phủ màu: ${product.colorCoverage}, Tỷ lệ: ${product.screenRatio})`;
    prompt += `\n- Kết nối: Cổng: ${product.communicationPort}, Wi-Fi: ${product.wifi}, Bluetooth: ${product.bluetooth}, Webcam: ${product.webcam}`;
    prompt += `\n- Hệ điều hành: ${product.os} (${product.version})`;
    prompt += `\n- Bảo mật: ${product.security}`;
    prompt += `\n- Bàn phím & TouchPad: Kiểu: ${product.keyboardType}, Bàn phím số: ${product.numericKeypad}, Đèn: ${product.keyboardLight}, TouchPad: ${product.touchPad}`;
    prompt += `\n- Pin & Sạc: Loại pin: ${product.batteryType}, Dung lượng: ${product.batteryCapacity} mAh, Nguồn: ${product.powerSupply}`;
    prompt += `\n- Phụ kiện: ${product.accessoriesInTheBox}`;
    prompt += `\n- Thiết kế: Kích thước: ${product.size}, Trọng lượng: ${product.productWeight}, Chất liệu: ${product.material}`;
    prompt += `\n- Thông tin khác: Mã SP: ${product.pnProductCode}, Xuất xứ: ${product.origin}, Bảo hành: ${product.warrantyPeriodMonths} tháng, Bảo quản: ${product.storageInstructions}, Hướng dẫn SD: ${product.userManual}, Màu: ${product.color}`;
  });
  return prompt || "Không tìm thấy sản phẩm phù hợp.";
};

// Lọc sản phẩm dựa trên câu hỏi
const filterProductsByQuestion = (question) => {
  if (!question || !trainingData || trainingData.length === 0)
    return trainingData;
  const lowerQuestion = question.toLowerCase();
  return trainingData.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const cpu = `${product.cpuCompany} ${product.cpuType}`.toLowerCase() || "";
    const vga = product.vgaFullName?.toLowerCase() || "";
    return (
      name.includes(lowerQuestion) ||
      cpu.includes(lowerQuestion) ||
      vga.includes(lowerQuestion)
    );
  });
};

// Tạo message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Generate bot response
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  // Lọc sản phẩm liên quan
  const filteredProducts = filterProductsByQuestion(userData.message);
  console.log("Sản phẩm lọc được:", filteredProducts);

  // Tạo prompt với hướng dẫn rõ ràng
  let fullPrompt = `Bạn là một trợ lý tư vấn mua laptop. Hãy trả lời câu hỏi dưới đây một cách chính xác, chi tiết, dựa trên thông tin sản phẩm được cung cấp. Nếu câu hỏi đề cập đến một sản phẩm cụ thể, hãy cung cấp đầy đủ thông tin từ dữ liệu sản phẩm. Nếu không tìm thấy sản phẩm khớp, yêu cầu người dùng làm rõ. Không trả lời dựa trên thông tin ngoài dữ liệu sản phẩm. Nếu có lịch sử trò chuyện, tham khảo để giữ ngữ cảnh.\n\n`;

  // Thêm lịch sử trò chuyện
  fullPrompt += `Lịch sử trò chuyện:\n`;
  conversationHistory.slice(-4).forEach((msg) => {
    fullPrompt += `${msg.role === "user" ? "Người dùng" : "Bot"}: ${
      msg.content
    }\n`;
  });

  // Thêm câu hỏi hiện tại
  fullPrompt += `\nCâu hỏi: ${userData.message}\n`;

  // Thêm dữ liệu sản phẩm
  fullPrompt += `\nThông tin sản phẩm:\n`;
  if (filteredProducts.length > 0) {
    fullPrompt += formatTrainingData(filteredProducts);
  } else if (trainingData.length > 0) {
    fullPrompt +=
      "Không tìm thấy sản phẩm khớp với câu hỏi. Vui lòng cung cấp thêm chi tiết (tên sản phẩm, model, v.v.).\n";
    fullPrompt += formatTrainingData(filteredProducts.slice(0, 3)); // Gửi toàn bộ trainingData nếu không lọc được
  } else {
    fullPrompt +=
      "Chưa có dữ liệu sản phẩm. Vui lòng yêu cầu người dùng cung cấp thêm thông tin.";
  }

  console.log("fullPrompt:", fullPrompt);

  const requestOptions = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:8080",
      "X-Title": "LaptopStore"
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: fullPrompt
        }
      ]
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.choices[0].message.content
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.textContent = apiResponseText;
    conversationHistory.push({ role: "bot", content: apiResponseText });
  } catch (error) {
    console.log("Lỗi API:", error);
    messageElement.textContent = `Lỗi: ${error.message}`;
    messageElement.style.color = "#ff0000";
  } finally {
    userData.file = {};
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing user message
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return;

  conversationHistory.push({ role: "user", content: userData.message });

  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  messageInput.dispatchEvent(new Event("input"));

  const messageContent = `<div class="message-text"></div>${
    userData.file.data
      ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
      : ""
  }`;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
  outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const messageContent = `<svg
            class="bot-avatar"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4 .7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
            ></path>
          </svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (
    e.key === "Enter" &&
    userMessage &&
    !e.shiftKey &&
    window.innerWidth > 768
  ) {
    handleOutgoingMessage(e);
  }
});

// Adjust input field height dynamically
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius =
    messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Handle file input change
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");

    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };

    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

// Cancel file upload
fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// Initialize emoji picker
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());

chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
  if (
    document.body.classList.contains("show-chatbot") &&
    trainingData.length > 0
  ) {
    showWelcomeMessage();
  }
});

closeChatbotBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});
