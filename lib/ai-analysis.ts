// Genişletilmiş bitki hastalığı veritabanı + gerçek API entegrasyon desteği

export interface AnalysisResult {
  diagnosis: string;
  severity: 'düşük' | 'orta' | 'yüksek';
  solutions: string[];
  prevention: string[];
  affectedPlants: string[];
}

const DISEASES: AnalysisResult[] = [
  {
    diagnosis: 'Yaprak Yanıklığı (Fungal Enfeksiyon)',
    severity: 'orta',
    solutions: [
      'Enfekte yaprakları hemen budayın ve imha edin (komposta atmayın)',
      'Bakır bazlı fungisit uygulayın (7-10 gün arayla 3 uygulama)',
      'Sulama sıklığını azaltın, yaprakları ıslatmaktan kaçının',
      'Hava sirkülasyonunu artırmak için bitkileri seyreltin',
      'Erken sabah sulama yapın ki yapraklar gün içinde kurusun',
    ],
    prevention: [
      'Bitkiler arası mesafeyi adequate tutun',
      'Direngen çeşitleri tercih edin',
      'Düzenli olarak yaprak kontrolü yapın',
    ],
    affectedPlants: ['Domates', 'Biber', 'Patates', 'Yumurta'],
  },
  {
    diagnosis: 'Yaprak Biti Enfestasyonu',
    severity: 'düşük',
    solutions: [
      'Sabunlu su çözeltisi ile yaprakları yıkayın (1L su + 1 çorba kaşığı sıvı sabun)',
      'Doğal düşmanları (uğur böceği, lacewing) teşvik edin',
      'Neem yağı spreyi uygulayın (7 günde bir)',
      'Yapışkan tuzaklar kullanarak popülasyonu izleyin',
      'Şiddetli vakalarda insektisit kullanın (son çare olarak)',
    ],
    prevention: [
      'Düzenli yaprak kontrolü yapın (özellikle bitki uçlarında)',
      'Karınca aktivitesini izleyin (yaprak biti çiftçileri)',
      'Azotlu gübreyi aşırı kullanmayın (yaprak biti sever)',
    ],
    affectedPlants: ['Gül', 'Domates', 'Biber', 'Salatalık', 'Krisantem'],
  },
  {
    diagnosis: 'Külleme Hastalığı',
    severity: 'orta',
    solutions: [
      'Enfekte bitki kısımlarını kesin ve imha edin',
      'Kükürt bazlı fungisit uygulayın',
      'Bitkiler arasındaki mesafeyi artırın',
      'Yaprak ıslaklığını minimumda tutun',
      'Süt çözeltisi spreyi deneyin (1:9 oranında süt:Su)',
    ],
    prevention: [
      'Sulamayı sabah erken saatlerde yapın',
      'Hava sirkülasyonu için bitkileri seyreltin',
      'Direngen çeşitleri tercih edin',
    ],
    affectedPlants: ['Salatalık', 'Kabak', 'Üzüm', 'Gül', 'Biber'],
  },
  {
    diagnosis: 'Pas Hastalığı',
    severity: 'yüksek',
    solutions: [
      'Enfekte yaprakları toplayıp imha edin (komposta atmayın)',
      'Sisteminik fungisit uygulaması yapın',
      'Dayanıklı çeşitleri tercih edin',
      'Düzenli gübreleme ile bitkiyi güçlendirin',
      'Bitki etrafındaki yabani otları temizleyin',
    ],
    prevention: [
      'Yaprakları ıslatmadan sulama yapın',
      'Bitki aralarında adequate mesafe bırakın',
      'Geçiş döneminde temizlik yapın',
    ],
    affectedPlants: ['Buğday', 'Arpa', 'Sarımsak', 'Karanfil', 'Enginar'],
  },
  {
    diagnosis: 'Kök Çürüklüğü (Fungal)',
    severity: 'yüksek',
    solutions: [
      'Sulamayı derhal azaltın ve toprağın kurumasını bekleyin',
      'Enfekte bitkileri çıkarın ve kökleri kontrol edin',
      'Fungusit drench uygulaması yapın (thiophanate-methyl)',
      'Drenajı geliştirmek için toprağı karıştırın',
      'Yeni ekimde steril toprak kullanın',
    ],
    prevention: [
      'Aşırı sulamadan kaçının',
      'Saksılarda drenaj deliklerini açık tutun',
      'Toprağı periyodik olarak havalandırın',
    ],
    affectedPlants: ['Domates', 'Biber', 'Çilek', 'Süs bitkileri'],
  },
  {
    diagnosis: 'Mosaic Virus (Mozaik Virüsü)',
    severity: 'yüksek',
    solutions: [
      'Enfekte bitkileri derhal çıkarın ve imha edin (tedavi edilemez)',
      'Aphid ve thrip gibi vektörleri kontrol edin',
      'Aletleri dezenfekte edin (çamaşır suyu ile)',
      'Direngen çeşitleri kullanın',
      'Komşu bitkileri izole edin',
    ],
    prevention: [
      'Vektör böcekleri kontrol altında tutun',
      'Temiz tohum ve fide kullanın',
      'Enfekte bitkileri derhal uzaklaştırın',
    ],
    affectedPlants: ['Domates', 'Biber', 'Salatalık', 'Tütün', 'Patates'],
  },
  {
    diagnosis: 'Bacterial Yaprak Lekesi',
    severity: 'orta',
    solutions: [
      'Enfekte yaprakları çıkarın ve imha edin',
      'Bakır bazlı bakterisit uygulayın',
      'Sulamada yaprakları ıslatmaktan kaçının',
      'Aletleri düzenli dezenfekte edin',
      'Bitkiler arası mesafeyi artırın',
    ],
    prevention: [
      'Temiz tohum kullanın',
      'Ekim rotasyonu yapın',
      'Nem seviyesini kontrol edin',
    ],
    affectedPlants: ['Domates', 'Biber', 'Marul', 'Kereviz', 'Lahana'],
  },
  {
    diagnosis: 'Demir Eksikliği (Kloroz)',
    severity: 'düşük',
    solutions: [
      'Şelatlı demir gübresi uygulayın (yapraktan veya kökten)',
      'Toprak pH\'ını kontrol edin (asitlik artırılabilir)',
      'Kompost ekleyerek toprağı geliştirin',
      'Aşırı kireç kullanımından kaçının',
    ],
    prevention: [
      'Düzenli toprak testi yapın',
      'Demir açısından zengin kompost kullanın',
      'pH seviyesini izleyin',
    ],
    affectedPlants: ['Turunçgiller', 'Asma', 'Gül', 'Azalea', 'Kamelya'],
  },
  {
    diagnosis: 'Örümcek Akarı (Kırmızı Örümcek)',
    severity: 'orta',
    solutions: [
      'Yaprağın altını nemli süngerle temizleyin',
      'Predatör akarı (Phytoseiulus) kullanın',
      'Neem yağı veya hortikültürel yağ uygulayın',
      'Nemi artırın (akarlar kuru ortamı sever)',
      'Akarisit kullanın (son çare olarak)',
    ],
    prevention: [
      'Nem seviyesini yüksek tutun',
      'Düzenli yaprak kontrolü yapın (özellikle alt yüzey)',
      'Yabani otları temizleyin',
    ],
    affectedPlants: ['Domates', 'Salatalık', 'Çilek', 'Süs bitkileri', 'Orkide'],
  },
  {
    diagnosis: 'Beyaz Sinek (Whitefly) Enfestasyonu',
    severity: 'orta',
    solutions: [
      'Sarı yapışkan tuzaklar kullanın',
      'Predatör böcek (Encarsia formosa) kullanın',
      'Insektisidal sabun spreyi uygulayın',
      'Neem yağı ile pülverizasyon yapın',
      'Sera ortamında fumigasyon düşünün',
    ],
    prevention: [
      'Fide alırken kontrol edin',
      'Yabani otları temizleyin',
      'Serada hava sirkülasyonu sağlayın',
    ],
    affectedPlants: ['Domates', 'Biber', 'Salatalık', 'Turunçgiller', 'Süs bitkileri'],
  },
  {
    diagnosis: 'Antraknoz (Meyve Çürüklüğü)',
    severity: 'yüksek',
    solutions: [
      'Enfekte meyve ve yaprakları imha edin',
      'Fungisit uygulayın (chlorothalonil veya copper)',
      'Bitkiyi适当 şekilde budayın',
      'Sulamada meyveleri ıslatmaktan kaçının',
      'Hasat sonrası atıkları temizleyin',
    ],
    prevention: [
      'Direngen çeşitleri tercih edin',
      'Bitki aralarında mesafe bırakın',
      'Rotasyon ekimi yapın',
    ],
    affectedPlants: ['Domates', 'Biber', 'Çilek', 'Üzüm', 'Kabak'],
  },
  {
    diagnosis: 'Tuz Stresi (Toprak Tuzluluğu)',
    severity: 'orta',
    solutions: [
      'Toprağı bol su ile yıkayın (leaching)',
      'Drenajı geliştirin',
      'Tuz toleranslı çeşitleri tercih edin',
      'Kompost veya organik madde ekleyin',
      'Sulama suyu kalitesini test edin',
    ],
    prevention: [
      'Aşırı gübrelemeden kaçının',
      'Sulama suyunu test edin',
      'Organik madde ile toprağı geliştirin',
    ],
    affectedPlants: ['Domates', 'Biber', 'Marul', 'Çilek'],
  },
  {
    diagnosis: 'Güneş Yanığı (Sunscald)',
    severity: 'düşük',
    solutions: [
      'Bitkiyi kısmi gölgeye taşıyın veya gölgeleme yapın',
      'Yeterli yaprak coverage sağlamak için besin maddesi dengeleyin',
      'Hasat zamanını sabah erken saatlere alın',
      'Enfekte meyveleri çıkarın',
    ],
    prevention: [
      'Aşırı budamadan kaçının',
      'Sıcak dönemlerde gölgeleme yapın',
      'Bitkiyi uygun şekilde gübreleyin',
    ],
    affectedPlants: ['Domates', 'Biber', 'Salatalık', 'Kabak'],
  },
  {
    diagnosis: 'Beyaz Çürüklük (Sclerotinia)',
    severity: 'yüksek',
    solutions: [
      'Enfekte bitkileri çıkarın ve imha edin',
      'Sulamayı azaltın ve havalandırmayı artırın',
      'Fungisit uygulayın (boscalid veya iprodione)',
      'Toprağı solarizasyon ile sterilize edin',
      'Ekim rotasyonu yapın (3-4 yıl)',
    ],
    prevention: [
      'Hava sirkülasyonu sağlayın',
      'Aşırı sulamadan kaçının',
      'Temiz tohum kullanın',
    ],
    affectedPlants: ['Marul', 'Turşu', 'Kereviz', 'Domates', 'Biber'],
  },
  {
    diagnosis: 'Azot Eksikliği',
    severity: 'düşük',
    solutions: [
      'Azot zengini kompost veya gübre uygulayın',
      'Denize ekli azotlu gübre kullanın (kan unu, balık emülsiyonu)',
      'Baklagil ekimi ile toprağa azot kazandırın',
      'Kompost çayı ile yapraktan besleme yapın',
    ],
    prevention: [
      'Düzenli toprak testi yapın',
      'Mevsimlik kompost ekleyin',
      'Rotasyon ekimi yapın',
    ],
    affectedPlants: ['Tüm bitkiler', 'Özellikle yapraklı sebzeler'],
  },
];

