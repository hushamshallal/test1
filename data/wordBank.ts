import { WordPair } from '../types.ts';

// Helper function to assign unique IDs starting from a specific offset
const assignUniqueIds = (words: Omit<WordPair, 'id'>[], startingId: number): WordPair[] => {
  return words.map((word, index) => ({
    ...word,
    id: startingId + index,
  }));
};

const professionsRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"طبيب", english:"Doctor", level:1},
  {arabic:"مهندس", english:"Engineer", level:1},
  {arabic:"مدرس", english:"Teacher", level:1},
  {arabic:"محامي", english:"Lawyer", level:2},
  {arabic:"مبرمج", english:"Programmer", level:1},
  {arabic:"محاسب", english:"Accountant", level:2},
  {arabic:"صيدلي", english:"Pharmacist", level:2},
  {arabic:"مهندس معماري", english:"Architect", level:3},
  {arabic:"مدير", english:"Manager", level:1},
  {arabic:"فنان", english:"Artist", level:1},
];

const educationRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"مدرسة", english:"School", level:1},
  {arabic:"جامعة", english:"University", level:1},
  {arabic:"طالب", english:"Student", level:1},
  {arabic:"معلم", english:"Teacher", level:1},
  {arabic:"محاضرة", english:"Lecture", level:2},
  {arabic:"كتاب", english:"Book", level:1},
  {arabic:"دفتر", english:"Notebook", level:1},
  {arabic:"صف", english:"Class", level:1},
  {arabic:"امتحان", english:"Exam", level:1},
  {arabic:"بحث", english:"Research", level:2},
];

const technologyRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"حاسوب", english:"Computer", level:1},
  {arabic:"لابتوب", english:"Laptop", level:1},
  {arabic:"هاتف ذكي", english:"Smartphone", level:1},
  {arabic:"برمجة", english:"Programming", level:2},
  {arabic:"تطبيق", english:"App", level:1},
  {arabic:"موقع إلكتروني", english:"Website", level:2},
  {arabic:"شبكة", english:"Network", level:2},
  {arabic:"خادم", english:"Server", level:3},
  {arabic:"قاعدة بيانات", english:"Database", level:3},
  {arabic:"تكنولوجيا", english:"Technology", level:1},
];

const healthRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"صحة", english:"Health", level:1},
  {arabic:"طبيب", english:"Doctor", level:1},
  {arabic:"ممرض", english:"Nurse", level:1},
  {arabic:"عيادة", english:"Clinic", level:1},
  {arabic:"مستشفى", english:"Hospital", level:1},
  {arabic:"مرض", english:"Disease", level:1},
  {arabic:"أعراض", english:"Symptoms", level:1},
  {arabic:"علاج", english:"Treatment", level:1},
  {arabic:"دواء", english:"Medicine", level:1},
  {arabic:"التهاب", english:"Inflammation", level:2},
];

const natureRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"شجرة", english:"Tree", level:1},
  {arabic:"زهرة", english:"Flower", level:1},
  {arabic:"عشب", english:"Grass", level:1},
  {arabic:"غابة", english:"Forest", level:1},
  {arabic:"نهر", english:"River", level:1},
  {arabic:"بحيرة", english:"Lake", level:1},
  {arabic:"جبل", english:"Mountain", level:1},
  {arabic:"تلة", english:"Hill", level:1},
  {arabic:"صحراء", english:"Desert", level:2},
  {arabic:"سهل", english:"Plain", level:1},
];

const travelRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"سفر", english:"Travel", level:1},
  {arabic:"رحلة", english:"Trip", level:1},
  {arabic:"مطار", english:"Airport", level:1},
  {arabic:"طائرة", english:"Plane", level:1},
  {arabic:"حجز", english:"Booking", level:1},
  {arabic:"تذكرة", english:"Ticket", level:1},
  {arabic:"جواز سفر", english:"Passport", level:1},
  {arabic:"تأشيرة", english:"Visa", level:2},
  {arabic:"فندق", english:"Hotel", level:1},
  {arabic:"سائح", english:"Tourist", level:1},
];

const foodRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"خبز", english:"Bread", level:1},
  {arabic:"حليب", english:"Milk", level:1},
  {arabic:"ماء", english:"Water", level:1},
  {arabic:"بيض", english:"Eggs", level:1},
  {arabic:"جبن", english:"Cheese", level:1},
  {arabic:"لحم", english:"Meat", level:1},
  {arabic:"دجاج", english:"Chicken", level:1},
  {arabic:"خضار", english:"Vegetables", level:1},
  {arabic:"فواكه", english:"Fruits", level:1},
  {arabic:"أرز", english:"Rice", level:1},
];

const societyRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"مجتمع", english:"Society", level:1},
  {arabic:"حكومة", english:"Government", level:1},
  {arabic:"رئيس", english:"President", level:1},
  {arabic:"وزير", english:"Minister", level:1},
  {arabic:"سياسة", english:"Politics", level:2},
  {arabic:"قانون", english:"Law", level:1},
  {arabic:"حقوق", english:"Rights", level:1},
  {arabic:"مدينة", english:"City", level:1},
  {arabic:"شرطة", english:"Police", level:1},
  {arabic:"اقتصاد", english:"Economy", level:2},
];

const artRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"فن", english:"Art", level:1},
  {arabic:"ثقافة", english:"Culture", level:1},
  {arabic:"موسيقى", english:"Music", level:1},
  {arabic:"رسم", english:"Painting", level:1},
  {arabic:"نحت", english:"Sculpture", level:2},
  {arabic:"رقص", english:"Dance", level:1},
  {arabic:"مسرح", english:"Theater", level:2},
  {arabic:"أدب", english:"Literature", level:2},
  {arabic:"شعر", english:"Poetry", level:2},
  {arabic:"سينما", english:"Cinema", level:1},
];

const homeRaw: Omit<WordPair, 'id'>[] = [
  {arabic:"منزل", english:"House", level:1},
  {arabic:"شقة", english:"Apartment", level:1},
  {arabic:"غرفة", english:"Room", level:1},
  {arabic:"مطبخ", english:"Kitchen", level:1},
  {arabic:"حمام", english:"Bathroom", level:1},
  {arabic:"أثاث", english:"Furniture", level:1},
  {arabic:"كرسي", english:"Chair", level:1},
  {arabic:"طاولة", english:"Table", level:1},
  {arabic:"سرير", english:"Bed", level:1},
  {arabic:"باب", english:"Door", level:1},
];

const generalWordsRaw: Omit<WordPair, 'id'>[] = [
  { arabic: "وقت", english: "Time", level: 1},
  { arabic: "يوم", english: "Day", level: 1},
  { arabic: "أسبوع", english: "Week", level: 1},
  { arabic: "شهر", english: "Month", level: 1},
  { arabic: "سنة", english: "Year", level: 1},
];

const professions = assignUniqueIds(professionsRaw, 1);
const education = assignUniqueIds(educationRaw, 251);
const technology = assignUniqueIds(technologyRaw, 501);
const health = assignUniqueIds(healthRaw, 751);
const nature = assignUniqueIds(natureRaw, 1001);
const travel = assignUniqueIds(travelRaw, 1251);
const food = assignUniqueIds(foodRaw, 1501);
const society = assignUniqueIds(societyRaw, 1751);
const art = assignUniqueIds(artRaw, 2001);
const home = assignUniqueIds(homeRaw, 2251);
const generalWords = assignUniqueIds(generalWordsRaw, 2501);


export const categorizedWordBank: Record<string, WordPair[]> = {
    'المهن والأعمال': professions,
    'التعليم والأكاديميا': education,
    'التقنية والبرمجة': technology,
    'الصحة والطب': health,
    'الطبيعة والبيئة': nature,
    'السفر والسياحة': travel,
    'الطعام والمطبخ': food,
    'المجتمع والحكومة': society,
    'الفن والثقافة': art,
    'المنزل والمفروشات': home,
};

// A combined array of all words for Timed and Zen modes
export const allWords: WordPair[] = [
    ...Object.values(categorizedWordBank).flat(),
    ...generalWords
];