"""Program utama yang menggunakan seluruh fungsi math_operations.

Menerapkan dua cara impor yang berbeda:
1. import math_operations (akses lewat nama modul)
2. from math_operations import ... (akses langsung nama fungsi)
"""

import math_operations
from math_operations import (
    luas_persegi,
    keliling_lingkaran,
    celsius_ke_fahrenheit,
)

print("=== Geometri (import math_operations) ===")
print(f"Luas persegi (sisi 5)          : {math_operations.luas_persegi(5):.2f}")
print(f"Keliling persegi (sisi 5)       : {math_operations.keliling_persegi(5):.2f}")
print(f"Luas persegi panjang (6 x 4)    : {math_operations.luas_persegi_panjang(6, 4):.2f}")
print(f"Keliling persegi panjang (6 x 4): {math_operations.keliling_persegi_panjang(6, 4):.2f}")
print(f"Luas lingkaran (r = 7)          : {math_operations.luas_lingkaran(7):.2f}")
print(f"Keliling lingkaran (r = 7)      : {math_operations.keliling_lingkaran(7):.2f}")
print(f"Konstanta PI                    : {math_operations.PI}")

print("\n=== Konversi Suhu (from ... import) ===")
print(f"25 C ke Fahrenheit : {celsius_ke_fahrenheit(25):.2f} F")
print(f"25 C ke Kelvin     : {math_operations.celsius_ke_kelvin(25):.2f} K")

print("\n=== Geometri (from ... import) ===")
print(f"Luas persegi (sisi 5)      : {luas_persegi(5):.2f}")
print(f"Keliling lingkaran (r = 7) : {keliling_lingkaran(7):.2f}")
