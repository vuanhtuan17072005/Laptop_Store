// Helper tạo gradient cho chart
function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

async function loadDashboardData() {
  try {
    const response = await fetch("http://localhost:8080/admin/dashboard/");
    const data = await response.json();

    // Cập nhật số liệu tổng quan
    document.getElementById("quantity-sell-product-current-month").innerText =
      data.quantitySellProductCurrentMonth;
    document.getElementById("total-customer-in-current-month").innerText =
      data.totalCustomerInCurrentMonth;
    document.getElementById("total-new-customer-in-current-month").innerText =
      data.totalNewCustomerInCurrentMonth;
    document.getElementById("total-amount-in-current-month").innerText =
      `${data.totalAmountInCurrentMonth.toLocaleString()} VND`;

    // === BIỂU ĐỒ KHÁCH HÀNG MỚI ===
    const ctx1 = document.getElementById("new-customers-chart").getContext("2d");
    const gradient1 = createGradient(ctx1, "#36A2EB", "#B2EBF2");
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: data.newCustomerPerMonthMap.map(item => `Tháng ${item.month}`),
        datasets: [
          {
            label: "Khách hàng mới",
            data: data.newCustomerPerMonthMap.map(item => item.customerCount),
            borderColor: "#1976D2",
            backgroundColor: gradient1,
            pointBackgroundColor: "#1976D2",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointBorderWidth: 2,
            pointStyle: "circle",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowBlur: 10,
            shadowColor: "#1976D2",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Khách hàng mới theo tháng",
            font: { size: 20, weight: "bold" },
            color: "#1976D2"
          },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#1976D2",
            bodyColor: "#333",
            borderColor: "#1976D2",
            borderWidth: 1,
            callbacks: {
              label: (item) => `${item.raw} khách hàng`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#E3F2FD" },
            ticks: { color: "#1976D2" },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#E3F2FD" },
            ticks: { color: "#1976D2" },
          },
        },
      },
    });

    // === BIỂU ĐỒ DOANH THU ===
    const ctx2 = document.getElementById("revenue-chart").getContext("2d");
    const gradient2 = createGradient(ctx2, "#FF6384", "#FFD1DC");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: data.totalAmountPerMonthMap.map(item => `Tháng ${item.month}`),
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: data.totalAmountPerMonthMap.map(item => item.totalAmount),
            backgroundColor: gradient2,
            borderColor: "#FF6384",
            borderWidth: 2,
            borderRadius: 12,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            hoverBackgroundColor: "#FF6384",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Doanh thu theo tháng",
            font: { size: 20, weight: "bold" },
            color: "#FF6384"
          },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#FF6384",
            bodyColor: "#333",
            borderColor: "#FF6384",
            borderWidth: 1,
            callbacks: {
              label: (item) => `${item.raw.toLocaleString()} VND`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#FFE4EC" },
            ticks: { color: "#FF6384" },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#FFE4EC" },
            ticks: { color: "#FF6384" },
          },
        },
      },
    });

    // === BIỂU ĐỒ SẢN PHẨM BÁN ===
    const ctx3 = document.getElementById("products-sold-chart").getContext("2d");
    const gradient3 = createGradient(ctx3, "#7E57C2", "#E1BEE7");
    new Chart(ctx3, {
      type: "bar",
      data: {
        labels: data.totalQuantitySellProductPerMonthMap.map(item => `Tháng ${item.month}`),
        datasets: [
          {
            label: "Sản phẩm bán",
            data: data.totalQuantitySellProductPerMonthMap.map(item => item.totalSold),
            backgroundColor: gradient3,
            borderColor: "#7E57C2",
            borderWidth: 2,
            borderRadius: 12,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
            hoverBackgroundColor: "#7E57C2",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Số lượng sản phẩm bán theo tháng",
            font: { size: 20, weight: "bold" },
            color: "#7E57C2"
          },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#7E57C2",
            bodyColor: "#333",
            borderColor: "#7E57C2",
            borderWidth: 1,
            callbacks: {
              label: (item) => `${item.raw} sản phẩm`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#F3E5F5" },
            ticks: { color: "#7E57C2" },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "", font: { size: 16 } },
            grid: { color: "#F3E5F5" },
            ticks: { color: "#7E57C2" },
          },
        },
      },
    });


    // Danh sách sản phẩm bán chạy
    const TopProductsList = document.getElementById("top-products-list");
    TopProductsList.innerHTML = "";
    data.topPurchasedProductInMonth.forEach((product) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <div><strong>${product.productName}</strong></div>
        <div><img src="${product.imageUrl}" alt="${product.productName}" style="width: 100px; height: auto;"></div>
        <div>Giá: ${product.price.toLocaleString()} VND</div>
      `;
      TopProductsList.appendChild(li);
    });

    // Danh sách khách hàng tốt nhất
    const topCustomersList = document.getElementById("top-customers-list");
    topCustomersList.innerHTML = "";
    data.topCustomerInMonth.forEach((customer) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `
        <div><strong>${customer.fullName}</strong></div>
        <div>Email: ${customer.email}</div>
        <div>Số điện thoại: ${customer.phoneNumber}</div>
        <div>Địa chỉ: ${customer.streetAddress}, ${customer.ward}, ${customer.district}, ${customer.city}, ${customer.address}</div>
        <div>Tổng chi tiêu: ${customer.totalAmount.toLocaleString()} VND</div>
      `;
      topCustomersList.appendChild(li);
    });

  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ API:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadDashboardData);
