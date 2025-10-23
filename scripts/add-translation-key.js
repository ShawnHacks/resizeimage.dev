#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

// Translation for different languages
const translations = {
  'ar': 'لم يتم العثور على ملفات صور صالحة. الرجاء تحديد صور صالحة.',
  'bn': 'কোনও বৈধ চিত্র ফাইল পাওয়া যায়নি। অনুগ্রহ করে বৈধ চিত্র নির্বাচন করুন।',
  'de': 'Keine gültigen Bilddateien gefunden. Bitte wählen Sie gültige Bilder aus.',
  'en': 'No valid image files found. Please select valid images.',
  'es': 'No se encontraron archivos de imagen válidos. Seleccione imágenes válidas.',
  'fr': 'Aucun fichier image valide trouvé. Veuillez sélectionner des images valides.',
  'id': 'Tidak ditemukan file gambar yang valid. Silakan pilih gambar yang valid.',
  'it': 'Nessun file immagine valido trovato. Seleziona immagini valide.',
  'ja': '有効な画像ファイルが見つかりません。有効な画像を選択してください。',
  'ko': '유효한 이미지 파일을 찾을 수 없습니다. 유효한 이미지를 선택하십시오.',
  'pt-BR': 'Nenhum arquivo de imagem válido encontrado. Selecione imagens válidas.',
  'pt': 'Nenhum arquivo de imagem válido encontrado. Selecione imagens válidas.',
  'ru': 'Не найдено допустимых файлов изображений. Пожалуйста, выберите допустимые изображения.',
  'th': 'ไม่พบไฟล์รูปภาพที่ถูกต้อง โปรดเลือกรูปภาพที่ถูกต้อง',
  'tr': 'Geçerli resim dosyası bulunamadı. Lütfen geçerli resimler seçin.',
  'uk': 'Дійсних файлів зображень не знайдено. Будь ласка, виберіть дійсні зображення.',
  'vi': 'Không tìm thấy tệp hình ảnh hợp lệ. Vui lòng chọn hình ảnh hợp lệ.',
  'zh-TW': '未找到有效的圖片檔案。請選擇有效的圖片。',
  'zh': '未找到有效的图片文件。请选择有效的图片.'
};

// Read all JSON files in messages directory
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(messagesDir, file);
  
  // Skip if already updated
  if (['en.json', 'zh.json'].includes(file)) {
    console.log(`✓ ${file} already updated`);
    return;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check if toast section exists
    if (content.BulkResizeTool && content.BulkResizeTool.toast) {
      // Add the new key
      const translation = translations[lang] || translations['en'];
      
      // Insert after "error" key
      const toast = content.BulkResizeTool.toast;
      const newToast = {};
      
      for (const [key, value] of Object.entries(toast)) {
        newToast[key] = value;
        if (key === 'error' && !toast.noValidImages) {
          newToast.noValidImages = translation;
        }
      }
      
      content.BulkResizeTool.toast = newToast;
      
      // Write back
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log(`✓ Updated ${file}`);
    } else {
      console.log(`⚠ ${file} - BulkResizeTool.toast not found`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${file}:`, err.message);
  }
});

console.log('\nDone!');
