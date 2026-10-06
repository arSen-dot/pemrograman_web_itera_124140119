(() => {
  const STORAGE_KEY = "mini_pos_cart_v1";
  const MIN_NAME = 3;
  const MIN_PRICE = 500;
  const MIN_QTY = 1;
  const DISCOUNT_THRESHOLD = 50000;
  const DISCOUNT_RATE = 0.1;
  const PROMO_CODE = "HEMAT10";

  let cart = [];
  let promoApplied = false;

  const form = document.getElementById("itemForm");
  const nameInput = document.getElementById("itemName");
  const priceInput = document.getElementById("itemPrice");
  const qtyInput = document.getElementById("itemQty");
  const nameError = document.getElementById("itemNameError");
  const priceError = document.getElementById("itemPriceError");
  const qtyError = document.getElementById("itemQtyError");
  const cartBody = document.getElementById("cartBody");
  const itemCount = document.getElementById("itemCount");
  const promoInput = document.getElementById("promoCode");
  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const promoStatus = document.getElementById("promoStatus");
  const totalBelanjaEl = document.getElementById("totalBelanja");
  const diskonEl = document.getElementById("diskon");
  const totalAkhirEl = document.getElementById("totalAkhir");
  const uangBayarInput = document.getElementById("uangBayar");
  const kembalianEl = document.getElementById("kembalian");
  const paymentNote = document.getElementById("paymentNote");
  const changeBox = document.getElementById("changeBox");
  const resetBtn = document.getElementById("resetBtn");
  const discountNote = document.getElementById("discountNote");

  const fmt = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  function setError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    return !message;
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      return setError(nameInput, nameError, "Nama barang wajib diisi.");
    }
    if (value.length < MIN_NAME) {
      return setError(
        nameInput,
        nameError,
        `Nama barang minimal ${MIN_NAME} karakter.`
      );
    }
    return setError(nameInput, nameError, "");
  }

  function validatePrice() {
    const raw = priceInput.value.trim();
    const value = Number(raw);
    if (!raw) {
      return setError(priceInput, priceError, "Harga satuan wajib diisi.");
    }
    if (Number.isNaN(value) || value <= 0) {
      return setError(
        priceInput,
        priceError,
        "Harga satuan harus berupa angka positif."
      );
    }
    if (value < MIN_PRICE) {
      return setError(
        priceInput,
        priceError,
        `Harga satuan minimal ${fmt(MIN_PRICE)}.`
      );
    }
    return setError(priceInput, priceError, "");
  }

  function validateQty() {
    const raw = qtyInput.value.trim();
    const value = Number(raw);
    if (!raw) {
      return setError(qtyInput, qtyError, "Jumlah / qty wajib diisi.");
    }
    if (!Number.isInteger(value) || value < MIN_QTY) {
      return setError(
        qtyInput,
        qtyError,
        "Jumlah harus angka bulat minimal 1."
      );
    }
    return setError(qtyInput, qtyError, "");
  }

  function validateForm() {
    const nameOk = validateName();
    const priceOk = validatePrice();
    const qtyOk = validateQty();
    return nameOk && priceOk && qtyOk;
  }

  function clearFormErrors() {
    setError(nameInput, nameError, "");
    setError(priceInput, priceError, "");
    setError(qtyInput, qtyError, "");
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }
    renderCart();
    recalcAll();
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addItem(item) {
    cart.push(item);
    saveCart();
    renderCart();
    recalcAll();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    recalcAll();
  }

  function updateQty(index, newQty) {
    const qty = Number(newQty);
    if (!Number.isInteger(qty) || qty < MIN_QTY) {
      renderCart();
      return;
    }
    cart[index].qty = qty;
    saveCart();
    renderCart();
    recalcAll();
  }

  function clearCart() {
    cart = [];
    promoApplied = false;
    localStorage.removeItem(STORAGE_KEY);
    promoInput.value = "";
    promoStatus.textContent = "";
    promoStatus.className = "promo-status";
    uangBayarInput.value = "";
    renderCart();
    recalcAll();
  }

  function calcTotals() {
    const totalBelanja = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const eligible = totalBelanja >= DISCOUNT_THRESHOLD;
    const diskon = eligible ? Math.round(totalBelanja * DISCOUNT_RATE) : 0;
    return {
      totalBelanja,
      diskon,
      totalAkhir: totalBelanja - diskon,
      eligible,
    };
  }

  function updatePromoStatus(eligible) {
    const code = promoInput.value.trim().toUpperCase();

    if (promoApplied && code === PROMO_CODE) {
      if (eligible) {
        promoStatus.textContent = "Promo HEMAT10 aktif: diskon 10% diterapkan.";
        promoStatus.className = "promo-status active";
      } else {
        promoStatus.textContent =
          "Kode HEMAT10 valid, tetapi belanja belum mencapai Rp 50.000.";
        promoStatus.className = "promo-status";
      }
      return;
    }

    if (eligible) {
      promoStatus.textContent =
        "Diskon 10% otomatis aktif karena total belanja minimal Rp 50.000.";
      promoStatus.className = "promo-status active";
      return;
    }

    if (!code) {
      promoStatus.textContent = "";
      promoStatus.className = "promo-status";
    }
  }

  function updateKembalian(totalAkhir) {
    const raw = uangBayarInput.value.trim();
    const bayar = Number(raw);

    if (!raw) {
      kembalianEl.textContent = fmt(0);
      paymentNote.textContent = "Masukkan uang bayar untuk menghitung kembalian.";
      changeBox.className = "change-box neutral";
      return;
    }

    if (Number.isNaN(bayar) || bayar < 0) {
      kembalianEl.textContent = fmt(0);
      paymentNote.textContent = "Uang bayar harus berupa angka positif.";
      changeBox.className = "change-box warn";
      return;
    }

    if (bayar >= totalAkhir) {
      const kembali = bayar - totalAkhir;
      kembalianEl.textContent = fmt(kembali);
      paymentNote.textContent =
        kembali === 0 ? "Uang bayar pas. Tidak ada kembalian." : `Kembalian: ${fmt(kembali)}`;
      changeBox.className = "change-box";
      return;
    }

    const kurang = totalAkhir - bayar;
    kembalianEl.textContent = fmt(0);
    paymentNote.textContent = `Uang belum mencukupi. Kurang ${fmt(kurang)}.`;
    changeBox.className = "change-box warn";
  }

  function recalcAll() {
    const { totalBelanja, diskon, totalAkhir, eligible } = calcTotals();
    totalBelanjaEl.textContent = fmt(totalBelanja);
    diskonEl.textContent = fmt(diskon);
    totalAkhirEl.textContent = fmt(totalAkhir);
    discountNote.textContent = eligible
      ? "Diskon 10% diterapkan karena total belanja mencapai Rp 50.000."
      : "Belanja Rp 50.000 atau lebih untuk mendapatkan diskon 10%.";
    updatePromoStatus(eligible);
    updateKembalian(totalAkhir);
  }

  function escapeHtml(text) {
    const el = document.createElement("span");
    el.textContent = text;
    return el.innerHTML;
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    itemCount.textContent = `${totalQty} item`;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="6">Keranjang masih kosong. Tambahkan barang terlebih dahulu.</td>
        </tr>
      `;
      return;
    }

    cartBody.innerHTML = cart
      .map((item, index) => {
        const subtotal = item.price * item.qty;
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${fmt(item.price)}</td>
            <td>
              <input
                type="number"
                class="qty-input"
                value="${item.qty}"
                min="1"
                step="1"
                data-index="${index}"
                aria-label="Ubah jumlah ${escapeHtml(item.name)}"
              />
            </td>
            <td>${fmt(subtotal)}</td>
            <td>
              <button type="button" class="btn-delete" data-index="${index}">Hapus</button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function applyPromo() {
    const code = promoInput.value.trim().toUpperCase();
    const { eligible } = calcTotals();

    if (!code) {
      promoApplied = false;
      promoStatus.textContent = "Masukkan kode promo, contoh: HEMAT10.";
      promoStatus.className = "promo-status";
      recalcAll();
      return;
    }

    if (code !== PROMO_CODE) {
      promoApplied = false;
      promoStatus.textContent = "Kode promo tidak valid. Gunakan HEMAT10.";
      promoStatus.className = "promo-status";
      recalcAll();
      return;
    }

    promoApplied = true;
    if (eligible) {
      promoStatus.textContent = "Promo HEMAT10 aktif: diskon 10% diterapkan.";
      promoStatus.className = "promo-status active";
    } else {
      promoStatus.textContent =
        "Kode HEMAT10 valid, tetapi belanja belum mencapai Rp 50.000.";
      promoStatus.className = "promo-status";
    }
    recalcAll();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    addItem({
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      qty: Number(qtyInput.value),
    });

    form.reset();
    clearFormErrors();
    nameInput.focus();
  });

  nameInput.addEventListener("blur", validateName);
  priceInput.addEventListener("blur", validatePrice);
  qtyInput.addEventListener("blur", validateQty);

  nameInput.addEventListener("input", () => {
    if (nameInput.classList.contains("invalid")) validateName();
  });
  priceInput.addEventListener("input", () => {
    if (priceInput.classList.contains("invalid")) validatePrice();
  });
  qtyInput.addEventListener("input", () => {
    if (qtyInput.classList.contains("invalid")) validateQty();
  });

  cartBody.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-delete");
    if (!button) return;
    removeItem(Number(button.dataset.index));
  });

  cartBody.addEventListener("change", (event) => {
    if (!event.target.classList.contains("qty-input")) return;
    updateQty(Number(event.target.dataset.index), event.target.value);
  });

  applyPromoBtn.addEventListener("click", applyPromo);
  promoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyPromo();
    }
  });

  uangBayarInput.addEventListener("input", () => {
    updateKembalian(calcTotals().totalAkhir);
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Yakin ingin memulai transaksi baru? Keranjang akan dikosongkan.")) {
      clearCart();
    }
  });

  loadCart();
})();
