let wordsdata = [ 
  {
    word: 'บ้าน',
    confidence: 1,
    romanization: 'bâan',
    type: 'content',
    pos: 'noun',
    definition: 'house/home',
    notes: '',
    shortphrases: [
      { thai: 'ที่บ้าน', romanization: 'thîi bâan', english: 'at home' },
      { thai: 'บ้านฉัน', romanization: 'bâan chǎn', english: 'my house/home' }
    ],
    longphrases: [
      { thai: 'ฉันอยู่ที่บ้าน', romanization: 'chǎn yùu thîi bâan', english: 'I am at home' }
    ],
    sentences: [
      { thai: 'ฉันกลับบ้านตอนเย็น', romanization: 'chǎn glàp bâan dtaawn yen', english: 'I return home in the evening' }
    ]
  },
  {
    word: 'กิน',
    confidence: 5,
    romanization: 'gin',
    type: 'content',
    pos: 'verb',
    definition: 'to eat',
    notes: '',
    shortphrases: [
      { thai: 'กินข้าว', romanization: 'gin khâao', english: 'eat a meal' },
      { thai: 'กินน้ำ', romanization: 'gin náam', english: 'drink water' }
    ],
    longphrases: [
      { thai: 'ฉันกินข้าวแล้ว', romanization: 'chǎn gin khâao láew', english: 'I have eaten already' }
    ],
    sentences: [
      { thai: 'ฉันกินข้าวตอนเช้า', romanization: 'chǎn gin khâao dtaawn châo', english: 'I eat breakfast' }
    ]
  },
  {
    word: 'น้ำ',
    confidence: 7,
    romanization: 'náam',
    type: 'content',
    pos: 'noun',
    definition: 'water',
    notes: '',
    shortphrases: [
      { thai: 'น้ำเย็น', romanization: 'náam yen', english: 'cold water' },
      { thai: 'น้ำร้อน', romanization: 'náam rôon', english: 'hot water' }
    ],
    longphrases: [
      { thai: 'ฉันดื่มน้ำเย็น', romanization: 'chǎn dʉ̀ʉm náam yen', english: 'I drink cold water' }
    ],
    sentences: [
      { thai: 'ฉันชอบดื่มน้ำ', romanization: 'chǎn chɔ̂ɔp dʉ̀ʉm náam', english: 'I like to drink water' }
    ]
  },
  {
    word: 'เรียน',
    confidence: 3,
    romanization: 'rián',
    type: 'content',
    pos: 'verb',
    definition: 'to study/learn',
    notes: '',
    shortphrases: [
      { thai: 'เรียนภาษาไทย', romanization: 'rián phaa sǎa thai', english: 'study Thai (language)' },
      { thai: 'เรียนหนังสือ', romanization: 'rián nǎngsʉ̌ʉ', english: 'study (books)' }
    ],
    longphrases: [
      { thai: 'ฉันเรียนภาษาไทยทุกวัน', romanization: 'chǎn rián phaa sǎa thai thúk wan', english: 'I study Thai every day' }
    ],
    sentences: [
      { thai: 'ฉันเรียนหนังสือที่โรงเรียน', romanization: 'chǎn rián nǎngsʉ̌ʉ thîi roong rian', english: 'I study at school' }
    ]
  },
  {
    word: 'แล้ว',
    confidence: 2,
    romanization: 'láew',
    type: 'functionary',
    pos: 'particle',
    definition: 'already/then',
    notes: '',
    shortphrases: [
      { thai: 'ไปแล้ว', romanization: 'pai láew', english: 'gone already' },
      { thai: 'กินแล้ว', romanization: 'gin láew', english: 'already ate' }
    ],
    longphrases: [
      { thai: 'เขามาถึงแล้ว', romanization: 'khǎo maa thʉ̌ng láew', english: 'he/she has arrived already' }
    ],
    sentences: [
      { thai: 'เขามาถึงแล้วเมื่อครู่', romanization: 'khǎo maa thʉ̌ng láew mʉ̂a krûu', english: 'he/she arrived just now' }
    ]
  }
];

let quizzes = [
  {
    "title": "Quiz 0",
    "items": [
      { "itemnumber": 1,  "thai": "บ้าน", "item": "บ้าน", "state": "not tested" },
      { "itemnumber": 2,  "thai": "บ้าน", "item": "บ้านฉัน", "state": "not tested" },
      { "itemnumber": 3,  "thai": "บ้าน", "item": "ที่บ้าน", "state": "not tested" },
      { "itemnumber": 4,  "thai": "บ้าน", "item": "ฉันอยู่ที่บ้าน", "state": "not tested" },
      { "itemnumber": 5,  "thai": "บ้าน", "item": "ฉันกลับบ้านตอนเย็น", "state": "not tested" },
      { "itemnumber": 6,  "thai": "แล้ว", "item": "แล้ว", "state": "not tested" },
      { "itemnumber": 7,  "thai": "แล้ว", "item": "ไปแล้ว", "state": "not tested" },
      { "itemnumber": 8,  "thai": "แล้ว", "item": "กินแล้ว", "state": "not tested" },
      { "itemnumber": 9,  "thai": "แล้ว", "item": "เขามาถึงแล้ว", "state": "not tested" },
      { "itemnumber": 10, "thai": "แล้ว", "item": "เขามาถึงแล้วเมื่อครู่", "state": "not tested" },
      { "itemnumber": 11, "thai": "เรียน", "item": "เรียน", "state": "not tested" },
      { "itemnumber": 12, "thai": "เรียน", "item": "เรียนหนังสือ", "state": "not tested" },
      { "itemnumber": 13, "thai": "เรียน", "item": "เรียนภาษาไทย", "state": "not tested" },
      { "itemnumber": 14, "thai": "เรียน", "item": "ฉันเรียนภาษาไทยทุกวัน", "state": "not tested" },
      { "itemnumber": 15, "thai": "เรียน", "item": "ฉันเรียนหนังสือที่โรงเรียน", "state": "not tested" },
      { "itemnumber": 16, "thai": "กิน", "item": "กิน", "state": "not tested" },
      { "itemnumber": 17, "thai": "กิน", "item": "กินน้ำ", "state": "not tested" },
      { "itemnumber": 18, "thai": "กิน", "item": "กินข้าว", "state": "not tested" },
      { "itemnumber": 19, "thai": "กิน", "item": "ฉันกินข้าวแล้ว", "state": "not tested" },
      { "itemnumber": 20, "thai": "กิน", "item": "ฉันกินข้าวตอนเช้า", "state": "not tested" },
      { "itemnumber": 21, "thai": "น้ำ", "item": "น้ำ", "state": "not tested" },
      { "itemnumber": 22, "thai": "น้ำ", "item": "น้ำเย็น", "state": "not tested" },
      { "itemnumber": 23, "thai": "น้ำ", "item": "น้ำร้อน", "state": "not tested" },
      { "itemnumber": 24, "thai": "น้ำ", "item": "ฉันดื่มน้ำเย็น", "state": "not tested" },
      { "itemnumber": 25, "thai": "น้ำ", "item": "ฉันชอบดื่มน้ำ", "state": "not tested" }
    ]
  }
];
