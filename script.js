// Fungsi untuk membaca file TXT dan menampilkan hasilnya di textarea (jika file diupload)
function convertTxtToVcf() {
    const fileInput = document.getElementById('txtFile');
    const vcfOutput = document.getElementById('vcfOutput');

    if (fileInput.files.length === 0) {
        alert('Tidak ada file yang diunggah. Anda bisa menambah nomor secara manual di kolom hasil konversi.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        vcfOutput.value = text; // Tampilkan isi TXT ke kolom hasil konversi
    };

    reader.readAsText(file);
}

// Fungsi untuk mengunduh file VCF berdasarkan hasil konversi yang ada di kolom output
function downloadVCF() {
    const vcfOutput = document.getElementById('vcfOutput').value;
    const vcfFileName = document.getElementById('vcfFileName').value || 'contacts'; // Nama file default jika kosong

    const adminName = document.getElementById('adminName').value || 'Admin';
    const navyName = document.getElementById('navyName').value || 'Navy';
    const anggotaName = document.getElementById('anggotaName').value || 'Anggota';

    if (vcfOutput.trim() === '') {
        alert('Tidak ada konten VCF untuk diunduh!');
        return;
    }

    const lines = vcfOutput.split(/\r?\n/);
    let vcfContent = '';
    let currentSection = '';

    // Looping untuk membaca isi konversi dan memberikan nama kontak sesuai label (admin/navy/anggota)
    lines.forEach((line) => {
        const number = line.trim();
        if (number.toLowerCase() === 'admin') {
            currentSection = 'admin';
        } else if (number.toLowerCase() === 'navy') {
            currentSection = 'navy';
        } else if (number.toLowerCase() === 'anggota') {
            currentSection = 'anggota';
        } else if (number !== '') {
            let contactName = '';
            if (currentSection === 'admin') {
                contactName = `${adminName}`;
            } else if (currentSection === 'navy') {
                contactName = `${navyName}`;
            } else if (currentSection === 'anggota') {
                contactName = `${anggotaName}`;
            }

            // Format VCF
            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${number}\nEND:VCARD\n\n`;
        }
    });

    // Buat dan unduh file VCF
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${vcfFileName}.vcf`;
    link.click();
}