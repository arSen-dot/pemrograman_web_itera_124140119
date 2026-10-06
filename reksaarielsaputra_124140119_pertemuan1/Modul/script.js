// Mendeklarasikan variabel dengan var, let, dan const
var nama = "Prabskuy";
let usia = 69;
const TAHUN_LAHIR = 1957;

// Menampilkan output ke konsol
console.log("Nama: " + nama);
console.log("Usia: " + usia);
console.log("Tahun Lahir: " + TAHUN_LAHIR);

// Menampilkan output ke halaman HTML
document.getElementById("result").innerHTML = `
  <p>Nama: <strong>${nama}</strong></p>
  <p>Usia: <strong>${usia}</strong></p>
  <p>Tahun Lahir: <strong>${TAHUN_LAHIR}</strong></p>
`;

// Struktur kondisional (tambahkan di bawah kode sebelumnya)
let nilai = 85;
let grade = "";

// If-else if-else
if (nilai >= 90) {
    grade = "A";
} else if (nilai >= 80) {
    grade = "B";
} else if (nilai >= 70) {
    grade = "C";
} else if (nilai >= 60) {
    grade = "D";
} else {
    grade = "E";
}
console.log("Nilai: " + nilai + ", Grade: " + grade);

// Ternary operator
let status = nilai >= 60 ? "Lulus" : "Tidak Lulus";
console.log("Status: " + status);

// Switch case
let hari = new Date().getDay();
let namaHari = "";
switch (hari) {
    case 0: namaHari = "Minggu"; break;
    case 1: namaHari = "Senin"; break;
    case 2: namaHari = "Selasa"; break;
    case 3: namaHari = "Rabu"; break;
    case 4: namaHari = "Kamis"; break;
    case 5: namaHari = "Jumat"; break;
    case 6: namaHari = "Sabtu"; break;
    default: namaHari = "Hari tidak valid";
}
console.log("Hari ini adalah: " + namaHari);

// For loop
let nilaiSiswa = [85, 92, 78, 90, 88];
let total = 0;

for (let i = 0; i < nilaiSiswa.length; i++) {
    total += nilaiSiswa[i];
}

let rataRata = total / nilaiSiswa.length;
console.log("Rata-rata: " + rataRata.toFixed(2));

// While loop
let hitungMundur = 5;
while (hitungMundur > 0) {
    console.log(hitungMundur);
    hitungMundur--;
}

// For...of loop (ES6)
for (let nilai of nilaiSiswa) {
    let statusNilai = nilai >= 80 ? "Lulus" : "Tidak Lulus";
    console.log(`Nilai: ${nilai} (${statusNilai})`);
}

function sapaNama(nama) {
    return `Halo, ${nama}! Selamat belajar JavaScript!`;
}

document.getElementById("sapa-button").addEventListener("click", function () {
    const nama = document.getElementById("nama-input").value;
    if (nama.trim() === "") {
        document.getElementById("sapa-output").innerHTML =
            '<p style="color:red">Silakan masukkan nama Anda terlebih dahulu.</p>';
    } else {
        const pesan = sapaNama(nama);
        document.getElementById("sapa-output").innerHTML =
            `<p style="color:green">${pesan}</p>`;
    }
});

function hitungKalkulator(angka1, angka2, operasi) {
    switch (operasi) {
        case "tambah": return angka1 + angka2;
        case "kurang": return angka1 - angka2;
        case "kali": return angka1 * angka2;
        case "bagi":
            if (angka2 === 0) return "Error: Pembagian dengan nol tidak diperbolehkan";
            return angka1 / angka2;
        default: return "Operasi tidak valid";
    }
}

// Array dan metode array
const buah = ["Apel", "Jeruk", "Mangga", "Pisang", "Anggur"];

buah.push("Durian");        // Tambah di akhir
const itemDihapus = buah.pop();  // Hapus dari akhir
buah.sort();                // Urutkan

// map, filter, reduce
const hargaBuah = [10000, 8000, 15000, 5000, 20000];
const daftarBuah = buah.map((item, i) => `${item} (Rp${hargaBuah[i]})`);
const buahMahal = buah.filter((_, i) => hargaBuah[i] > 10000);

// Objek
const mahasiswa = {
    nama: "Budi Santoso",
    nim: "20210001",
    jurusan: "Teknik Informatika",
    nilai: { algoritma: 85, basis_data: 90, web: 88 },
    hobi: ["Coding", "Membaca", "Futsal"],
    tampilkanInfo() { return `${this.nama} (${this.nim})`; },
    hitungRataRata() {
        const arr = Object.values(this.nilai);
        return (arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(2);
    }
};

const domOutput = document.getElementById("dom-output");
let itemCount = 0;

document.getElementById("btn-tambah-item").addEventListener("click", function () {
    itemCount++;
    const newItem = document.createElement("div");
    newItem.className = "p-2 mb-2 bg-gray-100 rounded";
    newItem.innerText = `Item ${itemCount}`;
    domOutput.appendChild(newItem);
});

document.getElementById("btn-hapus-item").addEventListener("click", function () {
    if (domOutput.lastChild) {
        domOutput.removeChild(domOutput.lastChild);
        itemCount--;
    }
});

document.getElementById("btn-fetch").addEventListener("click", async function () {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        const apiOutput = document.getElementById("api-output");
        apiOutput.innerHTML = "<h3>Daftar Post:</h3>";
        data.slice(0, 5).forEach(post => {
            apiOutput.innerHTML += `
        <div style="margin-bottom:1rem;padding:0.75rem;background:#f3f4f6;border-radius:4px">
          <h4>${post.title}</h4>
          <p>${post.body}</p>
        </div>
      `;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("api-output").innerHTML =
            `<p style="color:red">Gagal mengambil data: ${error.message}</p>`;
    }
});