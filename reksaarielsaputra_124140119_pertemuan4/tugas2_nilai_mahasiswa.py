"""Program Pengelolaan Data Nilai Mahasiswa.

Menghitung nilai akhir dari list berisi dictionary data mahasiswa
dengan bobot 30% UTS + 40% UAS + 30% Tugas, menentukan grade A-E,
menampilkan tabel rapi, serta mahasiswa dengan nilai tertinggi
dan terendah.
"""

mahasiswa = [
    {"nama": "Reksa Ariel Saputra", "nim": "124140119", "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Ahmad Fadhilah", "nim": "121140001", "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 80},
    {"nama": "Siti Nurhaliza", "nim": "121140002", "nilai_uts": 65, "nilai_uas": 70, "nilai_tugas": 68},
    {"nama": "Budi Santoso", "nim": "121140003", "nilai_uts": 55, "nilai_uas": 60, "nilai_tugas": 58},
    {"nama": "Dewi Lestari", "nim": "121140004", "nilai_uts": 92, "nilai_uas": 88, "nilai_tugas": 95},
    {"nama": "Andi Pratama", "nim": "121140005", "nilai_uts": 45, "nilai_uas": 50, "nilai_tugas": 48},
]


def hitung_nilai_akhir(uts, uas, tugas):
    """Hitung nilai akhir dengan bobot 30% UTS, 40% UAS, 30% Tugas."""
    return (0.30 * uts) + (0.40 * uas) + (0.30 * tugas)


def tentukan_grade(nilai_akhir):
    """Tentukan grade A-E berdasarkan nilai akhir."""
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


for mhs in mahasiswa:
    mhs["nilai_akhir"] = hitung_nilai_akhir(
        mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
    )
    mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])

print(f"{'Nama':<22}{'NIM':<12}{'Nilai Akhir':<13}{'Grade':<6}")
print("-" * 53)
for mhs in mahasiswa:
    print(
        f"{mhs['nama']:<22}{mhs['nim']:<12}"
        f"{mhs['nilai_akhir']:<13.2f}{mhs['grade']:<6}"
    )

tertinggi = max(mahasiswa, key=lambda m: m["nilai_akhir"])
terendah = min(mahasiswa, key=lambda m: m["nilai_akhir"])

print(f"\nNilai akhir tertinggi: {tertinggi['nama']} "
      f"({tertinggi['nim']}) - {tertinggi['nilai_akhir']:.2f} "
      f"(Grade {tertinggi['grade']})")
print(f"Nilai akhir terendah: {terendah['nama']} "
      f"({terendah['nim']}) - {terendah['nilai_akhir']:.2f} "
      f"(Grade {terendah['grade']})")
