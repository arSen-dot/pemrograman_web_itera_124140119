"""Modul Matematika: geometri dan konversi suhu.

Menyediakan fungsi luas dan keliling untuk persegi, persegi panjang,
dan lingkaran, fungsi konversi suhu Celsius ke Fahrenheit dan Kelvin,
serta konstanta PI.
"""

PI = 3.14159


def luas_persegi(sisi):
    """Hitung luas persegi dari panjang sisi. Mengembalikan luas."""
    return sisi * sisi


def keliling_persegi(sisi):
    """Hitung keliling persegi dari panjang sisi. Mengembalikan keliling."""
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Hitung luas persegi panjang. Mengembalikan luas."""
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Hitung keliling persegi panjang. Mengembalikan keliling."""
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Hitung luas lingkaran dari jari-jari. Mengembalikan luas."""
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """Hitung keliling lingkaran dari jari-jari. Mengembalikan keliling."""
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius):
    """Konversi suhu Celsius ke Fahrenheit. Mengembalikan Fahrenheit."""
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius):
    """Konversi suhu Celsius ke Kelvin. Mengembalikan Kelvin."""
    return celsius + 273.15