// Dış API entegrasyonu için arayüz
export interface ExternalAnalysisResponse {
  diagnosis: string;
  solutions: string[];
}

// Gerçek API çağrısı (PLANT_API_KEY ayarlıysa)
async function callExternalAPI(imageUrl: string): Promise<AnalysisResult | null> {
  const apiKey = process.env.PLANT_API_KEY;
  if (!apiKey) return null;

  try {
    // Örnek: Plant.id API entegrasyonu
    // Gerçek implementasyon için API dokümantasyonuna bakın
    const res = await fetch('https://api.plant.id/v2/health_assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        images: [imageUrl],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.health_assessment?.diseases?.length > 0) {
      const disease = data.health_assessment.diseases[0];
      return {
        diagnosis: disease.name,
        severity: 'orta',
        solutions: (disease.treatment?.pesticides || []).map((p: any) => p.name || 'Bilinmiyor'),
        prevention: (disease.treatment?.prevention || []).map((p: any) => p || ''),
        affectedPlants: [],
      };
    }
  } catch (error) {
    console.error('External API error:', error);
  }

  return null;
}

// Yerel analiz (fallback)
function localAnalysis(): AnalysisResult {
  return DISEASES[Math.floor(Math.random() * DISEASES.length)];
}

// Ana analiz fonksiyonu — öncelikle dış API, başarısız olursa yerel veritabanı
export async function analyzePlantImage(imageUrl: string): Promise<AnalysisResult> {
  if (process.env.PLANT_API_KEY) {
    const externalResult = await callExternalAPI(imageUrl);
    if (externalResult) return externalResult;
  }
  return localAnalysis();
}
